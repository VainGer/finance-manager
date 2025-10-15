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
const budget_service_1 = __importDefault(require("../services/budget/budget.service"));
class BudgetController {
    static async addChildBudgets(req, res) {
        try {
            const { username, profileName, budget } = req.body;
            const result = await budget_service_1.default.addChildBudgets(username, profileName, budget);
            res.status(200).json({
                message: result.message || "Child budget added successfully"
            });
        }
        catch (error) {
            BudgetController.handleError(error, res);
        }
    }
    static async getChildBudgets(req, res) {
        try {
            const { username, profileName } = req.query;
            const result = await budget_service_1.default.getChildBudgets(username, profileName);
            res.status(200).json({
                message: "Child budgets retrieved successfully",
                budgets: result.budgets || []
            });
        }
        catch (error) {
            BudgetController.handleError(error, res);
        }
    }
    static async createBudget(req, res) {
        try {
            const { budgetData } = req.body;
            const result = await budget_service_1.default.createBudget(budgetData);
            res.status(201).json({
                message: result.message || "Budget created successfully"
            });
        }
        catch (error) {
            BudgetController.handleError(error, res);
        }
    }
    static async getProfileBudgets(req, res) {
        try {
            const { username, profileName } = req.query;
            const budgetsRes = await budget_service_1.default.getBudgets(username, profileName);
            const profileBudgets = budgetsRes.budgets.profile;
            const categoryBudgets = budgetsRes.budgets.categories;
            res.status(200).json({
                message: "Budgets retrieved successfully",
                profileBudgets,
                categoryBudgets
            });
        }
        catch (error) {
            BudgetController.handleError(error, res);
        }
    }
    static async getCategoryBudgets(req, res) {
        try {
            const { refId } = req.query;
            const result = await budget_service_1.default.getCategoriesBudgets(refId);
            res.status(200).json({
                message: "Category budgets retrieved successfully",
                budgets: result.categoriesBudgets || []
            });
        }
        catch (error) {
            BudgetController.handleError(error, res);
        }
    }
    static async validateBudgetDates(req, res) {
        try {
            const { username, profileName, startDate, endDate } = req.body;
            const isValid = await budget_service_1.default.validateBudgetDates(username, profileName, startDate, endDate);
            res.status(200).json({
                message: "Dates validated successfully",
                isValid: isValid.success
            });
        }
        catch (error) {
            BudgetController.handleError(error, res);
        }
    }
    static async deleteBudget(req, res) {
        try {
            const { username, profileName, budgetId } = req.params;
            const result = await budget_service_1.default.deleteBudgets(username, profileName, budgetId);
            res.status(200).json({
                message: result.message || "Budget deleted successfully"
            });
        }
        catch (error) {
            BudgetController.handleError(error, res);
        }
    }
    static handleError(error, res) {
        console.error("Controller error:", error);
        if (error instanceof AppErrors.AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}
exports.default = BudgetController;
//# sourceMappingURL=budget.controller.js.map