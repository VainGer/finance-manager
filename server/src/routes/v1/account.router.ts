import AccountController from "../../controllers/account.controller";
import { Router } from "express";

const accountRouter = Router();

accountRouter.post<{}, {}, { username: string, password: string }>("/register", AccountController.createAccount);
accountRouter.post<{}, {}, { username: string, password: string }>("/validate", AccountController.validateAccount);
accountRouter.post<{}, {}, { username: string, currentPassword: string, newPassword: string }>("/change-password", AccountController.changePassword);

export default accountRouter;