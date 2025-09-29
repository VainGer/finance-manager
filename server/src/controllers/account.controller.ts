import { Request, Response } from "express";
import AccountService from "../services/account/account.service";
import ProfileService from "../services/profile/profile.service";
import * as AppErrors from "../errors/AppError";
import AccountModel from "../models/account/account.model";

export default class AccountController {

    static async createAccount(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            await AccountService.create(username, password);
            res.status(200).json({
                message: "Account created successful"
            });
        } catch (error) {
            console.error(error);
            if (error instanceof AppErrors.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    static async validateAccount(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const result = await AccountService.validate(username, password);
            res.status(200).json({
                account: result.safeAccount,
                message: result.message
            });
        } catch (error) {
            console.error(error);
            if (error instanceof AppErrors.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    static async changePassword(req: Request, res: Response) {
        try {
            const { username, currentPassword, newPassword } = req.body as { username: string, currentPassword: string, newPassword: string };
            const result = await AccountService.changePassword(username, currentPassword, newPassword);
            res.status(200).json({ message: result.message || 'Password changed successfully' });
        } catch (error) {
            console.error(error);
            if (error instanceof AppErrors.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    static async validateToken(req: Request, res: Response) {
        try {
            const { username, profileId, refreshToken, device, isAutoLogin } = req.body;
            const isAutoLoginAttempt = isAutoLogin === true;
            if (!username || !profileId || !refreshToken || !device) {
                throw new AppErrors.ValidationError('Missing required fields for token validation');
            }
            const account = await AccountModel.findByUsername(username);
            if (!account) {
                throw new AppErrors.NotFoundError(`Account with username '${username}' not found`);
            }
            const { tokens: _, password: __, ...safeAccount } = account;
            const result = await ProfileService.validateByRefreshToken(username, profileId, refreshToken, device);

            res.status(200).json({
                success: true,
                message: isAutoLoginAttempt ? "Auto login successful" : "Token validation successful",
                tokens: result.tokens,
                profile: result.safeProfile,
                account: safeAccount
            });
        } catch (error) {
            const isAutoLoginAttempt = req.body.isAutoLogin === true;
            console.error(isAutoLoginAttempt ? "Auto login failed:" : "Token validation failed:", error);

            let statusCode = 401;
            let message = isAutoLoginAttempt
                ? "Auto login failed, please login manually"
                : "Token validation failed";

            if (error instanceof AppErrors.AppError) {
                statusCode = error.statusCode;
                message = error.message;
            }

            res.status(statusCode).json({
                success: false,
                message: message,
                ...(isAutoLoginAttempt && { requireManualLogin: true })
            });
        }
    }
}