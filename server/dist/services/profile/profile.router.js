"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profile_model_1 = __importDefault(require("./profile.model"));
const express_1 = require("express");
const profileRouter = (0, express_1.Router)();
profileRouter.post("/create-profile", profile_model_1.default.createProfile);
profileRouter.post("/validate-profile", profile_model_1.default.validateProfile);
profileRouter.post("/change-pin", profile_model_1.default.changeProfilePin);
profileRouter.post("/rename-profile", profile_model_1.default.renameProfile);
profileRouter.post("/delete-profile", profile_model_1.default.deleteProfile);
profileRouter.get("/get-profiles", profile_model_1.default.getAllProfiles);
profileRouter.post("/set-avatar", profile_model_1.default.setAvatar);
profileRouter.post("/set-color", profile_model_1.default.setColor);
profileRouter.post("/create-budget", profile_model_1.default.createProfileBudget);
profileRouter.get("/get-budgets", profile_model_1.default.getProfileBudgets);
exports.default = profileRouter;
//# sourceMappingURL=profile.router.js.map