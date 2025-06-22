import { Account } from './account.types';
import { Response, Request } from 'express';
import db from '../../server';
import { ObjectId } from 'mongodb';

export default class AccountModel {
    private static accountCollection: string = 'accounts';

    static async createAccount(req: Request, res: Response) {
        try {
            const account = req.body as Account;
            if (!account || !account.username || !account.password) {
                let errorMsg = !account ? "Account data is required" :
                    !account.username ? "Username is required" : "Password is required";
                res.status(400).json({
                    message: errorMsg,
                    status: 400
                }
                );
                return;
            }
            let registeredAccount = await db.GetDocument(AccountModel.accountCollection, { "username": account.username });
            if (registeredAccount) {
                res.status(409).json({
                    message: "Account already exists",
                    status: 409
                });
            }
            else {
                await db.AddDocument(AccountModel.accountCollection, account as Account);
                res.status(201).json({
                    message: "Account registered successfully: " + registeredAccount,
                    account: {
                        username: account.username,
                        createdAt: account.createdAt,
                        updatedAt: account.updatedAt,
                        isActive: account.isActive
                    },
                    status: 201
                });
            }
        } catch (error) {
            console.log("Error creating account: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
            throw error;
        }
    }

    static async getAccountById(req: Request, res: Response) {
        try {
            let accountId = req.body.id as string;
            if (accountId.length !== 24) {
                res.status(400).json({
                    message: "Invalid account ID",
                    status: 400
                });
                return;
            }
            let accountFound = await db.GetDocument(AccountModel.accountCollection, { "_id": ObjectId.createFromHexString(accountId) });
            if (!accountFound) {
                res.status(404).json({
                    message: "Account not found",
                    status: 404
                });
            } else {
                const { password, ...accountToReturn } = accountFound;
                res.status(200).json({
                    message: "Account retrieved successfully",
                    account: accountToReturn,
                    status: 200
                });
            }

        } catch (error) {
            console.log("Error getting account: ", error);
            res.status(500).json({
                error: "Internal server error",
                status: 500
            });
            throw error;
        }
    }
    static async ValidateAccount(req: Request, res: Response) {
        try {
            const account = req.body as Account;
            if (!account || !account.username || !account.password) {
                let errorMsg = !account ? "Account data is required" :
                    !account.username ? "Username is required" : "Password is required";
                res.status(400).json({
                    message: errorMsg,
                    status: 400
                }
                );
                return;
            }
            let accountFound = await db.GetDocument(AccountModel.accountCollection, { "username": account.username });
            if (accountFound) {
                if (accountFound.password === account.password) {
                    const { password, ...accountToReturn } = accountFound;
                    res.status(200).json({
                        message: "Account validated successfully",
                        account: accountToReturn,
                        status: 200
                    });
                }
            } else {
                res.status(404).json(
                    {
                        message: "Account not found",
                        status: 404
                    });
            }
        } catch (error) {
            console.log("Error validating account: ", error);
            res.status(500).json({
                error: "Internal server error",
                status: 500
            });
            throw error;
        }
    }
}