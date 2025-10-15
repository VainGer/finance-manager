"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppErrors = __importStar(require("../errors/AppError"));
const cookies_1 = require("../utils/cookies");
const JWT_1 = __importDefault(require("../utils/JWT"));
const admin_service_1 = __importDefault(require("../services/admin/admin.service"));
const budget_service_1 = __importDefault(require("../services/budget/budget.service"));
const category_service_1 = __importDefault(require("../services/expenses/category.service"));
class AdminController {
    static async register(req, res) {
        try {
            const { username, password, secret } = req.body;
            const result = await admin_service_1.default.createAdmin(username, password, secret);
            res.status(201).json({ message: result.message });
        }
        catch (error) {
            AdminController.handleError(error, res);
        }
    }
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const result = await admin_service_1.default.validateAdmin(username, password);
            AdminController.setAdminAccessToken(res, username);
            res.status(200).json(result);
        }
        catch (error) {
            AdminController.handleError(error, res);
        }
    }
    static async getActionsWithFilters(req, res) {
        try {
            const adminUsername = req.adminUsername;
            const filters = req.body; // { limit?, start?, end?, executeAccount?, executeProfile?, action?, type? }
            const actions = await admin_service_1.default.getActionsWithFilters(filters, adminUsername);
            AdminController.setAdminAccessToken(res, adminUsername);
            res.status(200).json({ success: true, actions });
        }
        catch (error) {
            AdminController.handleError(error, res);
        }
    }
    static async getAllProfilesGrouped(req, res) {
        try {
            const username = req.adminUsername;
            const groupedProfiles = await admin_service_1.default.getGroupedProfiles(username);
            AdminController.setAdminAccessToken(res, username);
            res.status(200).json({ success: true, groupedProfiles });
        }
        catch (error) {
            AdminController.handleError(error, res);
        }
    }
    static async updateProfile(req, res) {
        try {
            const { username, profileName, updates } = req.body;
            const adminUsername = req.adminUsername;
            await admin_service_1.default.updateProfile(username, profileName, updates, adminUsername);
            AdminController.setAdminAccessToken(res, adminUsername);
            res.status(200).json({ success: true, message: "Profile updated successfully" });
        }
        catch (error) {
            AdminController.handleError(error, res);
        }
    }
    static async deleteProfile(req, res) {
        try {
            const { username, profileName } = req.body;
            const adminUsername = req.adminUsername;
            await admin_service_1.default.deleteProfile(username, profileName, adminUsername);
            AdminController.setAdminAccessToken(res, adminUsername);
            res.status(200).json({ success: true, message: "Profile deleted successfully" });
        }
        catch (error) {
            AdminController.handleError(error, res);
        }
    }
    static async getProfileBudgets(req, res) {
        try {
            const { username, profileName } = req.body;
            const adminUsername = req.adminUsername;
            const budgets = await budget_service_1.default.getBudgets(username, profileName);
            admin_service_1.default.logAction({
                type: "export",
                executeAccount: adminUsername,
                action: "get_profile_budgets",
                target: { username, profileName }
            });
            AdminController.setAdminAccessToken(res, adminUsername);
            res.status(200).json({ success: true, budgets });
        }
        catch (error) {
            AdminController.handleError(error, res);
        }
    }
    static async deleteBudget(req, res) {
        try {
            const { username, profileName, budgetId } = req.body;
            const adminUsername = req.adminUsername;
            const result = await budget_service_1.default.deleteBudgets(username, profileName, budgetId, true);
            admin_service_1.default.logAction({
                type: "delete",
                executeAccount: adminUsername,
                executeProfile: profileName,
                action: "delete_budget",
                target: { username, profileName, budgetId }
            });
            AdminController.setAdminAccessToken(res, adminUsername);
            res.status(200).json({
                success: true,
                message: result.message || "Budget deleted successfully"
            });
        }
        catch (error) {
            AdminController.handleError(error, res);
        }
    }
    static async getProfileExpenses(req, res) {
        try {
            const { refId } = req.body;
            const adminUsername = req.adminUsername;
            const expenses = await category_service_1.default.getProfileExpenses(refId);
            admin_service_1.default.logAction({
                type: "export",
                executeAccount: adminUsername,
                action: "get_profile_expenses",
                target: { refId }
            });
            AdminController.setAdminAccessToken(res, adminUsername);
            res.status(200).json({
                success: true,
                expenses,
                message: "Profile expenses fetched successfully"
            });
        }
        catch (error) {
            AdminController.handleError(error, res);
        }
    }
    static setAdminAccessToken(res, username) {
        const token = JWT_1.default.signAdminAccessToken({ username });
        res.cookie("adminAccessToken", token, (0, cookies_1.cookieOptions)(15 * 60 * 1000));
    }
    static handleError(error, res) {
        console.error("Controller error:", error);
        if (error instanceof AppErrors.AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}
exports.default = AdminController;
//# sourceMappingURL=admin.controller.js.map