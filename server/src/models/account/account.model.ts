import db from "../../server";
import bcrypt from 'bcrypt';
import { Account } from "../../types/account.types";

export default class AccountModel {

    private static accountCollection: string = 'accounts';
    private static SALT_ROUNDS = 10;

    static async create(account: Account) {
        try {
            const hashedPassword = await bcrypt.hash(account.password, this.SALT_ROUNDS);
            const accountToInsert = {
                ...account,
                password: hashedPassword
            }
            const result = await db.AddDocument(this.accountCollection, accountToInsert);
            if (result?.insertedId) {
                return { success: true, insertedId: result.insertedId };
            }
            return { success: false, insrtedId: null };
        } catch (error) {
            console.error("Error in AccountModel.create", error);
            throw new Error("Account creation failed")
        }
    }

    static async validate(username: string, password: string) {
        try {

            const account = await db.GetDocument(this.accountCollection, { "username": username });
            if (!account) {
                return null;
            }
            const isValid = await bcrypt.compare(password, account.password);
            if (isValid) {
                return account;
            }
            return null;
        } catch (error) {
            console.error("Error in AccountModel.validate", error);
            throw new Error("Account validation failed");
        }
    }

    static async findByUsername(username: string) {
        try {

            const account = await db.GetDocument(this.accountCollection, { "username": username });
            if (!account) {
                return null;
            }
            return account;
        } catch (error) {
            console.error("Error in AccountModel.findByUsername", error);
            throw new Error("Failed to find account by username");
        }
    }

    static async updatePassword(username: string, newPassword: string) {
        try {
            const hashed = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
            const result = await db.UpdateDocument(this.accountCollection, { username }, { $set: { password: hashed, updatedAt: new Date() } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: 'Account not found or password unchanged' };
            }
            return { success: true, message: 'Password updated successfully' };
        } catch (error) {
            console.error('Error in AccountModel.updatePassword', error);
            throw new Error('Failed to update password');
        }
    }
}