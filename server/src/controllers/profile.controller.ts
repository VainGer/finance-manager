import { Request, Response } from "express";
import ProfileService from "../services/profile/profile.service";
import ProfileModel from "../models/profile/profile.model";
import db from "../server";
import { AppError, BadRequestError, ConflictError, NotFoundError } from "../errors/AppError";
import { BudgetCreationData } from "../types/profile.types";

export default class ProfileController {

    static async createProfile(req: Request, res: Response) {
        try {
            const result = await ProfileService.createProfile(req.body);
            res.status(201).json({
                message: "Profile created successfully",
                profileId: result.profileId
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }


    static async validateProfile(req: Request, res: Response) {
        try {
            const { username, profileName, pin } = req.body;
            const result = await ProfileService.validateProfile(username, profileName, pin);
            res.status(200).json({
                message: "Profile validated successfully",
                profile: result.safeProfile
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
                message: "Profile PIN changed successfully"
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
                message: "Profile renamed successfully"
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
                message: "Profile deleted successfully"
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
                message: "Avatar set successfully"
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
                message: "Profile color set successfully"
            });
        } catch (error) {
            ProfileController.handleError(error, res);
        }
    }



    private static handleError(error: any, res: Response) {
        console.error("Controller error:", error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
} 