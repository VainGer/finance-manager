import { BadRequestError, ConflictError, AppError, NotFoundError } from "../../errors/AppError";
import ProfileModel from "../../models/profile/profile.model";
import AccountModel from "../../models/account/account.model";
import { ProfileCreationData, Profile, SafeProfile } from "../../types/profile.types";

export default class ProfileService {

    static async createProfile(profileData: ProfileCreationData) {
        if (!profileData.username || !profileData.profileName || !profileData.pin) {
            throw new BadRequestError("Username, profile name and pin are required");
        }
        const profileExist = await ProfileModel.findProfile(profileData.username, profileData.profileName);
        if (profileExist) {
            throw new ConflictError("Profile already exists");
        }
        const expensesId = await ProfileModel.createExpensesDocument(profileData.username, profileData.profileName);
        if (!expensesId) {
            throw new AppError("Failed to create expenses for the profile", 500);
        }
        let avatarUrl = null;
        if (profileData.avatar) {
            avatarUrl = await ProfileModel.uploadAvatar(profileData.avatar);
            if (!avatarUrl) {
                throw new AppError("Failed to upload avatar", 500);
            }
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
            expenses: expensesId
        }
        const result = await ProfileModel.create(profile);
        if (!result.insertedId || !result.success) {
            throw new AppError("Failed to create profile", 500);
        }
        return { success: true, profileId: result.insertedId, message: "Profile created successfully" };
    }

    static async validateProfile(username: string, profileName: string, pin: string) {
        if (!username || !profileName || !pin) {
            throw new BadRequestError("Username, profile name and pin are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const isValidPin = await ProfileModel.comparePin(profile.pin, pin);
        if (!isValidPin) {
            throw new BadRequestError("Invalid PIN");
        }
        const { pin: _, ...safeProfile } = profile;
        return { success: true, safeProfile, message: "Profile validated successfully" };
    }

    static async getAllProfiles(username: string) {
        if (!username) {
            throw new BadRequestError("Username is required");
        }
        const foundUser = AccountModel.findByUsername(username);
        if (!foundUser) {
            throw new NotFoundError("User not found");
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
    }

    static async renameProfile(username: string, oldProfileName: string, newProfileName: string) {
        if (!username || !oldProfileName || !newProfileName) {
            throw new BadRequestError("Username, old profile name and new profile name are required");
        }
        const profile = await ProfileModel.findProfile(username, oldProfileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const updatedProfile = await ProfileModel.renameProfile(username, oldProfileName, newProfileName);
        if (!updatedProfile) {
            throw new AppError("Failed to rename profile", 500);
        }
        if (!updatedProfile.success) {
            throw new ConflictError(updatedProfile.message);
        }
        return updatedProfile;
    }

    static async changeProfilePin(username: string, profileName: string, oldPin: string, newPin: string) {
        if (!username || !profileName || !oldPin || !newPin) {
            throw new BadRequestError("Username, profile name, old pin and new pin are required");
        }
        
        // Validate PIN length
        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
            throw new BadRequestError("PIN must be exactly 4 digits");
        }
        
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const isValidOldPin = await ProfileModel.comparePin(profile.pin, oldPin);
        if (!isValidOldPin) {
            throw new BadRequestError("Invalid old PIN");
        }

        const updatedProfile = await ProfileModel.updateProfilePin(username, profileName, newPin);
        if (!updatedProfile) {
            throw new AppError("Failed to change profile PIN", 500);
        }
        if (!updatedProfile.success) {
            throw new ConflictError(updatedProfile.message);
        }
        return updatedProfile;
    }

    static async deleteProfile(username: string, profileName: string, pin: string) {
        if (!username || !profileName || !pin) {
            throw new BadRequestError("Username, profile name and pin are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const isValidPin = await ProfileModel.comparePin(profile.pin, pin);
        if (!isValidPin) {
            throw new BadRequestError("Invalid PIN");
        }
        const result = await ProfileModel.deleteProfile(username, profileName);
        if (!result.success) {
            throw new AppError(result.message, 500);
        }
        return result;
    }

    static async setAvatar(username: string, profileName: string, avatar: string) {
        if (!username || !profileName || !avatar) {
            throw new BadRequestError("Username, profile name and avatar are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        if (profile.avatar !== null) {
            await ProfileModel.removeAvatar(username, profileName, profile.avatar);
        }
        const avatarUrl = await ProfileModel.uploadAvatar(avatar);
        if (!avatarUrl) {
            throw new AppError("Failed to upload avatar", 500);
        }
        const result = await ProfileModel.setAvatar(username, profileName, avatarUrl);
        if (!result.success) {
            throw new AppError(result.message, 500);
        }
        return { success: true, message: "Avatar set successfully" };
    }

    static async deleteAvatar(username: string, profileName: string) {
        if (!username || !profileName) {
            throw new BadRequestError("Username and profile name are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const result = await ProfileModel.removeAvatar(username, profileName, profile.avatar);
        if (!result.success) {
            throw new AppError("Failed to delete avatar", 500);
        }
        return result;
    }

    static async setColor(username: string, profileName: string, color: string) {
        if (!username || !profileName || !color) {
            throw new BadRequestError("Username, profile name and color are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const result = await ProfileModel.setColor(username, profileName, color);
        if (!result.success) {
            throw new AppError(result.message, 500);
        }
        return { success: true, message: "Profile color set successfully" };
    }
}

