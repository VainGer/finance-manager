"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const budget_controller_1 = __importDefault(require("../../controllers/budget.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const budgetRouter = (0, express_1.Router)();
// Profile budget routes - all protected with token verification
budgetRouter.post("/add-child-budget", auth_middleware_1.accessTokenVerification, budget_controller_1.default.addChildBudgets);
budgetRouter.get("/get-child-budgets", auth_middleware_1.accessTokenVerification, budget_controller_1.default.getChildBudgets);
budgetRouter.get("/get-profile-budgets", auth_middleware_1.accessTokenVerification, budget_controller_1.default.getProfileBudgets);
budgetRouter.get("/get-category-budgets", auth_middleware_1.accessTokenVerification, budget_controller_1.default.getCategoryBudgets);
budgetRouter.post("/add-budget", auth_middleware_1.accessTokenVerification, budget_controller_1.default.createBudget);
budgetRouter.post("/check-budget-dates", auth_middleware_1.accessTokenVerification, budget_controller_1.default.validateBudgetDates);
budgetRouter.delete("/delete-budget/:username/:profileName/:budgetId", auth_middleware_1.accessTokenVerification, budget_controller_1.default.deleteBudget);
exports.default = budgetRouter;
//# sourceMappingURL=budgets.router.js.map