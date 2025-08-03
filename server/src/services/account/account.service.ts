import { Account } from "../../types/account.types";
import { BadRequestError, ConflictError, AppError } from "../../errors/AppError";
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

}