import { Account } from "../../types/account.types";
import { BadRequestError, ConflictError, AppError, UnauthorizedError } from "../../errors/AppError";
import AccountModel from "../../models/account/account.model";

export default class AccountService {

    static async create(username: string, password: string) {
        if (!username.trim() || !password.trim()) {
            throw new BadRequestError("Username and password are required");
        }

        const accountExists = await AccountModel.findByUsername(username);
        if (accountExists) {
            throw new ConflictError("Username already exist");
        }

        const account: Account = {
            username: username.trim(),
            password: password.trim(),
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true
        }

        const result = await AccountModel.create(account);
        if (!result.insertedId) {
            throw new AppError("Failed to create account", 500);
        }
        return { success: true, accountId: result.insertedId, message: "Account created successfully" };
    }

    static async validate(username: string, password: string) {
        if (!username.trim() || !password.trim()) {
            throw new BadRequestError("Username and password are required");
        }
        const validatedAccount = await AccountModel.validate(username, password);
        if (!validatedAccount) {
            throw new BadRequestError("Invalid credentials");
        }
        const { password: _, ...safeAccount } = validatedAccount;
        return { success: true, safeAccount, message: "Account validated successfully" };
    }

    static async changePassword(username: string, currentPassword: string, newPassword: string) {
        if (!username?.trim() || !currentPassword?.trim() || !newPassword?.trim()) {
            throw new BadRequestError('Username, current and new password are required');
        }
        if (newPassword.trim().length < 6) {
            throw new BadRequestError('New password must be at least 6 characters');
        }
        if (newPassword.trim() === currentPassword.trim()) {
            throw new BadRequestError('New password must be different from current password');
        }
        const validatedAccount = await AccountModel.validate(username, currentPassword);
        if (!validatedAccount) {
            throw new UnauthorizedError('Invalid current password');
        }
        const result = await AccountModel.updatePassword(username, newPassword);
        if (!result.success) {
            throw new AppError(result.message, 500);
        }
        return { success: true, message: 'Password changed successfully' };
    }
}