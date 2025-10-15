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
const cookies_1 = require("../utils/cookies");
const account_service_1 = __importDefault(require("../services/account/account.service"));
const profile_service_1 = __importDefault(require("../services/profile/profile.service"));
const AppErrors = __importStar(require("../errors/AppError"));
const account_model_1 = __importDefault(require("../models/account/account.model"));
class AccountController {
    static async createAccount(req, res) {
        try {
            const { username, password } = req.body;
            await account_service_1.default.create(username, password);
            res.status(200).json({ message: "Account created successfully" });
        }
        catch (error) {
            console.error(error);
            if (error instanceof AppErrors.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
    static async validateAccount(req, res) {
        try {
            const { username, password } = req.body;
            const result = await account_service_1.default.validate(username, password);
            res.status(200).json({ account: result.safeAccount, message: result.message });
        }
        catch (error) {
            console.error(error);
            if (error instanceof AppErrors.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
    static async changePassword(req, res) {
        try {
            const { username, currentPassword, newPassword } = req.body;
            const result = await account_service_1.default.changePassword(username, currentPassword, newPassword);
            res.status(200).json({ message: result.message || "Password changed successfully" });
        }
        catch (error) {
            console.error(error);
            if (error instanceof AppErrors.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
    static async validateToken(req, res) {
        const isAutoLoginAttempt = req.body.isAutoLogin === true;
        try {
            const { username, profileId, refreshToken, device } = req.body;
            const { cookies } = req;
            const finalToken = cookies?.refreshToken || refreshToken;
            if (!username || !profileId || !finalToken || !device) {
                throw new AppErrors.ValidationError("Missing required fields for token validation");
            }
            const account = await account_model_1.default.findByUsername(username);
            if (!account) {
                throw new AppErrors.NotFoundError(`Account with username '${username}' not found`);
            }
            const { tokens: _ignored, password: _ignored2, ...safeAccount } = account;
            const result = await profile_service_1.default.validateByRefreshToken(username, profileId, finalToken, device);
            res.cookie("accessToken", result.tokens.accessToken, (0, cookies_1.cookieOptions)(30 * 60 * 1000));
            res.cookie("refreshToken", result.tokens.refreshToken, (0, cookies_1.cookieOptions)(7 * 24 * 60 * 60 * 1000));
            res.status(200).json({
                success: true,
                message: isAutoLoginAttempt ? "Auto login successful" : "Token validation successful",
                tokens: result.tokens,
                profile: result.safeProfile,
                account: safeAccount,
            });
        }
        catch (error) {
            console.error(isAutoLoginAttempt ? "Auto login failed:" : "Token validation failed:", error);
            let statusCode = 401;
            let message = isAutoLoginAttempt
                ? "Auto login failed, please login manually"
                : "Token validation failed";
            if (error instanceof AppErrors.AppError) {
                statusCode = error.statusCode;
                message = error.message;
            }
            res.clearCookie("accessToken", { path: "/" });
            res.clearCookie("refreshToken", { path: "/" });
            res.status(statusCode).json({
                success: false,
                message,
                ...(isAutoLoginAttempt && { requireManualLogin: true }),
            });
        }
    }
}
exports.default = AccountController;
//# sourceMappingURL=account.controller.js.map