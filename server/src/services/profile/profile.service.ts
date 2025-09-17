import * as AppErrors from "../../errors/AppError";
import ProfileModel from "../../models/profile/profile.model";
import AccountModel from "../../models/account/account.model";
import CategoryService from "../expenses/category.service";
import { ProfileCreationData, Profile, SafeProfile, ProfileBudget, BudgetCreationData, CategorizedFile, ChildProfile, ChildProfileCreationData } from "../../types/profile.types";
import { CategoryBudget, Transaction, TransactionWithoutId } from "../../types/expenses.types";
import { ObjectId } from "mongodb";
import LLM from "../../utils/LLM";
import BusinessModel from "../../models/expenses/business.model";
import TransactionService from "../expenses/transaction.service";

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

            return { success: true, profile };
        } catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error updating profile: ${(error as Error).message}`, 500);
        }
    }


    static async validateProfile(username: string, profileName: string, pin: string) {
        try {
            if (!username || !profileName || !pin) {
                throw new AppErrors.ValidationError("Username, profile name and PIN are required.");
            }

            const profile = await ProfileModel.findProfile(username, profileName);
            if (!profile) {
                throw new AppErrors.NotFoundError(`Profile '${profileName}' not found.`);
            }

            const isValidPin = await ProfileModel.comparePin(profile.pin, pin);
            if (!isValidPin) {
                throw new AppErrors.UnauthorizedError("Invalid PIN. Access denied.");
            }

            const { pin: _, budgets: __, ...safeProfile } = profile;
            return {
                success: true,
                safeProfile,
                message: "Profile validated successfully."
            };
        } catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error validating profile: ${(error as Error).message}`, 500);
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
        const updatedProfile = await ProfileModel.renameProfile(username, oldProfileName, newProfileName, profile.expenses);
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
        for (const item of transactionsToUpload) {
            const transaction: TransactionWithoutId = {
                amount: item.amount,
                date: new Date(item.date),
                description: item.description
            }
            const result = await TransactionService.create(refId, item.category, item.business, transaction);
            if (!result || !result.success) {
                throw new AppErrors.AppError(result?.message || "Failed to create transaction", 500);
            }
        }
        return { success: true, message: "Transactions uploaded successfully" };
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
