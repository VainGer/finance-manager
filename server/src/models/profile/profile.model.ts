import { ProfileCreationData, ChildProfileCreationData } from "../../types/profile.types"
import db from "../../server"
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../dotenv/.env') });
export default class ProfileModel {

    private static profileCollection: string = 'profiles';
    private static expensesCollection: string = 'expenses';
    private static aiCollection: string = 'ai_history';
    private static SALT_ROUNDS = 10;
    private static dbName: string = process.env.DB_NAME as string;

    static async create(profile: ProfileCreationData | ChildProfileCreationData) {
        const client = db.getClient();
        const session = client.startSession();

        try {
            console.log(this.dbName);
            session.startTransaction();

            const hashedPin = await bcrypt.hash(profile.pin, this.SALT_ROUNDS);

            const expensesResult = await client
                .db(this.dbName)
                .collection(this.expensesCollection)
                .insertOne(
                    {
                        username: profile.username,
                        profileName: profile.profileName,
                        categories: []
                    },
                    { session }
                );

            const profileResult = await client
                .db(this.dbName)
                .collection(this.profileCollection)
                .insertOne(
                    {
                        ...profile,
                        expenses: expensesResult.insertedId,
                        pin: hashedPin
                    },
                    { session }
                );

            await client
                .db(this.dbName)
                .collection(this.aiCollection)
                .insertOne(
                    {
                        profileId: profileResult.insertedId,
                        status: "idle",
                        history: []
                    },
                    { session }
                );

            await session.commitTransaction();
            console.log("Profile and related documents created successfully.");
            return {
                success: true,
                profileId: profileResult.insertedId,
                message: "Profile created successfully."
            };
        } catch (error) {
            console.error("Error in ProfileModel.create:", error);
            await session.abortTransaction();
            throw new Error("Profile creation failed");
        } finally {
            await session.endSession();
        }
    }

    static async addChildToProfile(username: string, profileName: string, children: { name: string, id: ObjectId }) {
        try {
            const result = await db.UpdateDocument(this.profileCollection, {
                username, profileName
            }, { $addToSet: { children } });
            if (!result) {
                return { success: false, message: "Profile not found or child already exists" };
            }
            return { success: true, message: "Child added successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.addChildToProfile", error);
            throw new Error("Failed to add child to profile");
        }
    }

    static async removeChildFromProfile(username: string, profileName: string, childName: string) {
        try {
            const result = await db.UpdateDocument(this.profileCollection, {
                username, profileName
            }, { $pull: { children: { name: childName } } });
            if (!result) {
                return { success: false, message: "Profile not found or child does not exist" };
            }
            return { success: true, message: "Child removed successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.removeChildFromProfile", error);
            throw new Error("Failed to remove child from profile");
        }
    }

    static async findProfile(username: string, profileName: string, profileId?: string) {
        try {
            let profile = null;
            if (profileId) {
                profile = await this.findProfileById(username, profileId);
            } else {
                profile = await db.GetDocument(this.profileCollection, {
                    username, profileName
                });
            }
            if (!profile) {
                return null;
            }
            return profile;
        } catch (error) {
            console.error("Error in ProfileModel.findProfile", error);
            throw new Error("Failed to find profile");
        }
    }

    static async findProfileById(username: string, profileId: string) {
        try {
            const profile = await db.GetDocument(this.profileCollection, {
                username, _id: new ObjectId(profileId)
            });
            if (!profile) {
                return null;
            }
            return profile;
        } catch (error) {
            console.error("Error in ProfileModel.findProfileById", error);
            throw new Error("Failed to find profile");
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

    static async renameProfile(username: string, oldProfileName: string, newProfileName: string,
        refId: string, parentProfile: boolean) {
        try {
            const operations = [
                {
                    collection: this.profileCollection,
                    query: { username, profileName: oldProfileName },
                    update: { $set: { profileName: newProfileName } }
                },
                {
                    collection: this.expensesCollection,
                    query: { _id: new ObjectId(refId) },
                    update: { $set: { profileName: newProfileName } }
                }
            ] as any[];
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
            const transactionResult = await db.TransactionUpdateMany(operations);
            if (!transactionResult?.success) {
                return {
                    success: false,
                    message: transactionResult?.message || "Transaction failed during profile rename",
                };
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
            }, { $set: { pin: hashedPin } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Profile not found or pin is the same" };
            }
            return { success: true, message: "PIN updated successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.updatePin", error);
            throw new Error("Failed to update PIN");
        }
    }

    static async deleteProfile(username: string, profileName: string, refId: string) {
        try {
            const profileDocument = await db.DeleteDocument(this.profileCollection, { username, profileName });
            if (!profileDocument || profileDocument.deletedCount === 0) {
                return { success: false, message: "Profile not found" };
            }
            const expensesDocument = await db.DeleteDocument(this.expensesCollection, { _id: new ObjectId(refId) });
            if (!expensesDocument || expensesDocument.deletedCount === 0) {
                return { success: false, message: "Expenses document not found" };
            }
            return { success: true, message: "Profile deleted successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.deleteProfile", error);
            throw new Error("Failed to delete profile");
        }
    }

    static async setAvatar(username: string, profileName: string, avatar: string) {
        try {
            const result = await db.UpdateDocument(this.profileCollection, { username, profileName }, { $set: { avatar } });
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
            const resultDB = await db.UpdateDocument(this.profileCollection, { username, profileName }, { $set: { avatar: null } });
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


    static async addRefreshToken(profileId: string, refreshToken: string) {
        try {
            const result = await db.UpdateDocument(this.profileCollection, {
                _id: new ObjectId(profileId)
            }, {
                $addToSet: {
                    refreshTokens: {
                        token: refreshToken,
                        createdAt: new Date()
                    }
                }
            });
            return result !== null;
        } catch (error) {
            console.error("Error adding refresh token:", error);
            return false;
        }
    }

    static async removeRefreshToken(profileId: string, refreshToken: string) {
        try {
            const result = await db.UpdateDocument(this.profileCollection, {
                _id: new ObjectId(profileId)
            }, {
                $pull: {
                    refreshTokens: { token: refreshToken }
                }
            });
            return result !== null;
        } catch (error) {
            console.error("Error removing refresh token:", error);
            return false;
        }
    }

    static async clearAllRefreshTokens(profileId: string) {
        try {
            const result = await db.UpdateDocument(this.profileCollection, {
                _id: new ObjectId(profileId)
            }, {
                $unset: { refreshTokens: "" }
            });
            return result !== null;
        } catch (error) {
            console.error("Error clearing refresh tokens:", error);
            return false;
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