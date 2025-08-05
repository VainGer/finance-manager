"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("../../errors/AppError");
const profile_model_1 = __importDefault(require("../../models/profile/profile.model"));
const account_model_1 = __importDefault(require("../../models/account/account.model"));
class ProfileService {
    static async createProfile(profileData) {
        if (!profileData.username || !profileData.profileName || !profileData.pin) {
            throw new AppError_1.BadRequestError("Username, profile name and pin are required");
        }
        const profileExist = await profile_model_1.default.findProfile(profileData.username, profileData.profileName);
        if (profileExist) {
            throw new AppError_1.ConflictError("Profile already exists");
        }
        const expensesId = await profile_model_1.default.createExpensesDocument(profileData.username, profileData.profileName);
        if (!expensesId) {
            throw new AppError_1.AppError("Failed to create expenses for the profile", 500);
        }
        let avatarUrl = null;
        if (profileData.avatar) {
            avatarUrl = await profile_model_1.default.uploadAvatar(profileData.avatar);
            if (!avatarUrl) {
                throw new AppError_1.AppError("Failed to upload avatar", 500);
            }
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
            expenses: expensesId
        };
        const result = await profile_model_1.default.create(profile);
        if (!result.insertedId || !result.success) {
            throw new AppError_1.AppError("Failed to create profile", 500);
        }
        return { success: true, profileId: result.insertedId, message: "Profile created successfully" };
    }
    static async validateProfile(username, profileName, pin) {
        if (!username || !profileName || !pin) {
            throw new AppError_1.BadRequestError("Username, profile name and pin are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppError_1.NotFoundError("Profile not found");
        }
        const isValidPin = await profile_model_1.default.comparePin(profile.pin, pin);
        if (!isValidPin) {
            throw new AppError_1.BadRequestError("Invalid PIN");
        }
        const { pin: _, ...safeProfile } = profile;
        return { success: true, safeProfile, message: "Profile validated successfully" };
    }
    static async getAllProfiles(username) {
        if (!username) {
            throw new AppError_1.BadRequestError("Username is required");
        }
        const foundUser = account_model_1.default.findByUsername(username);
        if (!foundUser) {
            throw new AppError_1.NotFoundError("User not found");
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
    static async renameProfile(username, oldProfileName, newProfileName) {
        if (!username || !oldProfileName || !newProfileName) {
            throw new AppError_1.BadRequestError("Username, old profile name and new profile name are required");
        }
        const profile = await profile_model_1.default.findProfile(username, oldProfileName);
        if (!profile) {
            throw new AppError_1.NotFoundError("Profile not found");
        }
        const updatedProfile = await profile_model_1.default.renameProfile(username, oldProfileName, newProfileName);
        if (!updatedProfile) {
            throw new AppError_1.AppError("Failed to rename profile", 500);
        }
        if (!updatedProfile.success) {
            throw new AppError_1.ConflictError(updatedProfile.message);
        }
        return updatedProfile;
    }
    static async changeProfilePin(username, profileName, oldPin, newPin) {
        if (!username || !profileName || !oldPin || !newPin) {
            throw new AppError_1.BadRequestError("Username, profile name, old pin and new pin are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppError_1.NotFoundError("Profile not found");
        }
        const isValidOldPin = await profile_model_1.default.comparePin(profile.pin, oldPin);
        if (!isValidOldPin) {
            throw new AppError_1.BadRequestError("Invalid old PIN");
        }
        const updatedProfile = await profile_model_1.default.updateProfilePin(username, profileName, newPin);
        if (!updatedProfile) {
            throw new AppError_1.AppError("Failed to change profile PIN", 500);
        }
        if (!updatedProfile.success) {
            throw new AppError_1.ConflictError(updatedProfile.message);
        }
        return updatedProfile;
    }
    static async deleteProfile(username, profileName, pin) {
        if (!username || !profileName || !pin) {
            throw new AppError_1.BadRequestError("Username, profile name and pin are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppError_1.NotFoundError("Profile not found");
        }
        const isValidPin = await profile_model_1.default.comparePin(profile.pin, pin);
        if (!isValidPin) {
            throw new AppError_1.BadRequestError("Invalid PIN");
        }
        const result = await profile_model_1.default.deleteProfile(username, profileName);
        if (!result.success) {
            throw new AppError_1.AppError(result.message, 500);
        }
        return result;
    }
    static async setAvatar(username, profileName, avatar) {
        if (!username || !profileName || !avatar) {
            throw new AppError_1.BadRequestError("Username, profile name and avatar are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppError_1.NotFoundError("Profile not found");
        }
        if (profile.avatar !== null) {
            await profile_model_1.default.removeAvatar(username, profileName, profile.avatar);
        }
        const avatarUrl = await profile_model_1.default.uploadAvatar(avatar);
        if (!avatarUrl) {
            throw new AppError_1.AppError("Failed to upload avatar", 500);
        }
        const result = await profile_model_1.default.setAvatar(username, profileName, avatarUrl);
        if (!result.success) {
            throw new AppError_1.AppError(result.message, 500);
        }
        return { success: true, message: "Avatar set successfully" };
    }
    static async deleteAvatar(username, profileName) {
        if (!username || !profileName) {
            throw new AppError_1.BadRequestError("Username and profile name are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppError_1.NotFoundError("Profile not found");
        }
        const result = await profile_model_1.default.removeAvatar(username, profileName, profile.avatar);
        if (!result.success) {
            throw new AppError_1.AppError("Failed to delete avatar", 500);
        }
        return result;
    }
    static async setColor(username, profileName, color) {
        if (!username || !profileName || !color) {
            throw new AppError_1.BadRequestError("Username, profile name and color are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppError_1.NotFoundError("Profile not found");
        }
        const result = await profile_model_1.default.setColor(username, profileName, color);
        if (!result.success) {
            throw new AppError_1.AppError(result.message, 500);
        }
        return { success: true, message: "Profile color set successfully" };
    }
}
exports.default = ProfileService;
//# sourceMappingURL=profile.service.js.map