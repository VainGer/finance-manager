"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
class ProfileModel {
    static profileCollection = 'profiles';
    static expensesCollection = 'expenses';
    static async createProfile(req, res) {
        try {
            const { username, profileName, parent, pin } = req.body;
            const errorMsg = ProfileModel.validateProfileInput(username, profileName, pin);
            if (errorMsg) {
                res.status(400).json({ message: errorMsg, status: 400 });
                return;
            }
            if (await ProfileModel.profileExists(username, profileName)) {
                res.status(409).json({
                    message: "Profile already exists",
                    status: 409
                });
                return;
            }
            const expensesId = await ProfileModel.createExpensesAndGetId(username, profileName);
            if (!expensesId) {
                res.status(500).json({
                    message: "Failed to create expenses document",
                    status: 500
                });
                return;
            }
            const newProfile = {
                username,
                profileName,
                pin,
                parentProfile: parent,
                createdAt: new Date(),
                updatedAt: new Date(),
                budgets: [],
                expenses: expensesId
            };
            const result = await server_1.default.AddDocument(ProfileModel.profileCollection, newProfile);
            if (result?.insertedId) {
                res.status(201).json({
                    message: "Profile created successfully",
                    status: 201,
                    profileId: result.insertedId
                });
                return;
            }
            else {
                res.status(500).json({
                    message: "Failed to create profile",
                    status: 500
                });
                return;
            }
        }
        catch (error) {
            console.log("Error creating profile: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }
    static async validateProfile(req, res) {
        try {
            const { username, profileName, pin } = req.body;
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }
            if (profile.pin !== pin) {
                res.status(401).json({
                    message: "Invalid pin",
                    status: 401
                });
                return;
            }
            else {
                const validatedProfile = {
                    username: profile.username,
                    profileName: profile.profileName,
                    parentProfile: profile.parentProfile
                };
                res.status(200).json({
                    message: "Profile validated successfully",
                    status: 200,
                    profile: validatedProfile
                });
                return;
            }
        }
        catch (error) {
            console.error("Error validating profile: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }
    static async getAllProfiles(req, res) {
        try {
            const username = req.query.username;
            if (!username) {
                res.status(400).json({
                    message: "Username is required",
                    status: 400
                });
                return;
            }
            const profilesDB = await server_1.default.GetDocuments(ProfileModel.profileCollection, { username });
            if (!profilesDB || profilesDB.length === 0) {
                res.status(404).json({
                    message: "No profiles found for ProfileModel user",
                    status: 404
                });
                return;
            }
            const profiles = profilesDB.map(profile => ({
                profileName: profile.profileName,
                parentProfile: profile.parentProfile
            }));
            res.status(200).json({
                message: "Profiles retrieved successfully",
                status: 200,
                profiles
            });
        }
        catch (error) {
            console.error("Error retrieving profiles: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }
    static async renameProfile(req, res) {
        try {
            const { username, oldProfileName, newProfileName } = req.body;
            if (!username || !oldProfileName || !newProfileName) {
                res.status(400).json({
                    message: "missing required fields",
                    status: 400
                });
                return;
            }
            const existingProfile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName: oldProfileName });
            if (!existingProfile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }
            const updatedProfile = await server_1.default.UpdateDocument(ProfileModel.profileCollection, { username, profileName: oldProfileName }, { $set: { profileName: newProfileName } });
            if (!updatedProfile || updatedProfile.modifiedCount === 0) {
                res.status(500).json({
                    message: "Failed to rename profile",
                    status: 500
                });
                return;
            }
            if (updatedProfile.modifiedCount > 0) {
                res.status(200).json({
                    message: "Profile renamed successfully",
                    status: 200
                });
            }
        }
        catch (error) {
            console.error("Error renaming profile: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }
    static async changeProfilePin(req, res) {
        try {
            const { username, profileName, oldPin, newPin } = req.body;
            if (!username || !profileName || !oldPin || !newPin) {
                res.status(400).json({
                    message: "Missing required fields",
                    status: 400
                });
                return;
            }
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }
            if (profile.pin !== oldPin) {
                res.status(401).json({
                    message: "Old pin not matching",
                    status: 401
                });
                return;
            }
            const updatedProfile = await server_1.default.UpdateDocument(ProfileModel.profileCollection, { username, profileName }, { $set: { pin: newPin, updatedAt: new Date() } });
            if (!updatedProfile || updatedProfile.modifiedCount === 0) {
                res.status(500).json({
                    message: "Failed to change profile pin",
                    status: 500
                });
                return;
            }
            else {
                res.status(200).json({
                    message: "Profile pin changed successfully",
                    status: 200
                });
                return;
            }
        }
        catch (error) {
            console.error("Error changing profile pin: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }
    static async deleteProfile(req, res) {
        try {
            const { username, profileName, pin } = req.body;
            const errorMsg = ProfileModel.validateProfileInput(username, profileName, pin);
            if (errorMsg) {
                res.status(400).json({ message: errorMsg, status: 400 });
                return;
            }
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }
            if (profile.pin !== pin) {
                res.status(401).json({
                    message: "Invalid pin",
                    status: 401
                });
                return;
            }
            const deleteResult = await server_1.default.DeleteDocument(ProfileModel.profileCollection, { username, profileName });
            if (!deleteResult || deleteResult.deletedCount === 0) {
                res.status(500).json({
                    message: "Failed to delete profile",
                    status: 500
                });
                return;
            }
            else {
                res.status(200).json({
                    message: "Profile deleted successfully",
                    status: 200
                });
            }
        }
        catch (error) {
            console.error("Error deleting profile: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }
    static async setAvatar(req, res) {
        try {
            const { username, profileName, avatar } = req.body;
            if (!username || !profileName || !avatar) {
                res.status(400).json({
                    message: "Username, profile name, and avatar are required",
                    status: 400
                });
                return;
            }
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }
            const result = await server_1.default.UpdateDocument(ProfileModel.profileCollection, { username, profileName }, { $set: { avatar } });
            if (!result || result.modifiedCount === 0) {
                res.status(500).json({
                    message: "Failed to set avatar",
                    status: 500
                });
                return;
            }
            res.status(200).json({
                message: "Avatar set successfully",
                status: 200
            });
        }
        catch (error) {
            console.error("Error setting avatar: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }
    static async setColor(req, res) {
        try {
            const { username, profileName, color } = req.body;
            if (!username || !profileName || !color) {
                res.status(400).json({
                    message: "Username, profile name, and color are required",
                    status: 400
                });
                return;
            }
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }
            const result = await server_1.default.UpdateDocument(ProfileModel.profileCollection, { username, profileName }, { $set: { color } });
            if (!result || result.modifiedCount === 0) {
                res.status(500).json({
                    message: "Failed to set profile color",
                    status: 500
                });
                return;
            }
            res.status(200).json({
                message: "Profile color set successfully",
                status: 200
            });
        }
        catch (error) {
            console.error("Error setting profile color: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }
    static async createProfileBudget(req, res) {
        try {
            const { username, profileName, budget } = req.body;
            if (!username || !profileName || budget === undefined) {
                res.status(400).json({
                    message: "Username, profile name, and budget are required",
                    status: 400
                });
                return;
            }
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }
            const result = await server_1.default.UpdateDocument(ProfileModel.profileCollection, { username, profileName }, { $push: { budgets: budget } });
            if (!result || result.modifiedCount === 0) {
                res.status(500).json({
                    message: "Failed to create profile budget",
                    status: 500
                });
                return;
            }
            res.status(201).json({
                message: "Profile budget created successfully",
                status: 201
            });
        }
        catch (error) {
            console.error("Error creating profile budget: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }
    static async getProfileBudgets(req, res) {
        try {
            const { username, profileName } = req.query;
            if (!username || !profileName) {
                res.status(400).json({
                    message: "Username and profile name are required",
                    status: 400
                });
                return;
            }
            const profile = await server_1.default.GetDocument(ProfileModel.profileCollection, { username, profileName }, { projection: { budgets: 1 } });
            if (!profile || !profile.budgets) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }
            res.status(200).json({
                message: "Profile budgets retrieved successfully",
                status: 200,
                budgets: profile.budgets
            });
        }
        catch (error) {
            console.error("Error retrieving profile budgets: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }
    // Helper methods
    static validateProfileInput(username, profileName, pin) {
        if (!username)
            return "Username is required";
        if (!profileName)
            return "Profile name is required";
        if (!pin)
            return "Pin is required";
        return null;
    }
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
}
exports.default = ProfileModel;
//# sourceMappingURL=profile.model.js.map