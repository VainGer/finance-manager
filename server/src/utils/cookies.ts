import type { CookieOptions } from "express";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../dotenv/.env') });

export const cookieOptions = (maxAge: number): CookieOptions => {
    const isProd = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge,
    };
};
