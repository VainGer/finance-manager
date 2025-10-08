import type { CookieOptions } from "express";

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
