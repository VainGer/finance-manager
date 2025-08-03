"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const mongodb_1 = require("mongodb");
class AccountModel {
    static accountCollection = 'accounts';
    // Helper methods for validation and response formatting
    static validateRequiredFields(fields) {
        for (const [key, value] of Object.entries(fields)) {
            if (value === undefined || value === null || value === '') {
                return `${key} is required`;
            }
        }
        return null;
    }
    static formatResponse(res, result, dataField, statusCode = 200) {
        const response = {
            message: result.message || result.error
        };
        if (dataField && result[dataField] !== undefined) {
            response[dataField] = result[dataField];
        }
        res.status(statusCode).json(response);
    }
    static async createAccount(req, res) {
        try {
            const account = req.body;
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
            let registeredAccount = await server_1.default.GetDocument(AccountModel.accountCollection, { "username": account.username });
            if (registeredAccount) {
                return AccountModel.formatResponse(res, {
                    message: "Account already exists"
                }, undefined, 409);
            }
            const result = await server_1.default.AddDocument(AccountModel.accountCollection, account);
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
            }
            else {
                return AccountModel.formatResponse(res, {
                    message: "Failed to create account"
                }, undefined, 500);
            }
        }
        catch (error) {
            console.log("Error creating account: ", error);
            return AccountModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
    static async getAccountById(req, res) {
        try {
            let accountId = req.body.id;
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
            let accountFound = await server_1.default.GetDocument(AccountModel.accountCollection, { "_id": mongodb_1.ObjectId.createFromHexString(accountId) });
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
        }
        catch (error) {
            console.log("Error getting account: ", error);
            return AccountModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
    static async ValidateAccount(req, res) {
        try {
            const account = req.body;
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
            let accountFound = await server_1.default.GetDocument(AccountModel.accountCollection, { "username": account.username });
            if (accountFound && accountFound.password === account.password) {
                const { password, ...accountToReturn } = accountFound;
                return AccountModel.formatResponse(res, {
                    message: "Account validated successfully",
                    account: accountToReturn
                }, "account", 200);
            }
            else {
                return AccountModel.formatResponse(res, {
                    message: "Invalid username or password"
                }, undefined, 401);
            }
        }
        catch (error) {
            console.log("Error validating account: ", error);
            return AccountModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }
}
exports.default = AccountModel;
//# sourceMappingURL=account.model.js.map