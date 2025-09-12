import { Request, Response } from "express";
import AccountService from "../services/account/account.service";
import * as AppErrors from "../errors/AppError";

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
}