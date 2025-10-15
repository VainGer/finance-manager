"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_controller_1 = __importDefault(require("../../controllers/account.controller"));
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const accountRouter = (0, express_1.Router)();
// Authentication endpoints (no middleware)
accountRouter.post("/register", account_controller_1.default.createAccount);
accountRouter.post("/validate", account_controller_1.default.validateAccount);
// Token management
accountRouter.post("/validate-token", account_controller_1.default.validateToken);
// Routes that require authentication
accountRouter.post("/change-password", auth_middleware_1.accessTokenVerification, account_controller_1.default.changePassword);
exports.default = accountRouter;
//# sourceMappingURL=account.router.js.map