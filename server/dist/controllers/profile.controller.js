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
const profile_service_1 = __importDefault(require("../services/profile/profile.service"));
const AppErrors = __importStar(require("../errors/AppError"));
const cookies_1 = require("../utils/cookies");
class ProfileController {
    static async createProfile(req, res) {
        try {
            const result = await profile_service_1.default.createProfile(req.body);
            res.status(201).json({
                message: result.message || "Profile created successfully",
                profileId: result.profileId
            });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async updateProfile(req, res) {
        try {
            const { username, profileName } = req.body;
            const result = await profile_service_1.default.updateProfile(username, profileName);
            res.status(200).json({
                message: "Profile updated successfully",
                profile: result.profile
            });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async createChildProfile(req, res) {
        try {
            const childProfileCreation = req.body;
            const result = await profile_service_1.default.createChildProfile(childProfileCreation);
            res.status(201).json({
                message: result.message || "Child profile created successfully",
                profileId: result.profileId
            });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async refreshAccessToken(req, res) {
        try {
            const { profileId } = req.body;
            if (!profileId) {
                throw new AppErrors.ValidationError("Missing profileId for access token refresh");
            }
            const result = await profile_service_1.default.refreshAccessToken(profileId);
            res.cookie("accessToken", result.accessToken, (0, cookies_1.cookieOptions)(30 * 60 * 1000));
            res.status(200).json({
                message: result.message || "Access token refreshed successfully",
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            console.error("Error refreshing access token:", error);
            res.clearCookie("accessToken", { path: "/" });
            if (error instanceof AppErrors.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
    static async validateProfile(req, res) {
        try {
            const { username, profileName, pin, device, remember } = req.body;
            if (!username || !profileName || !pin || !device) {
                throw new AppErrors.ValidationError("Missing required fields for profile validation");
            }
            const result = await profile_service_1.default.validateProfile(username, profileName, pin, device, remember);
            res.cookie("accessToken", result.tokens.accessToken, (0, cookies_1.cookieOptions)(30 * 60 * 1000));
            res.cookie("refreshToken", result.tokens.refreshToken, (0, cookies_1.cookieOptions)(7 * 24 * 60 * 60 * 1000));
            res.status(200).json({
                message: result.message,
                profile: result.safeProfile,
                tokens: result.tokens,
            });
        }
        catch (error) {
            console.error("Profile validation error:", error);
            res.clearCookie("accessToken", { path: "/" });
            res.clearCookie("refreshToken", { path: "/" });
            if (error instanceof AppErrors.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
    static async changeProfilePin(req, res) {
        try {
            const { username, profileName, oldPin, newPin } = req.body;
            const result = await profile_service_1.default.changeProfilePin(username, profileName, oldPin, newPin);
            res.status(200).json({ message: result.message || "Profile PIN changed successfully" });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async renameProfile(req, res) {
        try {
            const { username, oldProfileName, newProfileName } = req.body;
            const result = await profile_service_1.default.renameProfile(username, oldProfileName, newProfileName);
            res.status(200).json({ message: result.message || "Profile renamed successfully" });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async deleteProfile(req, res) {
        try {
            const { username, profileName, pin } = req.body;
            const result = await profile_service_1.default.deleteProfile(username, profileName, pin);
            res.status(200).json({ message: result.message || "Profile deleted successfully" });
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
            res.status(200).json({ message: result.message || "Profile avatar set successfully" });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async setColor(req, res) {
        try {
            const { username, profileName, color } = req.body;
            const result = await profile_service_1.default.setColor(username, profileName, color);
            res.status(200).json({ message: result.message || "Profile color set successfully" });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async categorizeTransactions(req, res) {
        try {
            const { refId, transactionsData } = req.body;
            const result = await profile_service_1.default.categorizeTransactions(refId, transactionsData);
            res.status(200).json({
                message: "Transactions categorized successfully",
                categories: result
            });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async uploadTransactions(req, res) {
        try {
            const { username, profileName, refId, transactionsToUpload } = req.body;
            await profile_service_1.default.uploadTransactions(username, profileName, refId, transactionsToUpload);
            res.status(200).json({ message: "Transactions uploaded successfully" });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static async logout(req, res) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (refreshToken) {
                await profile_service_1.default.revokeRefreshToken(refreshToken);
            }
            res.clearCookie("accessToken", { path: "/" });
            res.clearCookie("refreshToken", { path: "/" });
            res.status(200).json({ message: "Logged out successfully" });
        }
        catch (error) {
            ProfileController.handleError(error, res);
        }
    }
    static handleError(error, res) {
        console.error("Controller error:", error);
        if (error instanceof AppErrors.AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}
exports.default = ProfileController;
//# sourceMappingURL=profile.controller.js.map