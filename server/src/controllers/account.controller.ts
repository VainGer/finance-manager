import { Request, Response } from "express";
import { cookieOptions } from "../utils/cookies";
import AccountService from "../services/account/account.service";
import ProfileService from "../services/profile/profile.service";
import * as AppErrors from "../errors/AppError";
import AccountModel from "../models/account/account.model";

type RequestWithCookies = Request & { cookies?: Record<string, string | undefined> };

export default class AccountController {
    static async createAccount(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            await AccountService.create(username, password);
            res.status(200).json({ message: "Account created successfully" });
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
            res.status(200).json({ account: result.safeAccount, message: result.message });
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
            const { username, currentPassword, newPassword } = req.body as {
                username: string; currentPassword: string; newPassword: string;
            };
            const result = await AccountService.changePassword(username, currentPassword, newPassword);
            res.status(200).json({ message: result.message || "Password changed successfully" });
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
        const isAutoLoginAttempt = req.body.isAutoLogin === true;

        try {
            const { username, profileId, refreshToken, device } = req.body;
            const { cookies } = req as RequestWithCookies;
            const finalToken = cookies?.refreshToken || refreshToken;

            if (!username || !profileId || !finalToken || !device) {
                throw new AppErrors.ValidationError("Missing required fields for token validation");
            }

            const account = await AccountModel.findByUsername(username);
            if (!account) {
                throw new AppErrors.NotFoundError(`Account with username '${username}' not found`);
            }

            const { tokens: _ignored, password: _ignored2, ...safeAccount } = account;

            const result = await ProfileService.validateByRefreshToken(
                username,
                profileId,
                finalToken,
                device
            );

            res.cookie("accessToken", result.tokens.accessToken, cookieOptions(30 * 60 * 1000));
            res.cookie("refreshToken", result.tokens.refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

            res.status(200).json({
                success: true,
                message: isAutoLoginAttempt ? "Auto login successful" : "Token validation successful",
                tokens: result.tokens,
                profile: result.safeProfile,
                account: safeAccount,
            });

        } catch (error) {
            console.error(isAutoLoginAttempt ? "Auto login failed:" : "Token validation failed:", error);

            let statusCode = 401;
            let message = isAutoLoginAttempt
                ? "Auto login failed, please login manually"
                : "Token validation failed";

            if (error instanceof AppErrors.AppError) {
                statusCode = error.statusCode;
                message = error.message;
            }
            res.clearCookie("accessToken", { path: "/" });
            res.clearCookie("refreshToken", { path: "/" });

            res.status(statusCode).json({
                success: false,
                message,
                ...(isAutoLoginAttempt && { requireManualLogin: true }),
            });
        }
    }
}
