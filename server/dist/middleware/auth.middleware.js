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
exports.adminTokenVerification = exports.refreshTokenVerification = exports.accessTokenVerification = void 0;
const JWT_1 = __importDefault(require("../utils/JWT"));
const AppErrors = __importStar(require("../errors/AppError"));
const accessTokenVerification = (req, res, next) => {
    try {
        let token = req.cookies?.accessToken || null;
        if (!token) {
            const authHeader = req.headers.authorization;
            const tokenFromHeader = req.headers["x-access-token"];
            if (authHeader?.startsWith("Bearer "))
                token = authHeader.split(" ")[1];
            else if (tokenFromHeader)
                token = tokenFromHeader;
        }
        if (!token)
            throw new AppErrors.UnauthorizedError("Access token is required");
        const decoded = JWT_1.default.verifyAccessToken(token);
        if (!decoded)
            throw new AppErrors.UnauthorizedError("Invalid or expired access token");
        req.profileId = decoded.profileId;
        next();
    }
    catch (error) {
        handleAuthError(res, error);
    }
};
exports.accessTokenVerification = accessTokenVerification;
const refreshTokenVerification = (req, res, next) => {
    try {
        let token = req.cookies?.refreshToken || null;
        if (!token)
            token = req.body.refreshToken || req.headers["x-refresh-token"];
        if (!token)
            throw new AppErrors.UnauthorizedError("Refresh token is required");
        const decoded = JWT_1.default.verifyRefreshToken(token);
        if (!decoded)
            throw new AppErrors.UnauthorizedError("Invalid refresh token");
        req.profileId = decoded.profileId;
        req.tokenJti = decoded.jti;
        next();
    }
    catch (error) {
        handleAuthError(res, error);
    }
};
exports.refreshTokenVerification = refreshTokenVerification;
const adminTokenVerification = (req, res, next) => {
    try {
        const token = req.cookies?.adminAccessToken || null;
        if (!token)
            throw new AppErrors.UnauthorizedError("Admin access token is required");
        const decoded = JWT_1.default.verifyAdminAccessToken(token);
        if (!decoded)
            throw new AppErrors.UnauthorizedError("Invalid or expired admin token");
        req.adminUsername = decoded.username;
        next();
    }
    catch (error) {
        handleAuthError(res, error);
    }
};
exports.adminTokenVerification = adminTokenVerification;
function handleAuthError(res, error) {
    if (error instanceof AppErrors.AppError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
    }
    else {
        res.status(500).json({ success: false, message: "Authentication error" });
    }
}
//# sourceMappingURL=auth.middleware.js.map