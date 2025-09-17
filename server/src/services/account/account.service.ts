import { Account } from "../../types/account.types";
import * as AppErrors from "../../errors/AppError";
import AccountModel from "../../models/account/account.model";

export default class AccountService {

    static async create(username: string, password: string) {
        if (!username.trim() || !password.trim()) {
            throw new AppErrors.ValidationError("Username and password are required.");
        }

        const accountExists = await AccountModel.findByUsername(username);
        if (accountExists) {
            throw new AppErrors.ConflictError(`Username '${username}' already exists.`);
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
            throw new AppErrors.DatabaseError("Failed to create account. Database operation unsuccessful.");
        }
        return { success: true, accountId: result.insertedId, message: "Account created successfully." };
    }

    static async validate(username: string, password: string) {
        if (!username.trim() || !password.trim()) {
            throw new AppErrors.ValidationError("Username and password are required.");
        }
        
        const validatedAccount = await AccountModel.validate(username, password);
        if (!validatedAccount) {
            throw new AppErrors.CredentialError("Invalid credentials. Please check your username and password.");
        }
        
        const { password: _, ...safeAccount } = validatedAccount;
        return { success: true, safeAccount, message: "Account validated successfully." };
    }

    static async changePassword(username: string, currentPassword: string, newPassword: string) {
        if (!username?.trim() || !currentPassword?.trim() || !newPassword?.trim()) {
            throw new AppErrors.ValidationError('Username, current and new password are required.');
        }
        
        if (newPassword.trim().length < 6) {
            throw new AppErrors.ValidationError('New password must be at least 6 characters.');
        }
        
        if (newPassword.trim() === currentPassword.trim()) {
            throw new AppErrors.ValidationError('New password must be different from current password.');
        }
        
        const validatedAccount = await AccountModel.validate(username, currentPassword);
        if (!validatedAccount) {
            throw new AppErrors.CredentialError('Invalid current password. Authentication failed.');
        }
        
        const result = await AccountModel.updatePassword(username, newPassword);
        if (!result.success) {
            throw new AppErrors.DatabaseError(`Failed to update password: ${result.message}`);
        }
        
        return { success: true, message: 'Password changed successfully.' };
    }
}