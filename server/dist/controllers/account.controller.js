"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_service_1 = __importDefault(require("../services/account/account.service"));
const AppError_1 = require("../errors/AppError");
class AccountController {
    static async createAccount(req, res) {
        try {
            const { username, password } = req.body;
            await account_service_1.default.create(username, password);
            res.status(200).json({
                message: "Account created successful"
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof (AppError_1.AppError)) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
    static async validateAccount(req, res) {
        try {
            const { username, password } = req.body;
            const result = await account_service_1.default.validate(username, password);
            res.status(200).json({
                account: result.safeAccount,
                message: result.message
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof (AppError_1.AppError)) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
}
exports.default = AccountController;
//# sourceMappingURL=account.controller.js.map