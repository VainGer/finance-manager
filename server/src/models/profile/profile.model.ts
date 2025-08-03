import { Profile, ProfileBudget, BudgetCreationData } from "../../types/profile.types"
import db from "../../server"
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt';
import { profile } from "console";
export default class ProfileModel {

    private static profileCollection: string = 'profiles';
    private static expensesCollection: string = 'expenses';
    private static SALT_ROUNDS = 10;

    static async create(profile: Profile) {
        try {
            const hashedPin = await bcrypt.hash(profile.pin, this.SALT_ROUNDS);
            const newProfile = await db.AddDocument(this.profileCollection, {
                ...profile,
                pin: hashedPin
            });
            if (newProfile?.insertedId) {
                return { success: true, insertedId: newProfile.insertedId };
            }
            return { success: false, insertedId: null };
        } catch (error) {
            console.error("Error in ProfileModel.createProfile", error);
            throw new Error("Profile creation failed");
        }
    }


    static async findProfile(username: string, profileName: string) {
        try {
            const profile = await db.GetDocument(this.profileCollection, {
                username, profileName
            });
            if (!profile) {
                return null;
            }
            return profile;
        } catch (error) {
            console.error("Error in ProfileModel.findProfile", error);
            throw new Error("Failed to find profile");
        }
    }

    static async createExpensesDocument(username: string, profileName: string) {
        try {
            const res = await db.AddDocument(ProfileModel.expensesCollection, {
                username,
                profileName,
                categories: []
            });
            return res?.insertedId ?? null;
        } catch (error) {
            console.error("Error in ProfileModel.createExpenses", error);
            throw new Error("Failed to create expenses");
        }
    }

    static async uploadAvatar(avatar: string) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(avatar, {
                folder: 'profile_avatars',
            });
            return uploadResponse.secure_url;
        } catch (error) {
            console.error("Error in ProfileModel.uploadAvatar", error);
            throw new Error("Failed to upload avatar");
        }
    }

    static async comparePin(hashedPin: string, pin: string) {
        return await bcrypt.compare(pin, hashedPin);
    }

    static async getAllProfiles(username: string) {
        try {
            const profilesDB = await db.GetDocuments(this.profileCollection, { username });
            if (!profilesDB || profilesDB.length === 0) {
                return [];
            }
            return profilesDB;
        } catch (error) {
            console.error("Error in ProfileModel.getAllProfiles", error);
            throw new Error("Failed to get profiles");
        }
    }

    static async renameProfile(username: string, oldProfileName: string, newProfileName: string) {
        try {
            const result = await db.UpdateDocument(this.profileCollection, {
                username, profileName: oldProfileName
            }, { profileName: newProfileName });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Profile not found or name is the same" };
            }
            return { success: true, message: "Profile renamed successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.renameProfile", error);
            throw new Error("Failed to rename profile");
        }
    }

    static async updateProfilePin(username: string, profileName: string, newPin: string) {
        try {
            const hashedPin = await bcrypt.hash(newPin, this.SALT_ROUNDS);
            const result = await db.UpdateDocument(this.profileCollection, {
                username, profileName
            }, { pin: hashedPin });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Profile not found or pin is the same" };
            }
            return { success: true, message: "PIN updated successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.updatePin", error);
            throw new Error("Failed to update PIN");
        }
    }

    static async deleteProfile(username: string, profileName: string) {
        try {
            const result = await db.DeleteDocument(this.profileCollection, { username, profileName });
            if (!result || result.deletedCount === 0) {
                return { success: false, message: "Profile not found" };
            }
            return { success: true, message: "Profile deleted successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.deleteProfile", error);
            throw new Error("Failed to delete profile");
        }
    }

    static async setAvatar(username: string, profileName: string, avatar: string) {
        try {
            const uploadedAvatar = await this.uploadAvatar(avatar);
            const result = await db.UpdateDocument(this.profileCollection, { username, profileName }, { avatar: uploadedAvatar });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Profile not found or avatar is the same" };
            }
            return { success: true, message: "Avatar set successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.setAvatar", error);
            throw new Error("Failed to set avatar");
        }
    }

    static async removeAvatar(username: string, profileName: string, avatarUrl: string) {
        try {
            const publicId = this.extractPublicId(avatarUrl);
            const deleteResponse = await cloudinary.uploader.destroy(publicId, { invalidate: true });
            const resultDB = await db.UpdateDocument(this.profileCollection, { username, profileName }, { avatar: null });
            if (!resultDB || resultDB.modifiedCount === 0 || deleteResponse.result !== 'ok') {
                return { success: false, message: "Profile not found or avatar is already removed" };
            }
            return { success: true, message: "Avatar removed successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.removeAvatar", error);
            throw new Error("Failed to remove avatar");
        }
    }

    static async setColor(username: string, profileName: string, color: string) {
        try {
            const result = await db.UpdateDocument(ProfileModel.profileCollection,
                { username, profileName }, { $set: { color } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Profile not found or color is the same" };
            }
            return { success: true, message: "Profile color set successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.setColor", error);
            throw new Error("Failed to set profile color");
        }
    }


    private static extractPublicId(avatarUrl: string) {
        const urlParts = avatarUrl.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');
        if (uploadIndex === -1) throw new Error('Invalid Cloudinary URL');
        const publicIdParts = urlParts.slice(uploadIndex + 1);
        if (/^v\d+/.test(publicIdParts[0])) {
            publicIdParts.shift();
        }
        const lastPart = publicIdParts.pop()!;
        const filename = lastPart.split('.')[0];
        return [...publicIdParts, filename].join('/');
    }
}