import db from "../../server";
import bcrypt from 'bcrypt';
import { Account, Token } from "../../types/account.types";

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

            const account = await db.GetDocument(this.accountCollection, { "username": username }) as Account;
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

    static async storeToken(username: string, token: Token) {
        try {
            const result = await db.UpdateDocument(this.accountCollection, { username },
                { $addToSet: { tokens: token } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: 'Account not found or token not added' };
            }
            return { success: true, message: 'Token added successfully' };
        } catch (error) {
            console.error('Error in AccountModel.addToken', error);
            throw new Error('Failed to add token');
        }
    }

    static async removeToken(username: string, tokenValue: string) {
        try {
            const result = await db.UpdateDocument(this.accountCollection, { username }, { $pull: { tokens: { value: tokenValue } } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: 'Account not found or token not removed' };
            }
            return { success: true, message: 'Token removed successfully' };
        } catch (error) {
            console.error('Error in AccountModel.removeToken', error);
            throw new Error('Failed to remove token');
        }
    }

    static async getTokens(username: string, profileId: string) {
        try {
            const account = await db.GetDocument(this.accountCollection, { username });
            if (!account || !account.tokens) {
                return { success: true, tokens: [], message: 'No tokens found' };
            }

            const tokens = account.tokens.filter((token: Token) =>
                token.profileId && token.profileId.toString() === profileId
            );

            return { success: true, tokens, message: 'Tokens retrieved successfully' };
        } catch (error) {
            console.error('Error in AccountModel.getTokens', error);
            throw new Error('Failed to get tokens');
        }
    }

    static async updateTokenLastUsed(username: string, tokenValue: string) {
        try {
            const result = await db.UpdateDocument(
                this.accountCollection, 
                { username, "tokens.value": tokenValue },
                { $set: { "tokens.$.lastUsedAt": new Date() } }
            );
            
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: 'Account not found or token not updated' };
            }
            return { success: true, message: 'Token last used timestamp updated successfully' };
        } catch (error) {
            console.error('Error in AccountModel.updateTokenLastUsed', error);
            throw new Error('Failed to update token last used timestamp');
        }
    }

    static async cleanupExpiredTokens(username: string) {
        try {
            const now = new Date();
            const result = await db.UpdateDocument(
                this.accountCollection,
                { username },
                { $pull: { tokens: { maxValidUntil: { $lt: now } } } }
            );
            
            if (!result) {
                return { success: false, message: 'Account not found or tokens not cleaned up' };
            }
            
            return { 
                success: true, 
                message: 'Expired tokens cleaned up successfully',
                removedCount: result.modifiedCount > 0 ? 'Some tokens were removed' : 'No tokens needed cleanup'
            };
        } catch (error) {
            console.error('Error in AccountModel.cleanupExpiredTokens', error);
            throw new Error('Failed to clean up expired tokens');
        }
    }
}