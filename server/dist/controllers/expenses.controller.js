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
const appErrors = __importStar(require("../errors/AppError"));
const category_service_1 = __importDefault(require("../services/expenses/category.service"));
const business_service_1 = __importDefault(require("../services/expenses/business.service"));
const transaction_service_1 = __importDefault(require("../services/expenses/transaction.service"));
class ExpensesController {
    //categories
    static async createCategory(req, res) {
        try {
            const { refId, name } = req.body;
            const result = await category_service_1.default.createCategory(refId, name);
            res.status(201).json({
                message: result.message,
            });
        }
        catch (error) {
            ExpensesController.handleError(error, res);
        }
    }
    static async getCategoriesNames(req, res) {
        try {
            const { refId } = req.params;
            const categories = await category_service_1.default.getCategoriesNames(refId);
            res.status(200).json(categories);
        }
        catch (error) {
            ExpensesController.handleError(error, res);
        }
    }
    static async renameCategory(req, res) {
        try {
            const { refId, oldName, newName } = req.body;
            const result = await category_service_1.default.renameCategory(refId, oldName, newName);
            res.status(200).json({ message: result.message });
        }
        catch (error) {
            ExpensesController.handleError(error, res);
        }
    }
    static async deleteCategory(req, res) {
        try {
            const { refId, catName } = req.params;
            const result = await category_service_1.default.deleteCategory(refId, catName);
            res.status(200).json({ message: result.message });
        }
        catch (error) {
            ExpensesController.handleError(error, res);
        }
    }
    static async createCategoryBudget(req, res) {
        try {
            const { refId, catName, budget } = req.body;
            const result = await category_service_1.default.createCategoryBudget(refId, budget, catName);
            res.status(201).json({ message: result.message });
        }
        catch (error) {
            ExpensesController.handleError(error, res);
        }
    }
    //business
    static async addBusinessToCategory(req, res) {
        try {
            const { refId, catName, name } = req.body;
            const result = await business_service_1.default.createBusiness(refId, catName, name);
            res.status(201).json({ message: result.message });
        }
        catch (error) {
            ExpensesController.handleError(error, res);
        }
    }
    static async renameBusiness(req, res) {
        try {
            const { refId, catName, oldName, newName } = req.body;
            const result = await business_service_1.default.renameBusiness(refId, catName, oldName, newName);
            res.status(200).json({ message: result.message });
        }
        catch (error) {
            ExpensesController.handleError(error, res);
        }
    }
    static async getBusinessNamesByCategory(req, res) {
        try {
            const { refId, catName } = req.params;
            const businesses = await business_service_1.default.getBusinessNamesByCategory(refId, catName);
            res.status(200).json({ businesses, message: "Businesses fetched successfully" });
        }
        catch (error) {
            ExpensesController.handleError(error, res);
        }
    }
    static async deleteBusiness(req, res) {
        try {
            const { refId, catName, busName } = req.params;
            const result = await business_service_1.default.deleteBusiness(refId, catName, busName);
            res.status(200).json({ message: result.message });
        }
        catch (error) {
            ExpensesController.handleError(error, res);
        }
    }
    //transactions
    static async createTransaction(req, res) {
        try {
            const { refId, catName, busName, transaction } = req.body;
            const result = await transaction_service_1.default.createTransaction(refId, catName, busName, transaction);
            res.status(201).json({ message: result.message });
        }
        catch (error) {
            ExpensesController.handleError(error, res);
        }
    }
    static async changeTransactionAmount(req, res) {
        try {
            const { refId, catName, busName, transactionId, newAmount } = req.body;
            const result = await transaction_service_1.default.changeTransactionAmount(refId, catName, busName, transactionId, newAmount);
            res.status(200).json({ message: result.message });
        }
        catch (error) {
            ExpensesController.handleError(error, res);
        }
    }
    static async getTransactionById(req, res) {
        try {
            const { refId, catName, busName, transactionId } = req.params;
            const transaction = await transaction_service_1.default.getTransactionById(refId, catName, busName, transactionId);
            res.status(200).json({ transaction, message: "Transaction fetched successfully" });
        }
        catch (error) {
            ExpensesController.handleError(error, res);
        }
    }
    static async deleteTransaction(req, res) {
        try {
            const { refId, catName, busName, transactionId } = req.params;
            const result = await transaction_service_1.default.deleteTransaction(refId, catName, busName, transactionId);
            res.status(200).json({ message: result.message });
        }
        catch (error) {
            ExpensesController.handleError(error, res);
        }
    }
    static async getProfileExpenses(req, res) {
        try {
            const { refId } = req.params;
            const expenses = await category_service_1.default.getProfileExpenses(refId);
            res.status(200).json({ expenses, message: "Profile expenses fetched successfully" });
        }
        catch (error) {
            this.handleError(error, res);
        }
    }
    //private methods
    static handleError(error, res) {
        if (error instanceof appErrors.AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
exports.default = ExpensesController;
//# sourceMappingURL=expenses.controller.js.map