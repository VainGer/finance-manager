import AccountController from "../../controllers/account.controller";
import { Router } from "express";
import { accessTokenVerification, refreshTokenVerification } from "../../middleware/auth.middleware";

const accountRouter = Router();

// Authentication endpoints (no middleware)
accountRouter.post<{}, {}, { username: string, password: string }>("/register", AccountController.createAccount);
accountRouter.post<{}, {}, { username: string, password: string }>("/validate", AccountController.validateAccount);

// Token management
accountRouter.post<{}, {}, { 
    username: string, 
    profileId: string, 
    refreshToken: string, 
    device: string,
    isAutoLogin?: boolean
}>("/validate-token", AccountController.validateToken);

// Routes that require authentication
accountRouter.post<{}, {}, { username: string, currentPassword: string, newPassword: string }>(
    "/change-password", accessTokenVerification, AccountController.changePassword);

export default accountRouter;