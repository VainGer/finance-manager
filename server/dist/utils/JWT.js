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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const AppErrors = __importStar(require("../errors/AppError"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../dotenv/.env") });
class JWT {
    static JWT_SECRET = process.env.JWT_SECRET;
    static JWT_ADMIN_ACCESS_EXPIRATION = process.env.JWT_ADMIN_ACCESS_EXPIRATION || "15m";
    static JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || "30m";
    static JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || "7d";
    static JWT_REFRESH_MAX_VALIDITY = process.env.JWT_REFRESH_MAX_VALIDITY || "30d";
    static signAccessToken(payload) {
        if (!this.JWT_SECRET)
            throw new AppErrors.InternalServerError("JWT secret not defined");
        return jsonwebtoken_1.default.sign({ ...payload, type: "access" }, this.JWT_SECRET, { expiresIn: this.JWT_ACCESS_EXPIRATION });
    }
    static verifyAccessToken(token) {
        try {
            if (!this.JWT_SECRET)
                throw new AppErrors.InternalServerError("JWT secret not defined");
            const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
            return decoded.type === "access" ? { profileId: decoded.profileId } : null;
        }
        catch {
            return null;
        }
    }
    static signAdminAccessToken(payload) {
        if (!this.JWT_SECRET)
            throw new AppErrors.InternalServerError("JWT secret not defined");
        return jsonwebtoken_1.default.sign({ ...payload, type: "admin" }, this.JWT_SECRET, { expiresIn: this.JWT_ADMIN_ACCESS_EXPIRATION });
    }
    static verifyAdminAccessToken(token) {
        try {
            if (!this.JWT_SECRET)
                throw new AppErrors.InternalServerError("JWT secret not defined");
            const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
            return decoded.type === "admin" ? { username: decoded.username } : null;
        }
        catch (error) {
            console.error("Admin token verification failed:", error);
            return null;
        }
    }
    static signRefreshToken(payload) {
        if (!this.JWT_SECRET)
            throw new AppErrors.InternalServerError("JWT secret not defined");
        const jti = crypto_1.default.randomBytes(16).toString("hex");
        return jsonwebtoken_1.default.sign({ ...payload, type: "refresh", jti }, this.JWT_SECRET, { expiresIn: this.JWT_REFRESH_EXPIRATION });
    }
    static verifyRefreshToken(token) {
        try {
            if (!this.JWT_SECRET)
                throw new AppErrors.InternalServerError("JWT secret not defined");
            const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
            return decoded.type === "refresh" ? { profileId: decoded.profileId, jti: decoded.jti } : null;
        }
        catch {
            return null;
        }
    }
    static getRefreshTokenExpiryDate(token) {
        if (!this.JWT_SECRET)
            throw new AppErrors.InternalServerError("JWT secret not defined");
        const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
        if (!decoded?.exp)
            throw new AppErrors.AppError("Invalid refresh token", 400);
        return new Date(decoded.exp * 1000);
    }
    static getRefreshTokenMaxValidityDate(token) {
        if (!this.JWT_SECRET)
            throw new AppErrors.InternalServerError("JWT secret not defined");
        const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
        if (!decoded?.exp)
            throw new AppErrors.AppError("Invalid refresh token", 400);
        const daysMatch = this.JWT_REFRESH_MAX_VALIDITY.match(/(\d+)d/);
        const days = daysMatch ? parseInt(daysMatch[1]) : 30;
        const maxValidity = new Date(decoded.exp * 1000);
        maxValidity.setDate(maxValidity.getDate() + days);
        return maxValidity;
    }
    static getTokenJti(token) {
        try {
            if (!this.JWT_SECRET)
                throw new AppErrors.InternalServerError("JWT secret not defined");
            const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
            return decoded.jti || null;
        }
        catch {
            return null;
        }
    }
    static decodeToken(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch {
            return null;
        }
    }
}
exports.default = JWT;
//# sourceMappingURL=JWT.js.map