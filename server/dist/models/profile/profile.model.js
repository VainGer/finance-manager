"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const cloudinary_1 = require("cloudinary");
const bcrypt_1 = __importDefault(require("bcrypt"));
class ProfileModel {
    static profileCollection = 'profiles';
    static expensesCollection = 'expenses';
    static SALT_ROUNDS = 10;
    static async create(profile) {
        try {
            const hashedPin = await bcrypt_1.default.hash(profile.pin, this.SALT_ROUNDS);
            const newProfile = await server_1.default.AddDocument(this.profileCollection, {
                ...profile,
                pin: hashedPin
            });
            if (newProfile?.insertedId) {
                return { success: true, insertedId: newProfile.insertedId };
            }
            return { success: false, insertedId: null };
        }
        catch (error) {
            console.error("Error in ProfileModel.createProfile", error);
            throw new Error("Profile creation failed");
        }
    }
    static async findProfile(username, profileName) {
        try {
            const profile = await server_1.default.GetDocument(this.profileCollection, {
                username, profileName
            });
            if (!profile) {
                return null;
            }
            return profile;
        }
        catch (error) {
            console.error("Error in ProfileModel.findProfile", error);
            throw new Error("Failed to find profile");
        }
    }
    static async createExpensesDocument(username, profileName) {
        try {
            const res = await server_1.default.AddDocument(ProfileModel.expensesCollection, {
                username,
                profileName,
                categories: []
            });
            return res?.insertedId ?? null;
        }
        catch (error) {
            console.error("Error in ProfileModel.createExpenses", error);
            throw new Error("Failed to create expenses");
        }
    }
    static async uploadAvatar(avatar) {
        try {
            const uploadResponse = await cloudinary_1.v2.uploader.upload(avatar, {
                folder: 'profile_avatars',
            });
            return uploadResponse.secure_url;
        }
        catch (error) {
            console.error("Error in ProfileModel.uploadAvatar", error);
            throw new Error("Failed to upload avatar");
        }
    }
    static async comparePin(hashedPin, pin) {
        return await bcrypt_1.default.compare(pin, hashedPin);
    }
    static async getAllProfiles(username) {
        try {
            const profilesDB = await server_1.default.GetDocuments(this.profileCollection, { username });
            if (!profilesDB || profilesDB.length === 0) {
                return [];
            }
            return profilesDB;
        }
        catch (error) {
            console.error("Error in ProfileModel.getAllProfiles", error);
            throw new Error("Failed to get profiles");
        }
    }
    static async renameProfile(username, oldProfileName, newProfileName) {
        try {
            const result = await server_1.default.UpdateDocument(this.profileCollection, {
                username, profileName: oldProfileName
            }, { $set: { profileName: newProfileName } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Profile not found or name is the same" };
            }
            return { success: true, message: "Profile renamed successfully" };
        }
        catch (error) {
            console.error("Error in ProfileModel.renameProfile", error);
            throw new Error("Failed to rename profile");
        }
    }
    static async updateProfilePin(username, profileName, newPin) {
        try {
            const hashedPin = await bcrypt_1.default.hash(newPin, this.SALT_ROUNDS);
            const result = await server_1.default.UpdateDocument(this.profileCollection, {
                username, profileName
            }, { $set: { pin: hashedPin } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Profile not found or pin is the same" };
            }
            return { success: true, message: "PIN updated successfully" };
        }
        catch (error) {
            console.error("Error in ProfileModel.updatePin", error);
            throw new Error("Failed to update PIN");
        }
    }
    static async deleteProfile(username, profileName) {
        try {
            const result = await server_1.default.DeleteDocument(this.profileCollection, { username, profileName });
            if (!result || result.deletedCount === 0) {
                return { success: false, message: "Profile not found" };
            }
            return { success: true, message: "Profile deleted successfully" };
        }
        catch (error) {
            console.error("Error in ProfileModel.deleteProfile", error);
            throw new Error("Failed to delete profile");
        }
    }
    static async setAvatar(username, profileName, avatar) {
        try {
            const uploadedAvatar = await this.uploadAvatar(avatar);
            const result = await server_1.default.UpdateDocument(this.profileCollection, { username, profileName }, { $set: { avatar: uploadedAvatar } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Profile not found or avatar is the same" };
            }
            return { success: true, message: "Avatar set successfully" };
        }
        catch (error) {
            console.error("Error in ProfileModel.setAvatar", error);
            throw new Error("Failed to set avatar");
        }
    }
    static async removeAvatar(username, profileName, avatarUrl) {
        try {
            const publicId = this.extractPublicId(avatarUrl);
            const deleteResponse = await cloudinary_1.v2.uploader.destroy(publicId, { invalidate: true });
            const resultDB = await server_1.default.UpdateDocument(this.profileCollection, { username, profileName }, { $set: { avatar: null } });
            if (!resultDB || resultDB.modifiedCount === 0 || deleteResponse.result !== 'ok') {
                return { success: false, message: "Profile not found or avatar is already removed" };
            }
            return { success: true, message: "Avatar removed successfully" };
        }
        catch (error) {
            console.error("Error in ProfileModel.removeAvatar", error);
            throw new Error("Failed to remove avatar");
        }
    }
    static async setColor(username, profileName, color) {
        try {
            const result = await server_1.default.UpdateDocument(ProfileModel.profileCollection, { username, profileName }, { $set: { color } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Profile not found or color is the same" };
            }
            return { success: true, message: "Profile color set successfully" };
        }
        catch (error) {
            console.error("Error in ProfileModel.setColor", error);
            throw new Error("Failed to set profile color");
        }
    }
    static extractPublicId(avatarUrl) {
        const urlParts = avatarUrl.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');
        if (uploadIndex === -1)
            throw new Error('Invalid Cloudinary URL');
        const publicIdParts = urlParts.slice(uploadIndex + 1);
        if (/^v\d+/.test(publicIdParts[0])) {
            publicIdParts.shift();
        }
        const lastPart = publicIdParts.pop();
        const filename = lastPart.split('.')[0];
        return [...publicIdParts, filename].join('/');
    }
}
exports.default = ProfileModel;
//# sourceMappingURL=profile.model.js.map