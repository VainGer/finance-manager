"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("../../errors/AppError");
const account_model_1 = __importDefault(require("../../models/account/account.model"));
class AccountService {
    static async create(username, password) {
        if (!username.trim() || !password.trim()) {
            throw new AppError_1.BadRequestError("Username and password are required");
        }
        const accountExists = await account_model_1.default.findByUsername(username);
        if (accountExists) {
            throw new AppError_1.ConflictError("Username already exist");
        }
        const account = {
            username: username.trim(),
            password: password.trim(),
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true
        };
        const result = await account_model_1.default.create(account);
        if (!result.insertedId) {
            throw new AppError_1.AppError("Failed to create account", 500);
        }
        return { success: true, accountId: result.insertedId, message: "Account created successfully" };
    }
    static async validate(username, password) {
        if (!username.trim() || !password.trim()) {
            throw new AppError_1.BadRequestError("Username and password are required");
        }
        const validatedAccount = await account_model_1.default.validate(username, password);
        if (!validatedAccount) {
            throw new AppError_1.BadRequestError("Invalid credentials");
        }
        const { password: _, ...safeAccount } = validatedAccount;
        return { success: true, safeAccount, message: "Account validated successfully" };
    }
}
exports.default = AccountService;
//# sourceMappingURL=account.service.js.map