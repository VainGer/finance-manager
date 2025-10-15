"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppErrors = __importStar(require("../../errors/AppError"));
const profile_model_1 = __importDefault(require("../../models/profile/profile.model"));
const account_model_1 = __importDefault(require("../../models/account/account.model"));
const category_service_1 = __importDefault(require("../expenses/category.service"));
const mongodb_1 = require("mongodb");
const LLM_1 = __importDefault(require("../../utils/LLM"));
const business_model_1 = __importDefault(require("../../models/expenses/business.model"));
const JWT_1 = __importDefault(require("../../utils/JWT"));
const budget_service_1 = __importDefault(require("../budget/budget.service"));
const date_utils_1 = require("../../utils/date.utils");
const transaction_model_1 = __importDefault(require("../../models/expenses/transaction.model"));
const ai_service_1 = __importDefault(require("../ai/ai.service"));
const admin_service_1 = __importDefault(require("../admin/admin.service"));
class ProfileService {
    static async createProfile(profileData) {
        if (!profileData.username || !profileData.profileName || !profileData.pin) {
            throw new AppErrors.ValidationError("Username, profile name and PIN are required.");
        }
        const profileExist = await profile_model_1.default.findProfile(profileData.username, profileData.profileName);
        if (profileExist) {
            throw new AppErrors.ConflictError(`Profile '${profileData.profileName}' already exists.`);
        }
        let avatarUrl = null;
        if (profileData.avatar) {
            avatarUrl = await profile_model_1.default.uploadAvatar(profileData.avatar);
            if (!avatarUrl) {
                throw new AppErrors.ServiceUnavailableError("Failed to upload avatar. Please try again later.");
            }
        }
        let allProfiles = await profile_model_1.default.getAllProfiles(profileData.username);
        let childrenArr = [];
        if (allProfiles?.length) {
            childrenArr = allProfiles
                .filter(p => p.profileName !== profileData.profileName && !p.parentProfile)
                .map(p => ({ profileName: p.profileName, id: p._id }));
        }
        const profile = {
            username: profileData.username,
            profileName: profileData.profileName,
            pin: profileData.pin,
            avatar: avatarUrl,
            parentProfile: profileData.parentProfile,
            color: profileData.color,
            createdAt: new Date(),
            updatedAt: new Date(),
            budgets: [],
            children: childrenArr
        };
        try {
            const result = await profile_model_1.default.create(profile);
            if (!result.profileId || !result.success) {
                throw new AppErrors.DatabaseError("Failed to create profile. Database operation unsuccessful.");
            }
            admin_service_1.default.logAction({
                type: "create",
                executeAccount: profileData.username,
                executeProfile: profileData.profileName,
                action: "create_profile",
                target: profileData
            });
            return { success: true, profileId: result.profileId, message: "Profile created successfully." };
        }
        catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.DatabaseError(`Failed to create profile: ${error.message}`);
        }
    }
    static async createChildProfile(childProfileData) {
        if (!childProfileData.username || !childProfileData.profileName || !childProfileData.pin) {
            throw new AppErrors.ValidationError("Username, profile name and PIN are required.");
        }
        const profileExist = await profile_model_1.default.findProfile(childProfileData.username, childProfileData.profileName);
        if (profileExist) {
            throw new AppErrors.ConflictError(`Profile '${childProfileData.profileName}' already exists.`);
        }
        let avatarUrl = null;
        if (childProfileData.avatar) {
            avatarUrl = await profile_model_1.default.uploadAvatar(childProfileData.avatar);
            if (!avatarUrl) {
                throw new AppErrors.ServiceUnavailableError("Failed to upload avatar. Please try again later.");
            }
        }
        const childProfile = {
            ...childProfileData,
            avatar: avatarUrl,
            parentProfile: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            budgets: [],
            newBudgets: []
        };
        let createdProfileId;
        try {
            const result = await profile_model_1.default.create(childProfile);
            if (!result.profileId || !result.success) {
                throw new AppErrors.DatabaseError("Failed to create child profile. Transaction unsuccessful.");
            }
            createdProfileId = result.profileId;
        }
        catch (error) {
            if (error instanceof AppErrors.AppError)
                throw error;
            throw new AppErrors.DatabaseError(`Failed to create child profile: ${error.message}`);
        }
        const allProfiles = await profile_model_1.default.getAllProfiles(childProfileData.username);
        if (!allProfiles || allProfiles.length === 0) {
            throw new AppErrors.NotFoundError("No parent profiles found for linking child.");
        }
        const parentProfiles = allProfiles.filter(p => p.parentProfile);
        const updateResults = await Promise.all(parentProfiles.map(parent => profile_model_1.default.addChildToProfile(parent.username, parent.profileName, {
            name: childProfileData.profileName,
            id: createdProfileId
        })));
        if (updateResults.some(r => !r.success)) {
            throw new AppErrors.DatabaseError("Failed to add child to one or more parent profiles.");
        }
        admin_service_1.default.logAction({
            type: "create",
            executeAccount: childProfileData.username,
            executeProfile: childProfileData.profileName,
            action: "create_child_profile",
            target: childProfileData
        });
        return {
            success: true,
            profileId: createdProfileId,
            message: "Child profile created successfully."
        };
    }
    static async updateProfile(username, profileName) {
        try {
            if (!username || !profileName) {
                throw new AppErrors.ValidationError("Username and profile name are required.");
            }
            const profile = await profile_model_1.default.findProfile(username, profileName);
            if (!profile) {
                throw new AppErrors.NotFoundError(`Profile '${profileName}' not found.`);
            }
            const { pin: _, budgets: __, ...safeProfile } = profile;
            return { success: true, profile: safeProfile };
        }
        catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error updating profile: ${error.message}`, 500);
        }
    }
    static async validateProfile(username, profileName, pin, device, remember = false) {
        try {
            if (!username || !profileName || !pin || !device) {
                throw new AppErrors.ValidationError("Username, profile name, PIN and device are required.");
            }
            const profile = await profile_model_1.default.findProfile(username, profileName);
            if (!profile) {
                throw new AppErrors.NotFoundError(`Profile '${profileName}' not found.`);
            }
            const isValidPin = await profile_model_1.default.comparePin(profile.pin, pin);
            if (!isValidPin) {
                throw new AppErrors.UnauthorizedError("Invalid PIN. Access denied.");
            }
            const accessToken = JWT_1.default.signAccessToken({ profileId: profile._id.toString() });
            let refreshToken = null;
            if (remember) {
                await account_model_1.default.cleanupExpiredTokens(username);
                const existingTokens = await account_model_1.default.getTokens(username, profile._id.toString());
                const validDeviceToken = existingTokens?.tokens?.find((t) => t.device === device &&
                    JWT_1.default.verifyRefreshToken(t.value));
                if (validDeviceToken) {
                    refreshToken = validDeviceToken.value;
                    await account_model_1.default.updateTokenLastUsed(username, refreshToken);
                }
                else {
                    refreshToken = JWT_1.default.signRefreshToken({ profileId: profile._id.toString() });
                    const tokenData = {
                        value: refreshToken,
                        profileId: profile._id,
                        device,
                        createdAt: new Date(),
                        expiredAt: JWT_1.default.getRefreshTokenExpiryDate(refreshToken),
                        maxValidUntil: JWT_1.default.getRefreshTokenMaxValidityDate(refreshToken),
                        lastUsedAt: new Date()
                    };
                    await account_model_1.default.storeToken(username, tokenData);
                    await profile_model_1.default.addRefreshToken(profile._id.toString(), refreshToken);
                }
            }
            const { pin: _, budgets: __, ...safeProfile } = profile;
            ai_service_1.default.generateCoachingReport(profile.username, profile.profileName, profile._id.toString());
            admin_service_1.default.logAction({
                type: "login",
                executeAccount: username,
                executeProfile: profileName,
                action: "profile_login",
                target: { device, remember }
            });
            return {
                success: true,
                safeProfile,
                message: "Profile validated successfully.",
                tokens: { accessToken, refreshToken }
            };
        }
        catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error validating profile: ${error.message}`, 500);
        }
    }
    static async refreshDeviceToken(username, profileName, device) {
        await account_model_1.default.cleanupExpiredTokens(username);
        const tokens = await account_model_1.default.getTokens(username, profileName);
        if (!tokens || !tokens.tokens || tokens.tokens.length === 0) {
            return { success: true, message: "No tokens found for the profile on this device.", tokensRemoved: 0 };
        }
        const deviceTokens = tokens.tokens.filter((t) => t.device === device);
        if (!deviceTokens || deviceTokens.length === 0) {
            return { success: true, message: "No tokens found for the profile on this device.", tokensRemoved: 0 };
        }
        const validToken = JWT_1.default.verifyRefreshToken(deviceTokens[0].value);
        if (validToken) {
            return { success: true, message: "Existing token is still valid. No need to refresh.", tokensRemoved: 0 };
        }
        const canBeRefreshed = JWT_1.default.getRefreshTokenMaxValidityDate(deviceTokens[0].value) > new Date();
        if (!canBeRefreshed) {
            await account_model_1.default.removeToken(username, deviceTokens[0].value);
            return { success: true, message: "Token expired and cannot be refreshed. Please log in again.", tokensRemoved: 1 };
        }
        const removeResult = await account_model_1.default.removeToken(username, deviceTokens[0].value);
        if (!removeResult.success) {
            return { success: false, message: "Failed to remove old token. Cannot refresh.", tokensRemoved: 0 };
        }
        const tokenValue = JWT_1.default.signRefreshToken({ profileId: deviceTokens[0].profileId.toString() });
        const newToken = {
            value: tokenValue,
            profileId: deviceTokens[0].profileId,
            device,
            createdAt: new Date(),
            expiredAt: JWT_1.default.getRefreshTokenExpiryDate(tokenValue),
            maxValidUntil: JWT_1.default.getRefreshTokenMaxValidityDate(tokenValue),
            lastUsedAt: new Date()
        };
        const storeResult = await account_model_1.default.storeToken(username, newToken);
        if (!storeResult.success) {
            return { success: false, message: "Failed to store new token. Cannot refresh.", tokensRemoved: 1 };
        }
        admin_service_1.default.logAction({
            type: "update",
            executeAccount: username,
            executeProfile: profileName,
            action: "refresh_device_token",
            target: { device }
        });
        return { success: true, message: "Token refreshed successfully.", tokensRemoved: 1 };
    }
    static async validateByRefreshToken(username, profileId, refreshToken, device) {
        try {
            await account_model_1.default.cleanupExpiredTokens(username);
            const tokens = await account_model_1.default.getTokens(username, profileId);
            if (!tokens || !tokens.tokens || tokens.tokens.length === 0) {
                throw new AppErrors.UnauthorizedError("No tokens found for the profile.");
            }
            const tokenRecord = tokens.tokens.find((t) => t.value === refreshToken && t.device === device);
            if (!tokenRecord) {
                await this.refreshDeviceToken(username, profileId, device);
                throw new AppErrors.UnauthorizedError("Refresh token not found or does not match the device.");
            }
            const profile = await profile_model_1.default.findProfileById(username, profileId);
            if (!profile) {
                throw new AppErrors.UnauthorizedError("Profile not found.");
            }
            const valid = JWT_1.default.verifyRefreshToken(refreshToken);
            let newTokenRecord;
            if (!valid) {
                try {
                    const maxValidDate = JWT_1.default.getRefreshTokenMaxValidityDate(refreshToken);
                    const now = new Date();
                    if (now > maxValidDate) {
                        await account_model_1.default.removeToken(username, refreshToken);
                        throw new AppErrors.UnauthorizedError("Token expired beyond maximum validity.");
                    }
                    const refreshResult = await this.refreshDeviceToken(username, profileId, device);
                    if (!refreshResult.success) {
                        throw new AppErrors.UnauthorizedError("Failed to refresh token.");
                    }
                    const newTokens = await account_model_1.default.getTokens(username, profileId);
                    newTokenRecord = newTokens?.tokens?.find((t) => t.device === device);
                    if (!newTokenRecord) {
                        throw new AppErrors.UnauthorizedError("No valid token available after refresh. Please log in again.");
                    }
                }
                catch (error) {
                    await account_model_1.default.removeToken(username, refreshToken);
                    if (error instanceof AppErrors.AppError) {
                        throw error;
                    }
                    throw new AppErrors.UnauthorizedError("Invalid refresh token.");
                }
            }
            const accessToken = JWT_1.default.signAccessToken({ profileId });
            const newRefreshToken = newTokenRecord ? newTokenRecord.value : refreshToken;
            if (!newTokenRecord) {
                await account_model_1.default.updateTokenLastUsed(username, refreshToken);
            }
            const tokensToReturn = { accessToken, refreshToken: newRefreshToken };
            const { pin: _, budgets: __, ...safeProfile } = profile;
            const { password: ___, tokens: ____, ...safeAccount } = await account_model_1.default.findByUsername(username);
            try {
                ai_service_1.default.generateCoachingReport(profile.username, profile.profileName, profile._id.toString());
            }
            catch (err) {
                console.error("AI Coaching report generation failed:", err);
            }
            admin_service_1.default.logAction({
                type: "login",
                executeAccount: username,
                executeProfile: profile.profileName,
                action: "validate_by_refresh_token",
                target: { device }
            });
            return {
                success: true,
                safeProfile,
                safeAccount,
                message: newTokenRecord ? "Token refreshed and validated successfully." : "Token validated successfully.",
                tokens: tokensToReturn
            };
        }
        catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error validating token: ${error.message}`, 500);
        }
    }
    static refreshAccessToken(profileId) {
        try {
            const newAccessToken = JWT_1.default.signAccessToken({ profileId });
            return { success: true, message: "Access token refreshed successfully.", accessToken: newAccessToken };
        }
        catch (error) {
            throw new AppErrors.AppError(`Error refreshing access token: ${error.message}`, 500);
        }
    }
    static async revokeRefreshToken(refreshToken) {
        try {
            const decoded = JWT_1.default.verifyRefreshToken(refreshToken);
            if (!decoded || !decoded.profileId) {
                throw new AppErrors.UnauthorizedError("Invalid refresh token");
            }
            const result = await profile_model_1.default.removeRefreshToken(decoded.profileId, refreshToken);
            if (!result) {
                throw new AppErrors.DatabaseError("Failed to revoke refresh token");
            }
            admin_service_1.default.logAction({
                type: "delete",
                executeAccount: "system",
                action: "revoke_refresh_token",
                target: { refreshToken }
            });
            return { success: true, message: "Refresh token revoked successfully" };
        }
        catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error revoking refresh token: ${error.message}`, 500);
        }
    }
    static async getAllProfiles(username) {
        try {
            if (!username) {
                throw new AppErrors.ValidationError("Username is required.");
            }
            const foundUser = await account_model_1.default.findByUsername(username);
            if (!foundUser) {
                throw new AppErrors.NotFoundError(`User '${username}' not found.`);
            }
            const profilesDB = await profile_model_1.default.getAllProfiles(username);
            if (!profilesDB || profilesDB.length === 0) {
                return { success: true, profiles: [] };
            }
            const safeProfiles = profilesDB.map(profile => ({
                profileName: profile.profileName,
                avatar: profile.avatar,
                color: profile.color,
                parentProfile: profile.parentProfile,
            }));
            return { success: true, safeProfiles };
        }
        catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error retrieving profiles: ${error.message}`, 500);
        }
    }
    static async renameProfile(username, oldProfileName, newProfileName) {
        if (!username || !oldProfileName || !newProfileName) {
            throw new AppErrors.BadRequestError("Username, old profile name and new profile name are required");
        }
        const profile = await profile_model_1.default.findProfile(username, oldProfileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const profileExist = await profile_model_1.default.findProfile(username, newProfileName);
        if (profileExist) {
            throw new AppErrors.ConflictError("Profile already exists");
        }
        const updatedProfile = await profile_model_1.default.renameProfile(username, oldProfileName, newProfileName, profile.expenses, profile.parentProfile);
        if (!updatedProfile) {
            throw new AppErrors.AppError("Failed to rename profile", 500);
        }
        if (!updatedProfile.success) {
            throw new AppErrors.ConflictError(updatedProfile.message);
        }
        admin_service_1.default.logAction({
            type: "update",
            executeAccount: username,
            executeProfile: oldProfileName,
            action: "rename_profile",
            target: { oldProfileName, newProfileName }
        });
        return updatedProfile;
    }
    static async changeProfilePin(username, profileName, oldPin, newPin) {
        if (!username || !profileName || !oldPin || !newPin) {
            throw new AppErrors.BadRequestError("Username, profile name, old pin and new pin are required");
        }
        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
            throw new AppErrors.BadRequestError("PIN must be exactly 4 digits");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const isValidOldPin = await profile_model_1.default.comparePin(profile.pin, oldPin);
        if (!isValidOldPin) {
            throw new AppErrors.UnauthorizedError("Invalid old PIN");
        }
        const updatedProfile = await profile_model_1.default.updateProfilePin(username, profileName, newPin);
        if (!updatedProfile) {
            throw new AppErrors.AppError("Failed to change profile PIN", 500);
        }
        if (!updatedProfile.success) {
            throw new AppErrors.ConflictError(updatedProfile.message);
        }
        admin_service_1.default.logAction({
            type: "update",
            executeAccount: username,
            executeProfile: profileName,
            action: "change_profile_pin",
            target: { profileName }
        });
        return updatedProfile;
    }
    static async deleteProfile(username, profileName, pin) {
        if (!username || !profileName || !pin) {
            throw new AppErrors.BadRequestError("Username, profile name and pin are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const isValidPin = await profile_model_1.default.comparePin(profile.pin, pin);
        if (!isValidPin) {
            throw new AppErrors.UnauthorizedError("Invalid PIN");
        }
        if (profile.avatar) {
            await this.deleteAvatar(username, profileName);
        }
        if (!profile.parentProfile) {
            const allProfiles = await profile_model_1.default.getAllProfiles(username);
            const parents = allProfiles.filter(p => p.parentProfile);
            for (const parent of parents) {
                await profile_model_1.default.removeChildFromProfile(parent.username, parent.profileName, profileName);
            }
        }
        const result = await profile_model_1.default.deleteProfile(username, profileName, profile.expenses);
        if (!result.success) {
            throw new AppErrors.AppError(result.message, 500);
        }
        admin_service_1.default.logAction({
            type: "delete",
            executeAccount: username,
            executeProfile: profileName,
            action: "delete_profile",
            target: { profileName }
        });
        return result;
    }
    static async setAvatar(username, profileName, avatar) {
        try {
            if (!username || !profileName) {
                throw new AppErrors.ValidationError("Username and profile name are required.");
            }
            const profile = await profile_model_1.default.findProfile(username, profileName);
            if (!profile) {
                throw new AppErrors.NotFoundError(`Profile '${profileName}' not found.`);
            }
            if (profile.avatar !== null || avatar === null) {
                await profile_model_1.default.removeAvatar(username, profileName, profile.avatar);
                if (avatar === null) {
                    return { success: true, message: "Avatar removed successfully." };
                }
            }
            const avatarUrl = await profile_model_1.default.uploadAvatar(avatar);
            if (!avatarUrl) {
                throw new AppErrors.ServiceUnavailableError("Failed to upload avatar. Please try again later.");
            }
            const result = await profile_model_1.default.setAvatar(username, profileName, avatarUrl);
            if (!result.success) {
                throw new AppErrors.DatabaseError(`Failed to update profile with new avatar: ${result.message}`);
            }
            admin_service_1.default.logAction({
                type: "update",
                executeAccount: username,
                executeProfile: profileName,
                action: "set_avatar",
                target: { hasAvatar: !!avatar }
            });
            return { success: true, message: "Avatar set successfully." };
        }
        catch (error) {
            if (error instanceof AppErrors.AppError) {
                throw error;
            }
            throw new AppErrors.AppError(`Error setting avatar: ${error.message}`, 500);
        }
    }
    static async deleteAvatar(username, profileName) {
        if (!username || !profileName) {
            throw new AppErrors.BadRequestError("Username and profile name are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const result = await profile_model_1.default.removeAvatar(username, profileName, profile.avatar);
        if (!result.success) {
            throw new AppErrors.AppError("Failed to delete avatar", 500);
        }
        admin_service_1.default.logAction({
            type: "delete",
            executeAccount: username,
            executeProfile: profileName,
            action: "delete_avatar",
            target: { profileName }
        });
        return result;
    }
    static async setColor(username, profileName, color) {
        if (!username || !profileName || !color) {
            throw new AppErrors.BadRequestError("Username, profile name and color are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const result = await profile_model_1.default.setColor(username, profileName, color);
        if (!result.success) {
            throw new AppErrors.AppError(result.message, 500);
        }
        admin_service_1.default.logAction({
            type: "update",
            executeAccount: username,
            executeProfile: profileName,
            action: "set_color",
            target: { color }
        });
        return { success: true, message: "Profile color set successfully" };
    }
    static async uploadTransactions(username, profileName, refId, transactionsToUpload) {
        if (!username || !profileName || !refId || !transactionsToUpload) {
            throw new AppErrors.BadRequestError("Username, profile name, refId and transactionsToUpload are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
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
        const uploadResult = await transaction_model_1.default.uploadFromFile(profileName, refId, groupedTransactions, profileInc, categoryInc);
        if (!uploadResult || !uploadResult.success) {
            throw new AppErrors.AppError(uploadResult?.message || "Failed to upload transactions", 500);
        }
        admin_service_1.default.logAction({
            type: "create",
            executeAccount: username,
            executeProfile: profileName,
            action: "upload_transactions",
            target: { refId, count: transactionsToUpload.length }
        });
        return { success: true, message: "Transactions uploaded successfully" };
    }
    static groupTransactions(transactions) {
        const groupedMap = new Map();
        for (const t of transactions) {
            const dateObj = new Date(t.date);
            const dateYM = (0, date_utils_1.formatDateYM)(dateObj); // ✅ uses your util
            const key = `${t.category}::${t.business}::${dateYM}`;
            if (!groupedMap.has(key)) {
                groupedMap.set(key, {
                    category: t.category,
                    business: t.business,
                    dateYM,
                    transactions: []
                });
            }
            groupedMap.get(key).transactions.push({
                _id: new mongodb_1.ObjectId(),
                amount: t.amount,
                date: dateObj.toISOString(),
                description: t.description
            });
        }
        return Array.from(groupedMap.values());
    }
    static async getIncBudgetsValues(username, profileName, transactions) {
        const budgetsRes = await budget_service_1.default.getBudgets(username, profileName);
        if (!budgetsRes.success) {
            throw new AppErrors.AppError("Failed to get budgets", 500);
        }
        const profileBudgets = budgetsRes.budgets.profile;
        const categoriesBudgets = budgetsRes.budgets.categories;
        const empty = {
            success: true,
            budgets: { profileInc: [], categoryInc: [] }
        };
        if (!profileBudgets?.length || !categoriesBudgets?.length) {
            console.log("No budgets found");
            return empty;
        }
        const norm = (s) => (s ?? "").trim();
        const flatCategoryBudgets = categoriesBudgets.flatMap(cat => cat.budgets.map(b => ({
            categoryName: norm(cat.name),
            _id: b._id,
            startDate: new Date(b.startDate),
            endDate: new Date(b.endDate)
        })));
        const categoryIncMap = new Map();
        const profileIncMap = new Map();
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
                }
                else {
                    categoryIncMap.set(key, { categoryName: tCategory, id: budget._id, amount: t.amount });
                }
                const pid = budget._id.toString();
                profileIncMap.set(pid, (profileIncMap.get(pid) ?? 0) + t.amount);
            }
        }
        const categoryInc = Array.from(categoryIncMap.values());
        const profileInc = Array.from(profileIncMap.entries()).map(([id, amount]) => ({
            id: new mongodb_1.ObjectId(id),
            amount
        }));
        if (!categoryInc.length && !profileInc.length) {
            console.log("No budgets increase found");
            return empty;
        }
        return { success: true, budgets: { profileInc, categoryInc } };
    }
    static async categorizeTransactions(refId, transactionsData) {
        if (!refId || !transactionsData) {
            throw new AppErrors.BadRequestError("Reference ID and transactions data are required");
        }
        const categories = await category_service_1.default.getProfileExpenses(refId);
        const categoriesAndBusinesses = categories.map((category) => {
            return {
                categoryName: category.name,
                businesses: category.Businesses.map((business) => ({ name: business.name, bankNames: business.bankNames }))
            };
        });
        const categorizedData = await LLM_1.default.categorizeTransactions(JSON.stringify(categoriesAndBusinesses), transactionsData);
        admin_service_1.default.logAction({
            type: "export",
            executeAccount: "system",
            action: "categorize_transactions",
            target: { refId }
        });
        return categorizedData;
    }
    static async updateBankNames(refId, transactionFile) {
        const uniqueSet = new Set();
        transactionFile.forEach(transaction => {
            uniqueSet.add({ business: transaction.business, bank: transaction.bank, category: transaction.category });
        });
        const uniqueToArr = Array.from(uniqueSet);
        const results = await Promise.all(uniqueToArr.map(async (item) => {
            return await business_model_1.default.updateBusinessBankName(refId, item.category, item.business, item.bank);
        }));
        if (results.some(result => !result.success)) {
            throw new AppErrors.AppError("Failed to update some business bank names", 500);
        }
        return true;
    }
}
exports.default = ProfileService;
//# sourceMappingURL=profile.service.js.map