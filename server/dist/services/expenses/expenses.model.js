"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const mongodb_1 = require("mongodb");
const categories_model_1 = __importDefault(require("./categories.model"));
const business_model_1 = __importDefault(require("./business.model"));
const transaction_model_1 = __importDefault(require("./transaction.model"));
class ExpensesModel {
    static expenseCollection = "expenses";
    //categories
    static async createCategory(req, res) {
        const { refId, name } = req.body;
        if (!name || !refId) {
            res.status(400).json({ error: "Name and refId are required" });
            return;
        }
        const result = await categories_model_1.default.createCategory(new mongodb_1.ObjectId(refId), name);
        res.status(result.status).json(result);
    }
    static async createBudget(req, res) {
        const { refId, catName, budget } = req.body;
        if (!budget || !catName || !refId) {
            res.status(400).json({ error: "Budget, category name, and expenses id are required" });
            return;
        }
        const result = await categories_model_1.default.createBudget(new mongodb_1.ObjectId(refId), catName, budget);
        res.status(result.status).json(result);
    }
    static async getCategoriesNames(req, res) {
        const { refId } = req.params;
        if (!refId) {
            res.status(400).json({ error: "RefId is required" });
            return;
        }
        const result = await categories_model_1.default.getCategoriesNames(new mongodb_1.ObjectId(refId));
        res.status(result.status).json(result);
    }
    static async renameCategory(req, res) {
        const { refId, oldName, newName } = req.body;
        if (!oldName || !newName || !refId) {
            res.status(400).json({ error: "Old name, new name, and refId are required" });
            return;
        }
        const result = await categories_model_1.default.renameCategory(new mongodb_1.ObjectId(refId), oldName, newName);
        res.status(result.status).json(result);
    }
    static async deleteCategory(req, res) {
        const { refId, catName } = req.body;
        if (!catName || !refId) {
            res.status(400).json({ error: "Category name and refId are required" });
            return;
        }
        const result = await categories_model_1.default.deleteCategory(new mongodb_1.ObjectId(refId), catName);
        res.status(result.status).json(result);
    }
    //businesses
    static async addBusinessToCategory(req, res) {
        const { refId, catName, name } = req.body;
        if (!name || !catName || !refId) {
            res.status(400).json({ error: "Business name, category name, and refId are required" });
            return;
        }
        const result = await business_model_1.default.addBusinessToCategory(new mongodb_1.ObjectId(refId), catName, name);
        res.status(result.status).json(result);
    }
    static async renameBusiness(req, res) {
        const { refId, catName, oldName, newName } = req.body;
        if (!oldName || !newName || !catName || !refId) {
            res.status(400).json({ error: "Old name, new name, category name, and refId are required" });
            return;
        }
        const result = await business_model_1.default.renameBusiness(new mongodb_1.ObjectId(refId), catName, oldName, newName);
        res.status(result.status).json(result);
    }
    static async getBusinessNamesByCategory(req, res) {
        const { refId, catName } = req.params;
        if (!refId || !catName) {
            res.status(400).json({ error: "RefId and category name are required" });
            return;
        }
        const result = await business_model_1.default.getBusinessNamesByCategory(new mongodb_1.ObjectId(refId), catName);
        res.status(result.status).json(result);
    }
    static async deleteBusiness(req, res) {
        const { refId, catName, busName } = req.body;
        if (!busName || !catName || !refId) {
            res.status(400).json({ error: "Business name, category name, and refId are required" });
            return;
        }
        const result = await business_model_1.default.deleteBusiness(new mongodb_1.ObjectId(refId), catName, busName);
        res.status(result.status).json(result);
    }
    // Transaction methods
    static async createTransaction(req, res) {
        const { refId, catName, busName, transaction } = req.body;
        if (!transaction || !catName || !busName || !refId) {
            res.status(400).json({ error: "Transaction, category, business name, and expenses id are required" });
            return;
        }
        const result = await transaction_model_1.default.createTransaction(new mongodb_1.ObjectId(refId), catName, busName, transaction);
        res.status(result.status).json(result);
    }
    static async changeTransactionAmount(req, res) {
        const { refId, catName, busName, transactionId, newAmount } = req.body;
        if (!refId || !catName || !busName || !transactionId || newAmount === undefined) {
            res.status(400).json({ error: "Expenses ID, category name, business name, transaction ID, and new amount are required" });
            return;
        }
        const result = await transaction_model_1.default.changeTransactionAmount(new mongodb_1.ObjectId(refId), catName, busName, new mongodb_1.ObjectId(transactionId), newAmount);
        res.status(result.status).json(result);
    }
    static async getTransactionsByBusiness(req, res) {
        const { refId, catName, busName } = req.params;
        if (!refId || !catName || !busName) {
            res.status(400).json({ error: "RefId, category name, and business name are required" });
            return;
        }
        const result = await transaction_model_1.default.getTransactionsByBusiness(new mongodb_1.ObjectId(refId), catName, busName);
        res.status(result.status).json(result);
    }
    static async deleteTransaction(req, res) {
        const { refId, catName, busName, transactionId } = req.body;
        if (!refId || !catName || !busName || !transactionId) {
            res.status(400).json({ error: "Expenses ID, category name, business name, and transaction ID are required" });
            return;
        }
        const result = await transaction_model_1.default.deleteTransaction(new mongodb_1.ObjectId(refId), catName, busName, new mongodb_1.ObjectId(transactionId));
        res.status(result.status).json(result);
    }
    static async getTransactionById(req, res) {
        const { refId, catName, busName, transactionId } = req.params;
        if (!refId || !catName || !busName || !transactionId) {
            res.status(400).json({ error: "RefId, category name, business name, and transaction ID are required" });
            return;
        }
        const result = await transaction_model_1.default.getTransactionById(new mongodb_1.ObjectId(refId), catName, busName, new mongodb_1.ObjectId(transactionId));
        res.status(result.status).json(result);
    }
    // Data Retrieval method
    static async getProfileExpenses(req, res) {
        const { refId } = req.params;
        if (!refId) {
            res.status(400).json({ error: "RefId is required" });
            return;
        }
        try {
            const rawExpenses = await server_1.default.GetDocument(ExpensesModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId) });
            if (!rawExpenses) {
                res.status(404).json({ error: "Expenses not found", status: 404 });
                return;
            }
            const expenses = rawExpenses.categories;
            res.status(200).json({
                expenses,
                status: 200
            });
        }
        catch (error) {
            console.error("Error fetching expenses:", error);
            res.status(500).json({ error: "Internal server error", status: 500 });
        }
    }
}
exports.default = ExpensesModel;
//# sourceMappingURL=expenses.model.js.map