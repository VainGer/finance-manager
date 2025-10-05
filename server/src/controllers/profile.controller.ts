import { Request, Response } from "express";
import ProfileService from "../services/profile/profile.service";
import * as AppErrors from "../errors/AppError";
import { ChildProfileCreationData } from "../types/profile.types";

export default class ProfileController {

    static async createProfile(req: Request, res: Response) {
        try {
            const result = await ProfileService.createProfile(req.body);
            res.status(201).json({
                message: result.message || "Profile created successfully",
                profileId: result.profileId
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const { username, profileName } = req.body;
            const result = await ProfileService.updateProfile(username, profileName);
            res.status(200).json({
                message: "Profile updated successfully",
                profile: result.profile
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }

    static async createChildProfile(req: Request, res: Response) {
        try {
            const childProfileCreation = req.body as ChildProfileCreationData;
            const result = await ProfileService.createChildProfile(childProfileCreation);
            res.status(201).json({
                message: result.message || "Child profile created successfully",
                profileId: result.profileId
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }

    static async refreshAccessToken(req: Request, res: Response) {
        try {
            const { profileId } = req.body;
            const result = await ProfileService.refreshAccessToken(profileId);
            res.status(200).json({
                message: result.message || "Access token refreshed successfully",
                accessToken: result.accessToken
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }

    static async validateProfile(req: Request, res: Response) {
        try {
            const { username, profileName, pin, device, remember } = req.body;
            const result = await ProfileService.validateProfile(username, profileName, pin, device, remember);
            
            // Set cookies for tokens with same expiration as JWT tokens
            res.cookie('accessToken', result.tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 30 * 60 * 1000 // 30 minutes
            });
            
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            
            res.status(200).json({
                message: "Profile validated successfully",
                profile: result.safeProfile
                // Don't send tokens in response body anymore - they're in cookies
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }


    static async changeProfilePin(req: Request, res: Response) {
        try {
            const { username, profileName, oldPin, newPin } = req.body;
            const result = await ProfileService.changeProfilePin(username, profileName, oldPin, newPin);
            res.status(200).json({
                message: result.message || "Profile PIN changed successfully"
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }

    static async renameProfile(req: Request, res: Response) {
        try {
            const { username, oldProfileName, newProfileName } = req.body;
            const result = await ProfileService.renameProfile(username, oldProfileName, newProfileName);
            res.status(200).json({
                message: result.message || "Profile renamed successfully"
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }

    static async deleteProfile(req: Request, res: Response) {
        try {
            const { username, profileName, pin } = req.body;
            const result = await ProfileService.deleteProfile(username, profileName, pin);
            res.status(200).json({
                message: result.message || "Profile deleted successfully"
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }

    static async getAllProfiles(req: Request, res: Response) {
        try {
            const username = req.query.username as string;
            const result = await ProfileService.getAllProfiles(username);
            res.status(200).json({
                message: "Profiles retrieved successfully",
                profiles: result.safeProfiles || result.profiles || []
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }

    static async setAvatar(req: Request, res: Response) {
        try {
            const { username, profileName, avatar } = req.body;
            const result = await ProfileService.setAvatar(username, profileName, avatar);
            res.status(200).json({
                message: result.message || "Profile avatar set successfully"
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }


    static async setColor(req: Request, res: Response) {
        try {
            const { username, profileName, color } = req.body;
            const result = await ProfileService.setColor(username, profileName, color);
            res.status(200).json({
                message: result.message || "Profile color set successfully"
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }

    // Budget-related methods have been moved to BudgetController

    static async categorizeTransactions(req: Request, res: Response) {
        try {
            const { refId, transactionsData } = req.body;
            const result = await ProfileService.categorizeTransactions(refId, transactionsData);
            res.status(200).json({
                message: "Transactions categorized successfully",
                categories: result
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }

    static async uploadTransactions(req: Request, res: Response) {
        try {
            const { username, profileName, refId, transactionsToUpload } = req.body;
            const result = await ProfileService.uploadTransactions(username, profileName, refId, transactionsToUpload);
            res.status(200).json({
                message: "Transactions uploaded successfully",
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            
            if (refreshToken) {
                await ProfileService.revokeRefreshToken(refreshToken);
            }
            
            // Clear cookies
            res.clearCookie('accessToken', { path: '/', httpOnly: true });
            res.clearCookie('refreshToken', { path: '/', httpOnly: true });
            
            res.cookie('accessToken', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: -1
            });
            
            res.cookie('refreshToken', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: -1
            });
            
            res.status(200).json({
                message: "Logged out successfully"
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }

    private static handleError(error: any, res: Response) {
        console.error("Controller error:", error);
        if (error instanceof AppErrors.AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
} 