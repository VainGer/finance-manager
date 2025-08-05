"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AccountModel {
    static accountCollection = 'accounts';
    static SALT_ROUNDS = 10;
    static async create(account) {
        try {
            const hashedPassword = await bcrypt_1.default.hash(account.password, this.SALT_ROUNDS);
            const accountToInsert = {
                ...account,
                password: hashedPassword
            };
            const result = await server_1.default.AddDocument(this.accountCollection, accountToInsert);
            if (result?.insertedId) {
                return { success: true, insertedId: result.insertedId };
            }
            return { success: false, insrtedId: null };
        }
        catch (error) {
            console.error("Error in AccountModel.create", error);
            throw new Error("Account creation failed");
        }
    }
    static async validate(username, password) {
        try {
            const account = await server_1.default.GetDocument(this.accountCollection, { "username": username });
            if (!account) {
                return null;
            }
            const isValid = await bcrypt_1.default.compare(password, account.password);
            if (isValid) {
                return account;
            }
            return null;
        }
        catch (error) {
            console.error("Error in AccountModel.validate", error);
            throw new Error("Account validation failed");
        }
    }
    static async findByUsername(username) {
        try {
            const result = await server_1.default.GetDocument(AccountModel.accountCollection, { "username": username });
            if (!result) {
                return null;
            }
            const { password, account } = result;
            return account;
        }
        catch (error) {
            console.error("Error in AccountModel.findByUsername", error);
            throw new Error("Failed to find account by username");
        }
    }
}
exports.default = AccountModel;
//# sourceMappingURL=account.model.js.map