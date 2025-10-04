import * as AppErrors from "../../errors/AppError";
import ProfileModel from "../../models/profile/profile.model";
import AccountModel from "../../models/account/account.model";
import CategoryService from "../expenses/category.service";
import { CategoryBudget, Transaction, GroupedTransactions } from "../../types/expenses.types";
import { ProfileCreationData, Profile, SafeProfile, CategorizedFile, ChildProfile, ChildProfileCreationData, ProfileBudget } from "../../types/profile.types";
import { ObjectId } from "mongodb";
import LLM from "../../utils/LLM";
import BusinessModel from "../../models/expenses/business.model";
import JWT from "../../utils/JWT";
import { Account, Token } from "../../types/account.types";
import BudgetService from "../budget/budget.service";
import { formatDateYM } from "../../utils/date.utils";
import TransactionModel from "../../models/expenses/transaction.model";
export default class ProfileService {


    static async createProfile(profileData: ProfileCreationData) {
        if (!profileData.username || !profileData.profileName || !profileData.pin) {
            throw new AppErrors.ValidationError("Username, profile name and PIN are required.");
        }

        const profileExist = await ProfileModel.findProfile(profileData.username, profileData.profileName);
        if (profileExist) {
            throw new AppErrors.ConflictError(`Profile '${profileData.profileName}' already exists.`);
        }

        const expensesId = await ProfileModel.createExpensesDocument(profileData.username, profileData.profileName);
        if (!expensesId) {
            throw new AppErrors.DatabaseError("Failed to create expenses for the profile.");
        }

        let avatarUrl = null;
        if (profileData.avatar) {
            avatarUrl = await ProfileModel.uploadAvatar(profileData.avatar);
            if (!avatarUrl) {
                throw new AppErrors.ServiceUnavailableError("Failed to upload avatar. Please try again later.");
            }
        }
        let allProfiles = await ProfileModel.getAllProfiles(profileData.username);
        let childrenArr: { profileName: string; id: ObjectId }[] = [];
        if (allProfiles && allProfiles.length > 1) {
            allProfiles = allProfiles.filter(p => profileData.profileName !== p.profileName && !p.parentProfile);
            childrenArr = allProfiles.map(p => ({
                profileName: p.profileName,
                id: p._id
            }));
        }
        const profile: Profile = {
            username: profileData.username,
            profileName: profileData.profileName,
            pin: profileData.pin,
            avatar: avatarUrl,
            parentProfile: profileData.parentProfile,
            color: profileData.color,
            createdAt: new Date(),
            updatedAt: new Date(),
            budgets: [],
            expenses: expensesId,
            children: childrenArr
        }
        try {
            const result = await ProfileModel.create(profile);
            if (!result.insertedId || !result.success) {
                throw new AppErrors.DatabaseError("Failed to create profile. Database operation unsuccessful.");
            }
            return { success: true, profileId: result.insertedId, message: "Profile created successfully." };
        } catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.DatabaseError(`Failed to create profile: ${(error as Error).message}`);
        }
    }

    static async createChildProfile(childProfileCreation: ChildProfileCreationData) {
        if (!childProfileCreation.username || !childProfileCreation.profileName || !childProfileCreation.pin) {
            throw new AppErrors.ValidationError("Username, profile name and PIN are required.");
        }

        const profileExist = await ProfileModel.findProfile(childProfileCreation.username, childProfileCreation.profileName);
        if (profileExist) {
            throw new AppErrors.ConflictError(`Profile '${childProfileCreation.profileName}' already exists.`);
        }

        const expensesId = await ProfileModel.createExpensesDocument(childProfileCreation.username, childProfileCreation.profileName);
        if (!expensesId) {
            throw new AppErrors.DatabaseError("Failed to create expenses for the child profile.");
        }

        let avatarUrl = null;
        if (childProfileCreation.avatar) {
            avatarUrl = await ProfileModel.uploadAvatar(childProfileCreation.avatar);
            if (!avatarUrl) {
                throw new AppErrors.ServiceUnavailableError("Failed to upload avatar. Please try again later.");
            }
        }
        const profile: ChildProfile = {
            username: childProfileCreation.username,
            profileName: childProfileCreation.profileName,
            avatar: avatarUrl,
            color: childProfileCreation.color,
            pin: childProfileCreation.pin,
            parentProfile: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            budgets: [],
            expenses: expensesId,
            newBudgets: []
        }

        try {
            const createdProfile = await ProfileModel.create(profile);
            if (!createdProfile.insertedId || !createdProfile.success) {
                throw new AppErrors.DatabaseError("Failed to create child profile. Database operation unsuccessful.");
            }

            const allProfiles = await ProfileModel.getAllProfiles(childProfileCreation.username);
            if (!allProfiles || allProfiles.length === 0) {
                throw new AppErrors.NotFoundError("No profiles found for updating parent-child relationships.");
            }

            const promises = await Promise.all(allProfiles.map(async (profile) => {
                if (profile.parentProfile) {
                    return ProfileModel.addChildToProfile(profile.username, profile.profileName, {
                        name: childProfileCreation.profileName,
                        id: createdProfile.insertedId
                    });
                } else {
                    return { success: true };
                }
            }));

            if (promises.some(result => !result.success)) {
                throw new AppErrors.DatabaseError("Failed to add child to parent profiles. Relationship update unsuccessful.");
            }

            return {
                success: true,
                profileId: createdProfile.insertedId,
                message: "Child profile created successfully."
            };
        } catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.DatabaseError(`Failed to create child profile: ${(error as Error).message}`);
        }
    }

    static async updateProfile(username: string, profileName: string) {
        try {
            if (!username || !profileName) {
                throw new AppErrors.ValidationError("Username and profile name are required.");
            }

            const profile = await ProfileModel.findProfile(username, profileName);
            if (!profile) {
                throw new AppErrors.NotFoundError(`Profile '${profileName}' not found.`);
            }
            const { pin: _, budgets: __, ...safeProfile } = profile;
            return { success: true, profile: safeProfile };
        } catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error updating profile: ${(error as Error).message}`, 500);
        }
    }


    static async validateProfile(username: string, profileName: string, pin: string, device: string,
        remember: boolean = false) {
        try {
            if (!username || !profileName || !pin || !device) {
                throw new AppErrors.ValidationError("Username, profile name, PIN and device are required.");
            }

            const profile = await ProfileModel.findProfile(username, profileName);
            if (!profile) {
                throw new AppErrors.NotFoundError(`Profile '${profileName}' not found.`);
            }

            const isValidPin = await ProfileModel.comparePin(profile.pin, pin);
            if (!isValidPin) {
                throw new AppErrors.UnauthorizedError("Invalid PIN. Access denied.");
            }

            const accessToken = JWT.signAccessToken({ profileId: profile._id.toString() });
            let refreshToken = null;

            if (remember) {
                await AccountModel.cleanupExpiredTokens(username);
                const existingTokens = await AccountModel.getTokens(username, profile._id.toString());
                const validDeviceToken = existingTokens?.tokens?.find((t: Token) =>
                    t.device === device &&
                    JWT.verifyRefreshToken(t.value)
                );

                if (validDeviceToken) {
                    refreshToken = validDeviceToken.value;
                    await AccountModel.updateTokenLastUsed(username, refreshToken);
                } else {
                    refreshToken = JWT.signRefreshToken({ profileId: profile._id.toString() });
                    const tokenData: Token = {
                        value: refreshToken,
                        profileId: profile._id,
                        device,
                        createdAt: new Date(),
                        expiredAt: JWT.getRefreshTokenExpiryDate(refreshToken),
                        maxValidUntil: JWT.getRefreshTokenMaxValidityDate(refreshToken),
                        lastUsedAt: new Date()
                    };
                    await AccountModel.storeToken(username, tokenData);
                    // Also store in ProfileModel for easy revocation
                    await ProfileModel.addRefreshToken(profile._id.toString(), refreshToken);
                }
            }
            const { pin: _, budgets: __, ...safeProfile } = profile;
            return {
                success: true,
                safeProfile,
                message: "Profile validated successfully.",
                tokens: { accessToken, refreshToken }
            };
        } catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error validating profile: ${(error as Error).message}`, 500);
        }
    }

    static async refreshDeviceToken(username: string, profileName: string, device: string) {
        await AccountModel.cleanupExpiredTokens(username);

        const tokens = await AccountModel.getTokens(username, profileName);
        if (!tokens || !tokens.tokens || tokens.tokens.length === 0) {
            return { success: true, message: "No tokens found for the profile on this device.", tokensRemoved: 0 };
        }

        const deviceTokens = tokens.tokens.filter((t: Token) => t.device === device);
        if (!deviceTokens || deviceTokens.length === 0) {
            return { success: true, message: "No tokens found for the profile on this device.", tokensRemoved: 0 };
        }
        const validToken = JWT.verifyRefreshToken(deviceTokens[0].value);
        if (validToken) {
            return { success: true, message: "Existing token is still valid. No need to refresh.", tokensRemoved: 0 };
        }
        const canBeRefreshed = JWT.getRefreshTokenMaxValidityDate(deviceTokens[0].value) > new Date();
        if (!canBeRefreshed) {
            await AccountModel.removeToken(username, deviceTokens[0].value);
            return { success: true, message: "Token expired and cannot be refreshed. Please log in again.", tokensRemoved: 1 };
        }
        const removeResult = await AccountModel.removeToken(username, deviceTokens[0].value);
        if (!removeResult.success) {
            return { success: false, message: "Failed to remove old token. Cannot refresh.", tokensRemoved: 0 };
        }

        const tokenValue = JWT.signRefreshToken({ profileId: deviceTokens[0].profileId.toString() });

        const newToken: Token = {
            value: tokenValue,
            profileId: deviceTokens[0].profileId,
            device,
            createdAt: new Date(),
            expiredAt: JWT.getRefreshTokenExpiryDate(tokenValue),
            maxValidUntil: JWT.getRefreshTokenMaxValidityDate(tokenValue),
            lastUsedAt: new Date()
        };
        const storeResult = await AccountModel.storeToken(username, newToken);
        if (!storeResult.success) {
            return { success: false, message: "Failed to store new token. Cannot refresh.", tokensRemoved: 1 };
        }
        return { success: true, message: "Token refreshed successfully.", tokensRemoved: 1 };
    }

    static async validateByRefreshToken(username: string, profileId: string, refreshToken: string, device: string) {
        try {
            await AccountModel.cleanupExpiredTokens(username);

            const tokens = await AccountModel.getTokens(username, profileId);
            if (!tokens || !tokens.tokens || tokens.tokens.length === 0) {
                throw new AppErrors.UnauthorizedError("No tokens found for the profile.");
            }

            const tokenRecord = tokens.tokens.find((t: Token) => t.value === refreshToken && t.device === device);
            if (!tokenRecord) {
                await this.refreshDeviceToken(username, profileId, device);
                throw new AppErrors.UnauthorizedError("Refresh token not found or does not match the device.");
            }

            const profile = await ProfileModel.findProfileById(username, profileId);
            if (!profile) {
                throw new AppErrors.UnauthorizedError("Profile not found.");
            }

            const valid = JWT.verifyRefreshToken(refreshToken);
            let newTokenRecord;

            if (!valid) {
                try {
                    const maxValidDate = JWT.getRefreshTokenMaxValidityDate(refreshToken);
                    const now = new Date();

                    if (now > maxValidDate) {
                        await AccountModel.removeToken(username, refreshToken);
                        throw new AppErrors.UnauthorizedError("Token expired beyond maximum validity.");
                    }
                    const refreshResult = await this.refreshDeviceToken(username, profileId, device);
                    if (!refreshResult.success) {
                        throw new AppErrors.UnauthorizedError("Failed to refresh token.");
                    }
                    const newTokens = await AccountModel.getTokens(username, profileId);
                    newTokenRecord = newTokens?.tokens?.find((t: Token) => t.device === device);
                    if (!newTokenRecord) {
                        throw new AppErrors.UnauthorizedError("No valid token available after refresh. Please log in again.");
                    }
                } catch (error) {
                    await AccountModel.removeToken(username, refreshToken);
                    if (error instanceof AppErrors.AppError) {
                        throw error;
                    }
                    throw new AppErrors.UnauthorizedError("Invalid refresh token.");
                }
            }
            const accessToken = JWT.signAccessToken({ profileId });
            const newRefreshToken = newTokenRecord ? newTokenRecord.value : refreshToken;
            if (!newTokenRecord) {
                await AccountModel.updateTokenLastUsed(username, refreshToken);
            }
            const tokensToReturn = { accessToken, refreshToken: newRefreshToken };
            const { pin: _, budgets: __, ...safeProfile } = profile;
            const { password: ___, tokens: ____, ...safeAccount } = await AccountModel.findByUsername(username) as Account;
            return {
                success: true,
                safeProfile,
                safeAccount,
                message: newTokenRecord ? "Token refreshed and validated successfully." : "Token validated successfully.",
                tokens: tokensToReturn
            };
        } catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error validating token: ${(error as Error).message}`, 500);
        }
    }

    static refreshAccessToken(profileId: string) {
        try {
            const newAccessToken = JWT.signAccessToken({ profileId });
            return { success: true, message: "Access token refreshed successfully.", accessToken: newAccessToken };
        } catch (error) {
            throw new AppErrors.AppError(`Error refreshing access token: ${(error as Error).message}`, 500);
        }
    }

    static async revokeRefreshToken(refreshToken: string) {
        try {
            // Verify token to get profileId
            const decoded = JWT.verifyRefreshToken(refreshToken);
            if (!decoded || !decoded.profileId) {
                throw new AppErrors.UnauthorizedError("Invalid refresh token");
            }

            // Remove refresh token from the database
            const result = await ProfileModel.removeRefreshToken(decoded.profileId, refreshToken);
            if (!result) {
                throw new AppErrors.DatabaseError("Failed to revoke refresh token");
            }

            return { success: true, message: "Refresh token revoked successfully" };
        } catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error revoking refresh token: ${(error as Error).message}`, 500);
        }
    }

    static async getAllProfiles(username: string) {
        try {
            if (!username) {
                throw new AppErrors.ValidationError("Username is required.");
            }

            const foundUser = await AccountModel.findByUsername(username);
            if (!foundUser) {
                throw new AppErrors.NotFoundError(`User '${username}' not found.`);
            }

            const profilesDB = await ProfileModel.getAllProfiles(username);
            if (!profilesDB || profilesDB.length === 0) {
                return { success: true, profiles: [] };
            }

            const safeProfiles: SafeProfile[] = profilesDB.map(profile => ({
                profileName: profile.profileName,
                avatar: profile.avatar,
                color: profile.color,
                parentProfile: profile.parentProfile,
            }));

            return { success: true, safeProfiles };
        } catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error retrieving profiles: ${(error as Error).message}`, 500);
        }
    }

    static async renameProfile(username: string, oldProfileName: string, newProfileName: string) {
        if (!username || !oldProfileName || !newProfileName) {
            throw new AppErrors.BadRequestError("Username, old profile name and new profile name are required");
        }
        const profile = await ProfileModel.findProfile(username, oldProfileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const profileExist = await ProfileModel.findProfile(username, newProfileName);
        if (profileExist) {
            throw new AppErrors.ConflictError("Profile already exists");
        }
        const updatedProfile = await ProfileModel.renameProfile(username, oldProfileName,
            newProfileName, profile.expenses, profile.parentProfile);
        if (!updatedProfile) {
            throw new AppErrors.AppError("Failed to rename profile", 500);
        }
        if (!updatedProfile.success) {
            throw new AppErrors.ConflictError(updatedProfile.message);
        }
        return updatedProfile;
    }

    static async changeProfilePin(username: string, profileName: string, oldPin: string, newPin: string) {
        if (!username || !profileName || !oldPin || !newPin) {
            throw new AppErrors.BadRequestError("Username, profile name, old pin and new pin are required");
        }

        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
            throw new AppErrors.BadRequestError("PIN must be exactly 4 digits");
        }

        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const isValidOldPin = await ProfileModel.comparePin(profile.pin, oldPin);
        if (!isValidOldPin) {
            throw new AppErrors.UnauthorizedError("Invalid old PIN");
        }

        const updatedProfile = await ProfileModel.updateProfilePin(username, profileName, newPin);
        if (!updatedProfile) {
            throw new AppErrors.AppError("Failed to change profile PIN", 500);
        }
        if (!updatedProfile.success) {
            throw new AppErrors.ConflictError(updatedProfile.message);
        }
        return updatedProfile;
    }

    static async deleteProfile(username: string, profileName: string, pin: string) {
        if (!username || !profileName || !pin) {
            throw new AppErrors.BadRequestError("Username, profile name and pin are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const isValidPin = await ProfileModel.comparePin(profile.pin, pin);
        if (!isValidPin) {
            throw new AppErrors.UnauthorizedError("Invalid PIN");
        }
        if (profile.avatar) {
            await this.deleteAvatar(username, profileName);
        }
        if (!profile.parentProfile) {
            const allProfiles = await ProfileModel.getAllProfiles(username);
            const parents = allProfiles.filter(p => p.parentProfile);
            for (const parent of parents) {
                await ProfileModel.removeChildFromProfile(parent.username, parent.profileName, profileName);
            }
        }
        const result = await ProfileModel.deleteProfile(username, profileName, profile.expenses);
        if (!result.success) {
            throw new AppErrors.AppError(result.message, 500);
        }
        return result;
    }

    static async setAvatar(username: string, profileName: string, avatar: string) {
        try {
            if (!username || !profileName) {
                throw new AppErrors.ValidationError("Username and profile name are required.");
            }

            const profile = await ProfileModel.findProfile(username, profileName);
            if (!profile) {
                throw new AppErrors.NotFoundError(`Profile '${profileName}' not found.`);
            }

            if (profile.avatar !== null || avatar === null) {
                await ProfileModel.removeAvatar(username, profileName, profile.avatar);
                if (avatar === null) {
                    return { success: true, message: "Avatar removed successfully." };
                }
            }

            const avatarUrl = await ProfileModel.uploadAvatar(avatar);
            if (!avatarUrl) {
                throw new AppErrors.ServiceUnavailableError("Failed to upload avatar. Please try again later.");
            }

            const result = await ProfileModel.setAvatar(username, profileName, avatarUrl);
            if (!result.success) {
                throw new AppErrors.DatabaseError(`Failed to update profile with new avatar: ${result.message}`);
            }

            return { success: true, message: "Avatar set successfully." };
        } catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error setting avatar: ${(error as Error).message}`, 500);
        }
    }

    static async deleteAvatar(username: string, profileName: string) {
        if (!username || !profileName) {
            throw new AppErrors.BadRequestError("Username and profile name are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const result = await ProfileModel.removeAvatar(username, profileName, profile.avatar);
        if (!result.success) {
            throw new AppErrors.AppError("Failed to delete avatar", 500);
        }
        return result;
    }

    static async setColor(username: string, profileName: string, color: string) {
        if (!username || !profileName || !color) {
            throw new AppErrors.BadRequestError("Username, profile name and color are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const result = await ProfileModel.setColor(username, profileName, color);
        if (!result.success) {
            throw new AppErrors.AppError(result.message, 500);
        }
        return { success: true, message: "Profile color set successfully" };
    }

    static async uploadTransactions(username: string, profileName: string, refId: string, transactionsToUpload: CategorizedFile[]) {
        if (!username || !profileName || !refId || !transactionsToUpload) {
            throw new AppErrors.BadRequestError("Username, profile name, refId and transactionsToUpload are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        await this.updateBankNames(refId, transactionsToUpload);
        const incValues = await this.getIncBudgetsValues(username, profileName, transactionsToUpload);
        if (!incValues.success) {
            throw new AppErrors.AppError("Failed to get budgets increase values", 500);
        }
        const { profileInc, categoryInc } = incValues.budgets;
        const groupedTransactions = this.groupTransactions(transactionsToUpload);
        const uploadResult = await TransactionModel.uploadFromFile(profileName, refId, groupedTransactions, profileInc, categoryInc);
        if (!uploadResult || !uploadResult.success) {
            throw new AppErrors.AppError(uploadResult?.message || "Failed to upload transactions", 500);
        }
        return { success: true, message: "Transactions uploaded successfully" };
    }

    private static groupTransactions(transactions: CategorizedFile[]) {
        const groupedMap = new Map<string, GroupedTransactions>();
        for (const t of transactions) {
            const dateObj = new Date(t.date);
            const dateYM = formatDateYM(dateObj); // ✅ uses your util
            const key = `${t.category}::${t.business}::${dateYM}`;
            if (!groupedMap.has(key)) {
                groupedMap.set(key, {
                    category: t.category,
                    business: t.business,
                    dateYM,
                    transactions: []
                });
            }
            groupedMap.get(key)!.transactions.push({
                _id: new ObjectId(),
                amount: t.amount,
                date: dateObj.toISOString(),
                description: t.description
            });
        }
        return Array.from(groupedMap.values());
    }

    private static async getIncBudgetsValues(username: string, profileName: string, transactions: CategorizedFile[]) {
        const budgetsRes = await BudgetService.getBudgets(username, profileName);
        if (!budgetsRes.success) {
            throw new AppErrors.AppError("Failed to get budgets", 500);
        }

        const profileBudgets = budgetsRes.budgets.profile as ProfileBudget[] | undefined;
        const categoriesBudgets = budgetsRes.budgets.categories as { name: string; budgets: CategoryBudget[] }[] | undefined;

        const empty = {
            success: true as const,
            budgets: { profileInc: [] as { id: ObjectId; amount: number }[], categoryInc: [] as { categoryName: string; id: ObjectId; amount: number }[] }
        };

        if (!profileBudgets?.length || !categoriesBudgets?.length) {
            console.log("No budgets found");
            return empty;
        }

        const norm = (s?: string) => (s ?? "").trim();

        const flatCategoryBudgets = categoriesBudgets.flatMap(cat =>
            cat.budgets.map(b => ({
                categoryName: norm(cat.name),
                _id: b._id,
                startDate: new Date(b.startDate),
                endDate: new Date(b.endDate)
            }))
        );

        const categoryIncMap = new Map<string, { categoryName: string; id: ObjectId; amount: number }>();
        const profileIncMap = new Map<string, number>();

        for (const t of transactions) {
            const tCategory = norm(t.category);
            const tDate = new Date(t.date);
            const matchingBudgets = flatCategoryBudgets.filter(cb => {
                const end = new Date(cb.endDate);
                end.setHours(23, 59, 59, 999);
                return cb.categoryName === tCategory && tDate >= cb.startDate && tDate <= end;
            });

            for (const budget of matchingBudgets) {
                const key = `${tCategory}_${budget._id.toString()}`;
                const existing = categoryIncMap.get(key);
                if (existing) {
                    existing.amount += t.amount;
                } else {
                    categoryIncMap.set(key, { categoryName: tCategory, id: budget._id, amount: t.amount });
                }
                const pid = budget._id.toString();
                profileIncMap.set(pid, (profileIncMap.get(pid) ?? 0) + t.amount);
            }
        }

        const categoryInc = Array.from(categoryIncMap.values());
        const profileInc = Array.from(profileIncMap.entries()).map(([id, amount]) => ({
            id: new ObjectId(id),
            amount
        }));

        if (!categoryInc.length && !profileInc.length) {
            console.log("No budgets increase found");
            return empty;
        }

        return { success: true as const, budgets: { profileInc, categoryInc } };
    }



    static async categorizeTransactions(refId: string, transactionsData: string) {
        if (!refId || !transactionsData) {
            throw new AppErrors.BadRequestError("Reference ID and transactions data are required");
        }
        const categories = await CategoryService.getProfileExpenses(refId);
        const categoriesAndBusinesses = categories.categories.map((category: any) => {
            return {
                categoryName: category.name,
                businesses: category.Businesses.map((business: any) => ({ name: business.name, bankNames: business.bankNames }))
            };
        });
        const categorizedData = await LLM.categorizeTransactions(JSON.stringify(categoriesAndBusinesses), transactionsData);
        return categorizedData;
    }

    private static async updateBankNames(refId: string, transactionFile: CategorizedFile[]) {
        const uniqueSet = new Set<{ business: string; bank: string; category: string }>();
        transactionFile.forEach(transaction => {
            uniqueSet.add({ business: transaction.business, bank: transaction.bank, category: transaction.category });
        });
        const uniqueToArr = Array.from(uniqueSet);
        const results = await Promise.all(uniqueToArr.map(async (item) => {
            return await BusinessModel.updateBusinessBankName(refId, item.category, item.business, item.bank);
        }));
        if (results.some(result => !result.success)) {
            throw new AppErrors.AppError("Failed to update some business bank names", 500);
        }
        return true;
    }


}
