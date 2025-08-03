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

            const result = await db.GetDocument(AccountModel.accountCollection, { "username": username });
            if (!result) {
                return null;
            }
            const { password, account } = result;
            return account;
        } catch (error) {
            console.error("Error in AccountModel.findByUsername", error);
            throw new Error("Failed to find account by username");
        }
    }

}