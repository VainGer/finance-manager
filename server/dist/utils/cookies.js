"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = void 0;
const cookieOptions = (maxAge) => {
    const isProd = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge,
    };
};
exports.cookieOptions = cookieOptions;
//# sourceMappingURL=cookies.js.map