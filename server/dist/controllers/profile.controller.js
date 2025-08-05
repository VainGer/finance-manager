"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profile_service_1 = __importDefault(require("../services/profile/profile.service"));
const AppError_1 = require("../errors/AppError");
class ProfileController {
    static async createProfile(req, res) {
        try {
            const result = await profile_service_1.default.createProfile(req.body);
            res.status(201).json({
                message: "Profile created successfully",
                profileId: result.profileId
            });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async validateProfile(req, res) {
        try {
            const { username, profileName, pin } = req.body;
            const result = await profile_service_1.default.validateProfile(username, profileName, pin);
            res.status(200).json({
                message: "Profile validated successfully",
                profile: result.safeProfile
            });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async changeProfilePin(req, res) {
        try {
            const { username, profileName, oldPin, newPin } = req.body;
            const result = await profile_service_1.default.changeProfilePin(username, profileName, oldPin, newPin);
            res.status(200).json({
                message: "Profile PIN changed successfully"
            });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async renameProfile(req, res) {
        try {
            const { username, oldProfileName, newProfileName } = req.body;
            const result = await profile_service_1.default.renameProfile(username, oldProfileName, newProfileName);
            res.status(200).json({
                message: "Profile renamed successfully"
            });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async deleteProfile(req, res) {
        try {
            const { username, profileName, pin } = req.body;
            const result = await profile_service_1.default.deleteProfile(username, profileName, pin);
            res.status(200).json({
                message: "Profile deleted successfully"
            });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async getAllProfiles(req, res) {
        try {
            const username = req.query.username;
            const result = await profile_service_1.default.getAllProfiles(username);
            res.status(200).json({
                message: "Profiles retrieved successfully",
                profiles: result.safeProfiles || result.profiles || []
            });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async setAvatar(req, res) {
        try {
            const { username, profileName, avatar } = req.body;
            const result = await profile_service_1.default.setAvatar(username, profileName, avatar);
            res.status(200).json({
                message: "Avatar set successfully"
            });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async setColor(req, res) {
        try {
            const { username, profileName, color } = req.body;
            const result = await profile_service_1.default.setColor(username, profileName, color);
            res.status(200).json({
                message: "Profile color set successfully"
            });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static handleError(error, res) {
        console.error("Controller error:", error);
        if (error instanceof AppError_1.AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}
exports.default = ProfileController;
//# sourceMappingURL=profile.controller.js.map