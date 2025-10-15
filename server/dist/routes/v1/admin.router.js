"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../../controllers/admin.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const adminRouter = (0, express_1.Router)();
// Auth
adminRouter.post('/register', admin_controller_1.default.register);
adminRouter.post('/login', admin_controller_1.default.login);
// Logs
adminRouter.post('/actions/filter', auth_middleware_1.adminTokenVerification, admin_controller_1.default.getActionsWithFilters);
// Profiles
adminRouter.post('/profiles', auth_middleware_1.adminTokenVerification, admin_controller_1.default.getAllProfilesGrouped);
adminRouter.post('/profiles/update', auth_middleware_1.adminTokenVerification, admin_controller_1.default.updateProfile);
adminRouter.post('/profiles/delete', auth_middleware_1.adminTokenVerification, admin_controller_1.default.deleteProfile);
// Budgets
adminRouter.post('/budgets/profile', auth_middleware_1.adminTokenVerification, admin_controller_1.default.getProfileBudgets);
adminRouter.post('/budgets/delete', auth_middleware_1.adminTokenVerification, admin_controller_1.default.deleteBudget);
// Expenses
adminRouter.post('/expenses', auth_middleware_1.adminTokenVerification, admin_controller_1.default.getProfileExpenses);
exports.default = adminRouter;
//# sourceMappingURL=admin.router.js.map