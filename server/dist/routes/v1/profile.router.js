"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = __importDefault(require("../../controllers/profile.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const profileRouter = (0, express_1.Router)();
// Authentication endpoints (no middleware)
profileRouter.post("/create-first-profile", profile_controller_1.default.createProfile);
profileRouter.post("/validate-profile", profile_controller_1.default.validateProfile);
profileRouter.post("/logout", profile_controller_1.default.logout);
profileRouter.get("/get-profiles", profile_controller_1.default.getAllProfiles);
// Routes that require authentication
profileRouter.post("/create-profile", auth_middleware_1.accessTokenVerification, profile_controller_1.default.createProfile);
profileRouter.post("/create-child-profile", auth_middleware_1.accessTokenVerification, profile_controller_1.default.createChildProfile);
profileRouter.post("/change-pin", auth_middleware_1.accessTokenVerification, profile_controller_1.default.changeProfilePin);
profileRouter.post("/rename-profile", auth_middleware_1.accessTokenVerification, profile_controller_1.default.renameProfile);
profileRouter.post("/delete-profile", auth_middleware_1.accessTokenVerification, profile_controller_1.default.deleteProfile);
profileRouter.post("/update-profile", auth_middleware_1.accessTokenVerification, profile_controller_1.default.updateProfile);
profileRouter.post("/set-avatar", auth_middleware_1.accessTokenVerification, profile_controller_1.default.setAvatar);
profileRouter.post("/set-color", auth_middleware_1.accessTokenVerification, profile_controller_1.default.setColor);
profileRouter.post("/refresh-access-token", auth_middleware_1.accessTokenVerification, profile_controller_1.default.refreshAccessToken);
profileRouter.post("/categorize-transactions", auth_middleware_1.accessTokenVerification, profile_controller_1.default.categorizeTransactions);
profileRouter.post("/upload-transactions", auth_middleware_1.accessTokenVerification, profile_controller_1.default.uploadTransactions);
exports.default = profileRouter;
//# sourceMappingURL=profile.router.js.map