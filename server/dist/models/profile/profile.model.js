"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const cloudinary_1 = require("cloudinary");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../dotenv/.env') });
class ProfileModel {
    static profileCollection = 'profiles';
    static expensesCollection = 'expenses';
    static aiCollection = 'ai_history';
    static SALT_ROUNDS = 10;
    static dbName = process.env.DB_NAME;
    static async create(profile) {
        const client = server_1.default.getClient();
        const session = client.startSession();
        try {
            console.log(this.dbName);
            session.startTransaction();
            const hashedPin = await bcrypt_1.default.hash(profile.pin, this.SALT_ROUNDS);
            const expensesResult = await client
                .db(this.dbName)
                .collection(this.expensesCollection)
                .insertOne({
                username: profile.username,
                profileName: profile.profileName,
                categories: []
            }, { session });
            const profileResult = await client
                .db(this.dbName)
                .collection(this.profileCollection)
                .insertOne({
                ...profile,
                expenses: expensesResult.insertedId,
                pin: hashedPin
            }, { session });
            await client
                .db(this.dbName)
                .collection(this.aiCollection)
                .insertOne({
                profileId: profileResult.insertedId,
                status: "idle",
                history: []
            }, { session });
            await session.commitTransaction();
            console.log("Profile and related documents created successfully.");
            return {
                success: true,
                profileId: profileResult.insertedId,
                message: "Profile created successfully."
            };
        }
        catch (error) {
            console.error("Error in ProfileModel.create:", error);
            await session.abortTransaction();
            throw new Error("Profile creation failed");
        }
        finally {
            await session.endSession();
        }
    }
    static async addChildToProfile(username, profileName, children) {
        try {
            const result = await server_1.default.UpdateDocument(this.profileCollection, {
                username, profileName
            }, { $addToSet: { children } });
            if (!result) {
                return { success: false, message: "Profile not found or child already exists" };
            }
            return { success: true, message: "Child added successfully" };
        }
        catch (error) {
            console.error("Error in ProfileModel.addChildToProfile", error);
            throw new Error("Failed to add child to profile");
        }
    }
    static async removeChildFromProfile(username, profileName, childName) {
        try {
            const result = await server_1.default.UpdateDocument(this.profileCollection, {
                username, profileName
            }, { $pull: { children: { name: childName } } });
            if (!result) {
                return { success: false, message: "Profile not found or child does not exist" };
            }
            return { success: true, message: "Child removed successfully" };
        }
        catch (error) {
            console.error("Error in ProfileModel.removeChildFromProfile", error);
            throw new Error("Failed to remove child from profile");
        }
    }
    static async findProfile(username, profileName, profileId) {
        try {
            let profile = null;
            if (profileId) {
                profile = await this.findProfileById(username, profileId);
            }
            else {
                profile = await server_1.default.GetDocument(this.profileCollection, {
                    username, profileName
                });
            }
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
    static async findProfileById(username, profileId) {
        try {
            const profile = await server_1.default.GetDocument(this.profileCollection, {
                username, _id: new mongodb_1.ObjectId(profileId)
            });
            if (!profile) {
                return null;
            }
            return profile;
        }
        catch (error) {
            console.error("Error in ProfileModel.findProfileById", error);
            throw new Error("Failed to find profile");
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
    static async renameProfile(username, oldProfileName, newProfileName, refId, parentProfile) {
        try {
            const operations = [
                {
                    collection: this.profileCollection,
                    query: { username, profileName: oldProfileName },
                    update: { $set: { profileName: newProfileName } }
                },
                {
                    collection: this.expensesCollection,
                    query: { _id: new mongodb_1.ObjectId(refId) },
                    update: { $set: { profileName: newProfileName } }
                }
            ];
            if (!parentProfile) {
                operations.push({
                    collection: this.profileCollection,
                    query: {
                        username,
                        parentProfile: true,
                        "children.name": oldProfileName
                    },
                    update: { $set: { "children.$.name": newProfileName } }
                });
            }
            const transactionResult = await server_1.default.TransactionUpdateMany(operations);
            if (!transactionResult?.success) {
                return {
                    success: false,
                    message: transactionResult?.message || "Transaction failed during profile rename",
                };
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
    static async deleteProfile(username, profileName, refId) {
        try {
            const profileDocument = await server_1.default.DeleteDocument(this.profileCollection, { username, profileName });
            if (!profileDocument || profileDocument.deletedCount === 0) {
                return { success: false, message: "Profile not found" };
            }
            const expensesDocument = await server_1.default.DeleteDocument(this.expensesCollection, { _id: new mongodb_1.ObjectId(refId) });
            if (!expensesDocument || expensesDocument.deletedCount === 0) {
                return { success: false, message: "Expenses document not found" };
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
            const result = await server_1.default.UpdateDocument(this.profileCollection, { username, profileName }, { $set: { avatar } });
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
    static async addRefreshToken(profileId, refreshToken) {
        try {
            const result = await server_1.default.UpdateDocument(this.profileCollection, {
                _id: new mongodb_1.ObjectId(profileId)
            }, {
                $addToSet: {
                    refreshTokens: {
                        token: refreshToken,
                        createdAt: new Date()
                    }
                }
            });
            return result !== null;
        }
        catch (error) {
            console.error("Error adding refresh token:", error);
            return false;
        }
    }
    static async removeRefreshToken(profileId, refreshToken) {
        try {
            const result = await server_1.default.UpdateDocument(this.profileCollection, {
                _id: new mongodb_1.ObjectId(profileId)
            }, {
                $pull: {
                    refreshTokens: { token: refreshToken }
                }
            });
            return result !== null;
        }
        catch (error) {
            console.error("Error removing refresh token:", error);
            return false;
        }
    }
    static async clearAllRefreshTokens(profileId) {
        try {
            const result = await server_1.default.UpdateDocument(this.profileCollection, {
                _id: new mongodb_1.ObjectId(profileId)
            }, {
                $unset: { refreshTokens: "" }
            });
            return result !== null;
        }
        catch (error) {
            console.error("Error clearing refresh tokens:", error);
            return false;
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