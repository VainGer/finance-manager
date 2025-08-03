"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const server_1 = __importDefault(require("../../server"));
const mongodb_1 = require("mongodb");
class ProfileModel {
    static profileCollection = 'profiles';
    static expensesCollection = 'expenses';
    static async createProfile(req, res) {
        try {
            const { username, profileName, pin, parentProfile, color, avatar } = req.body;
            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, pin, parentProfile });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }
            if (await ProfileModel.profileExists(username, profileName)) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile already exists"
                }, undefined, 409);
            }
            const expensesId = await ProfileModel.createExpensesAndGetId(username, profileName);
            if (!expensesId) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to create expenses document"
                }, undefined, 500);
            }
            let avatarUrl;
            if (avatar) {
                try {
                    const uploadResult = await cloudinary_1.v2.uploader.upload(avatar, {
                        folder: 'profile_avatars',
                    });
                    avatarUrl = uploadResult.secure_url;
                }
                catch (cloudinaryError) {
                    console.error("Cloudinary upload error: ", cloudinaryError);
                    return ProfileModel.formatResponse(res, {
                        message: "Failed to upload avatar image"
                    }, undefined, 500);
                }
            }
            const newProfile = {
                username,
                profileName,
                pin,
                parentProfile,
                color,
                avatar: avatarUrl,
                createdAt: new Date(),
                updatedAt: new Date(),
                budgets: [],
                expenses: expensesId
            };
            const result = await server_1.default.AddDocument(ProfileModel.profileCollection, newProfile);
            if (result?.insertedId) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile created successfully",
                    profileId: result.insertedId
                }, "profileId", 201);
            }
            else {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to create profile"
                }, undefined, 500);
            }
        }
        catch (error) {
            console.log("Error creating profile: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
    static async validateProfile(req, res) {
        try {
            const { username, profileName, pin } = req.body;
            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, pin });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }
            if (profile.pin !== pin) {
                return ProfileModel.formatResponse(res, {
                    message: "Invalid pin"
                }, undefined, 401);
            }
            const validatedProfile = {
                profileName: profile.profileName,
                parentProfile: profile.parentProfile,
                avatar: profile.avatar,
                expenses: profile.expenses,
            };
            return ProfileModel.formatResponse(res, {
                message: "Profile validated successfully",
                profile: validatedProfile
            }, "profile", 200);
        }
        catch (error) {
            console.error("Error validating profile: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
    static async getAllProfiles(req, res) {
        try {
            const username = req.query.username;
            if (!username) {
                return ProfileModel.formatResponse(res, {
                    message: "Username is required"
                }, undefined, 400);
            }
            const profilesDB = await server_1.default.GetDocuments(ProfileModel.profileCollection, { username });
            if (!profilesDB || profilesDB.length === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "No profiles found for this user",
                    profiles: []
                }, "profiles", 200);
            }
            const profiles = profilesDB.map(profile => ({
                profileName: profile.profileName,
                parentProfile: profile.parentProfile,
                avatar: profile.avatar,
                color: profile.color
            }));
            return ProfileModel.formatResponse(res, {
                message: "Profiles retrieved successfully",
                profiles
            }, "profiles", 200);
        }
        catch (error) {
            console.error("Error retrieving profiles: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
    static async renameProfile(req, res) {
        try {
            const { username, oldProfileName, newProfileName } = req.body;
            const errorMsg = ProfileModel.validateRequiredFields({ username, oldProfileName, newProfileName });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }
            const existingProfile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName: oldProfileName });
            if (!existingProfile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }
            const updatedProfile = await server_1.default.UpdateDocument(ProfileModel.profileCollection, { username, profileName: oldProfileName }, { $set: { profileName: newProfileName } });
            if (!updatedProfile || updatedProfile.modifiedCount === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to rename profile"
                }, undefined, 500);
            }
            return ProfileModel.formatResponse(res, {
                message: "Profile renamed successfully"
            }, undefined, 200);
        }
        catch (error) {
            console.error("Error renaming profile: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
    static async changeProfilePin(req, res) {
        try {
            const { username, profileName, oldPin, newPin } = req.body;
            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, oldPin, newPin });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }
            if (profile.pin !== oldPin) {
                return ProfileModel.formatResponse(res, {
                    message: "Old pin not matching"
                }, undefined, 401);
            }
            const updatedProfile = await server_1.default.UpdateDocument(ProfileModel.profileCollection, { username, profileName }, { $set: { pin: newPin, updatedAt: new Date() } });
            if (!updatedProfile || updatedProfile.modifiedCount === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to change profile pin"
                }, undefined, 500);
            }
            return ProfileModel.formatResponse(res, {
                message: "Profile pin changed successfully"
            }, undefined, 200);
        }
        catch (error) {
            console.error("Error changing profile pin: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
    static async deleteProfile(req, res) {
        try {
            const { username, profileName, pin } = req.body;
            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, pin });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }
            if (profile.pin !== pin) {
                return ProfileModel.formatResponse(res, {
                    message: "Invalid pin"
                }, undefined, 401);
            }
            const deleteResult = await server_1.default.DeleteDocument(ProfileModel.profileCollection, { username, profileName });
            if (!deleteResult || deleteResult.deletedCount === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to delete profile"
                }, undefined, 500);
            }
            return ProfileModel.formatResponse(res, {
                message: "Profile deleted successfully"
            }, undefined, 200);
        }
        catch (error) {
            console.error("Error deleting profile: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
    static async setAvatar(req, res) {
        try {
            const { username, profileName, avatar } = req.body;
            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, avatar });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }
            const result = await server_1.default.UpdateDocument(ProfileModel.profileCollection, { username, profileName }, { $set: { avatar } });
            if (!result || result.modifiedCount === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to set avatar"
                }, undefined, 500);
            }
            return ProfileModel.formatResponse(res, {
                message: "Avatar set successfully"
            }, undefined, 200);
        }
        catch (error) {
            console.error("Error setting avatar: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
    static async setColor(req, res) {
        try {
            const { username, profileName, color } = req.body;
            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, color });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }
            const result = await server_1.default.UpdateDocument(ProfileModel.profileCollection, { username, profileName }, { $set: { color } });
            if (!result || result.modifiedCount === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to set profile color"
                }, undefined, 500);
            }
            return ProfileModel.formatResponse(res, {
                message: "Profile color set successfully"
            }, undefined, 200);
        }
        catch (error) {
            console.error("Error setting profile color: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
    static async createProfileBudget(req, res) {
        try {
            const { username, profileName, refId, budget } = req.body;
            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, budget });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }
            const overlappingBudgets = profile.budgets.filter((b) => budget.startDate <= b.endDate && budget.endDate >= b.startDate);
            if (overlappingBudgets.length > 0) {
                return ProfileModel.formatResponse(res, {
                    message: "Budget overlaps with existing budgets",
                    overlappingBudgets
                }, undefined, 400);
            }
            const currentExpenses = await server_1.default.GetDocument(ProfileModel.expensesCollection, { _id: new mongodb_1.ObjectId(refId) });
            if (!currentExpenses) {
                return ProfileModel.formatResponse(res, {
                    message: "Expenses document not found"
                }, undefined, 404);
            }
            let spentAmount = 0;
            currentExpenses.categories.forEach((category) => {
                category.businesses.forEach((business) => {
                    business.forEach((transaction) => {
                        if (transaction.date >= budget.startDate && transaction.date <= budget.endDate) {
                            spentAmount += transaction.amount;
                        }
                    });
                });
            });
            const result = await server_1.default.UpdateDocument(ProfileModel.profileCollection, { username, profileName }, { $push: { budgets: budget } });
            if (!result || result.modifiedCount === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to create profile budget"
                }, undefined, 500);
            }
            return ProfileModel.formatResponse(res, {
                message: "Profile budget created successfully"
            }, undefined, 201);
        }
        catch (error) {
            console.error("Error creating profile budget: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
    static async getProfileBudgets(req, res) {
        try {
            const { username, profileName } = req.query;
            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName }, { projection: { budgets: 1 } });
            if (!profile || !profile.budgets) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }
            return ProfileModel.formatResponse(res, {
                message: "Profile budgets retrieved successfully",
                budgets: profile.budgets
            }, "budgets", 200);
        }
        catch (error) {
            console.error("Error retrieving profile budgets: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
    // Helper methods
    static async profileExists(username, profileName) {
        const existingProfile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName });
        return !!existingProfile;
    }
    static async createExpensesAndGetId(username, profileName) {
        try {
            const res = await server_1.default.AddDocument(ProfileModel.expensesCollection, {
                username,
                profileName,
                categories: []
            });
            return res?.insertedId ?? null;
        }
        catch (error) {
            console.error("Error creating expenses document: ", error);
            return null;
        }
    }
    static validateRequiredFields(fields) {
        for (const [key, value] of Object.entries(fields)) {
            if (value === undefined || value === null || value === '') {
                return `${key} is required`;
            }
        }
        return null;
    }
    static formatResponse(res, result, dataField, statusCode = 200) {
        const response = {
            message: result.message || result.error
        };
        if (dataField && result[dataField] !== undefined) {
            response[dataField] = result[dataField];
        }
        res.status(statusCode).json(response);
    }
}
exports.default = ProfileModel;
//# sourceMappingURL=profile.model.js.map