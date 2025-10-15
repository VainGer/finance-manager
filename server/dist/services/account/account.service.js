"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppErrors = __importStar(require("../../errors/AppError"));
const account_model_1 = __importDefault(require("../../models/account/account.model"));
const admin_service_1 = __importDefault(require("../admin/admin.service"));
class AccountService {
    static async create(username, password) {
        if (!username.trim() || !password.trim()) {
            throw new AppErrors.ValidationError("Username and password are required.");
        }
        const accountExists = await account_model_1.default.findByUsername(username);
        if (accountExists) {
            throw new AppErrors.ConflictError(`Username '${username}' already exists.`);
        }
        const account = {
            username: username.trim(),
            password: password.trim(),
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            tokens: []
        };
        const result = await account_model_1.default.create(account);
        if (!result.insertedId) {
            throw new AppErrors.DatabaseError("Failed to create account. Database operation unsuccessful.");
        }
        admin_service_1.default.logAction({
            type: "create",
            executeAccount: username,
            action: "create_account",
            target: { username }
        });
        return { success: true, accountId: result.insertedId, message: "Account created successfully." };
    }
    static async validate(username, password) {
        if (!username.trim() || !password.trim()) {
            throw new AppErrors.ValidationError("Username and password are required.");
        }
        const validatedAccount = await account_model_1.default.validate(username, password);
        if (!validatedAccount) {
            throw new AppErrors.CredentialError("Invalid credentials. Please check your username and password.");
        }
        const { password: _, tokens, __, ...safeAccount } = validatedAccount;
        admin_service_1.default.logAction({
            type: "login",
            executeAccount: username,
            action: "account_login",
            target: { username }
        });
        return { success: true, safeAccount, message: "Account validated successfully." };
    }
    static async changePassword(username, currentPassword, newPassword) {
        if (!username?.trim() || !currentPassword?.trim() || !newPassword?.trim()) {
            throw new AppErrors.ValidationError('Username, current and new password are required.');
        }
        if (newPassword.trim().length < 6) {
            throw new AppErrors.ValidationError('New password must be at least 6 characters.');
        }
        if (newPassword.trim() === currentPassword.trim()) {
            throw new AppErrors.ValidationError('New password must be different from current password.');
        }
        const validatedAccount = await account_model_1.default.validate(username, currentPassword);
        if (!validatedAccount) {
            throw new AppErrors.CredentialError('Invalid current password. Authentication failed.');
        }
        const result = await account_model_1.default.updatePassword(username, newPassword);
        if (!result.success) {
            throw new AppErrors.DatabaseError(`Failed to update password: ${result.message}`);
        }
        admin_service_1.default.logAction({
            type: "update",
            executeAccount: username,
            action: "change_password",
            target: { username }
        });
        return { success: true, message: 'Password changed successfully.' };
    }
}
exports.default = AccountService;
//# sourceMappingURL=account.service.js.map