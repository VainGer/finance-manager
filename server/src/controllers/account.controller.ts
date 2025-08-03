import { Request, Response } from "express";
import AccountService from "../services/account/account.service";
import { AppError } from "../errors/AppError";
import { a } from "framer-motion/dist/types.d-6pKw1mTI";

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
            if (error instanceof (AppError)) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    static async validateAccount(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const account = await AccountService.validate(username, password);
            res.status(200).json({
                account: account,
                message: "Account validated successfully"
            });
        } catch (error) {
            console.error(error);
            if (error instanceof (AppError)) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
}