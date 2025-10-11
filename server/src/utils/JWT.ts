import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";
import * as AppErrors from "../errors/AppError";

dotenv.config({ path: path.join(__dirname, "../dotenv/.env") });

export default class JWT {
    private static JWT_SECRET = process.env.JWT_SECRET;
    private static JWT_ADMIN_ACCESS_EXPIRATION = process.env.JWT_ADMIN_ACCESS_EXPIRATION || "15m";
    private static JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || "30m";
    private static JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || "7d";
    private static JWT_REFRESH_MAX_VALIDITY = process.env.JWT_REFRESH_MAX_VALIDITY || "30d";


    static signAccessToken(payload: { profileId: string }) {
        if (!this.JWT_SECRET) throw new AppErrors.InternalServerError("JWT secret not defined");
        return jwt.sign(
            { ...payload, type: "access" },
            this.JWT_SECRET,
            { expiresIn: this.JWT_ACCESS_EXPIRATION as any }
        );
    }

    static verifyAccessToken(token: string): { profileId: string } | null {
        try {
            if (!this.JWT_SECRET) throw new AppErrors.InternalServerError("JWT secret not defined");
            const decoded = jwt.verify(token, this.JWT_SECRET) as { profileId: string; type?: string };
            return decoded.type === "access" ? { profileId: decoded.profileId } : null;
        } catch {
            return null;
        }
    }


    static signAdminAccessToken(payload: { username: string }) {
        if (!this.JWT_SECRET) throw new AppErrors.InternalServerError("JWT secret not defined");
        return jwt.sign(
            { ...payload, type: "admin" },
            this.JWT_SECRET,
            { expiresIn: this.JWT_ADMIN_ACCESS_EXPIRATION as any }
        );
    }

    static verifyAdminAccessToken(token: string): { username: string } | null {
        try {
            if (!this.JWT_SECRET) throw new AppErrors.InternalServerError("JWT secret not defined");
            const decoded = jwt.verify(token, this.JWT_SECRET) as { username: string; type?: string };
            return decoded.type === "admin" ? { username: decoded.username } : null;
        } catch (error) {
            console.error("Admin token verification failed:", error);
            return null;
        }
    }


    static signRefreshToken(payload: { profileId: string }) {
        if (!this.JWT_SECRET) throw new AppErrors.InternalServerError("JWT secret not defined");
        const jti = crypto.randomBytes(16).toString("hex");
        return jwt.sign(
            { ...payload, type: "refresh", jti },
            this.JWT_SECRET,
            { expiresIn: this.JWT_REFRESH_EXPIRATION as any }
        );
    }

    static verifyRefreshToken(token: string): { profileId: string; jti?: string } | null {
        try {
            if (!this.JWT_SECRET) throw new AppErrors.InternalServerError("JWT secret not defined");
            const decoded = jwt.verify(token, this.JWT_SECRET) as {
                profileId: string;
                type?: string;
                jti?: string;
            };
            return decoded.type === "refresh" ? { profileId: decoded.profileId, jti: decoded.jti } : null;
        } catch {
            return null;
        }
    }

    static getRefreshTokenExpiryDate(token: string): Date {
        if (!this.JWT_SECRET) throw new AppErrors.InternalServerError("JWT secret not defined");
        const decoded = jwt.verify(token, this.JWT_SECRET) as { exp: number };
        if (!decoded?.exp) throw new AppErrors.AppError("Invalid refresh token", 400);
        return new Date(decoded.exp * 1000);
    }

    static getRefreshTokenMaxValidityDate(token: string): Date {
        if (!this.JWT_SECRET) throw new AppErrors.InternalServerError("JWT secret not defined");
        const decoded = jwt.verify(token, this.JWT_SECRET) as { exp: number };
        if (!decoded?.exp) throw new AppErrors.AppError("Invalid refresh token", 400);
        const daysMatch = this.JWT_REFRESH_MAX_VALIDITY.match(/(\d+)d/);
        const days = daysMatch ? parseInt(daysMatch[1]) : 30;
        const maxValidity = new Date(decoded.exp * 1000);
        maxValidity.setDate(maxValidity.getDate() + days);
        return maxValidity;
    }

    static getTokenJti(token: string): string | null {
        try {
            if (!this.JWT_SECRET) throw new AppErrors.InternalServerError("JWT secret not defined");
            const decoded = jwt.verify(token, this.JWT_SECRET) as { jti?: string };
            return decoded.jti || null;
        } catch {
            return null;
        }
    }

    static decodeToken(token: string): any {
        try {
            return jwt.decode(token);
        } catch {
            return null;
        }
    }
}
