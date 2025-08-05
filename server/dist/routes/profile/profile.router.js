"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = __importDefault(require("../../controllers/profile.controller"));
const profileRouter = (0, express_1.Router)();
profileRouter.post("/create-profile", profile_controller_1.default.createProfile);
profileRouter.post("/validate-profile", profile_controller_1.default.validateProfile);
profileRouter.post("/change-pin", profile_controller_1.default.changeProfilePin);
profileRouter.post("/rename-profile", profile_controller_1.default.renameProfile);
profileRouter.post("/delete-profile", profile_controller_1.default.deleteProfile);
profileRouter.get("/get-profiles", profile_controller_1.default.getAllProfiles);
profileRouter.post("/set-avatar", profile_controller_1.default.setAvatar);
profileRouter.post("/set-color", profile_controller_1.default.setColor);
// profileRouter.get<{}, {}, { username: string, profileName: string }>
//     ("/get-budgets", ProfileController.getProfileBudgets);
// profileRouter.post<{}, {}, { budgetData: BudgetCreationData }>
//     ("/add-budget", ProfileController.createProfileBudget);
exports.default = profileRouter;
//# sourceMappingURL=profile.router.js.map