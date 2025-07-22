import { Account } from './account.types';
import { Response, Request } from 'express';
import db from '../../server';
import { ObjectId } from 'mongodb';

export default class AccountModel {
    private static accountCollection: string = 'accounts';

    // Helper methods for validation and response formatting
    private static validateRequiredFields(fields: Record<string, any>): string | null {
        for (const [key, value] of Object.entries(fields)) {
            if (value === undefined || value === null || value === '') {
                return `${key} is required`;
            }
        }
        return null;
    }

    private static formatResponse(res: Response, result: any, dataField?: string, statusCode: number = 200) {
        const response: any = {
            message: result.message || result.error
        };
        
        if (dataField && result[dataField] !== undefined) {
            response[dataField] = result[dataField];
        }
        
        res.status(statusCode).json(response);
    }

    static async createAccount(req: Request, res: Response) {
        try {
            const account = req.body as Account;
            
            if (!account) {
                return AccountModel.formatResponse(res, {
                    message: "Account data is required"
                }, undefined, 400);
            }
            
            const errorMsg = AccountModel.validateRequiredFields({ 
                username: account.username, 
                password: account.password 
            });
            
            if (errorMsg) {
                return AccountModel.formatResponse(res, {
                    message: errorMsg
                }, undefined, 400);
            }
            let registeredAccount = await db.GetDocument(AccountModel.accountCollection, { "username": account.username });
            
            if (registeredAccount) {
                return AccountModel.formatResponse(res, {
                    message: "Account already exists"
                }, undefined, 409);
            }
            
            const result = await db.AddDocument(AccountModel.accountCollection, account as Account);
            
            if (result?.insertedId) {
                const accountToReturn = {
                    username: account.username,
                    createdAt: account.createdAt,
                    updatedAt: account.updatedAt,
                    isActive: account.isActive
                };
                
                return AccountModel.formatResponse(res, {
                    message: "Account registered successfully",
                    account: accountToReturn
                }, "account", 201);
            } else {
                return AccountModel.formatResponse(res, {
                    message: "Failed to create account"
                }, undefined, 500);
            }
        } catch (error) {
            console.log("Error creating account: ", error);
            return AccountModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }

    static async getAccountById(req: Request, res: Response) {
        try {
            let accountId = req.body.id as string;
            
            if (!accountId) {
                return AccountModel.formatResponse(res, {
                    message: "Account ID is required"
                }, undefined, 400);
            }
            
            if (accountId.length !== 24) {
                return AccountModel.formatResponse(res, {
                    message: "Invalid account ID"
                }, undefined, 400);
            }
            
            let accountFound = await db.GetDocument(AccountModel.accountCollection, { "_id": ObjectId.createFromHexString(accountId) });
            
            if (!accountFound) {
                return AccountModel.formatResponse(res, {
                    message: "Account not found"
                }, undefined, 404);
            }
            
            const { password, ...accountToReturn } = accountFound;
            return AccountModel.formatResponse(res, {
                message: "Account retrieved successfully",
                account: accountToReturn
            }, "account", 200);

        } catch (error) {
            console.log("Error getting account: ", error);
            return AccountModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
    static async ValidateAccount(req: Request, res: Response) {
        try {
            const account = req.body as Account;
            
            if (!account) {
                return AccountModel.formatResponse(res, {
                    message: "Account data is required"
                }, undefined, 400);
            }
            
            const errorMsg = AccountModel.validateRequiredFields({ 
                username: account.username, 
                password: account.password 
            });
            
            if (errorMsg) {
                return AccountModel.formatResponse(res, {
                    message: errorMsg
                }, undefined, 400);
            }
            
            let accountFound = await db.GetDocument(AccountModel.accountCollection, { "username": account.username });
            
            if (accountFound && accountFound.password === account.password) {
                const { password, ...accountToReturn } = accountFound;
                return AccountModel.formatResponse(res, {
                    message: "Account validated successfully",
                    account: accountToReturn
                }, "account", 200);
            } else {
                return AccountModel.formatResponse(res, {
                    message: "Invalid username or password"
                }, undefined, 401);
            }
        } catch (error) {
            console.log("Error validating account: ", error);
            return AccountModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
}