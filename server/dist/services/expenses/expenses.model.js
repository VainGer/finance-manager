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
function validateRequiredFields(res, fields) {
    const missingFields = Object.entries(fields)
        .filter(([key, value]) => value === undefined || value === null || value === '')
        .map(([key, value]) => key);
    if (missingFields.length > 0) {
        res.status(400).json({
            message: `${missingFields.join(', ')} ${missingFields.length === 1 ? 'is' : 'are'} required`
        });
        return true;
    }
    return false;
}
function formatResponse(res, result, dataField, statusCode = 200) {
    const response = {
        message: result.message || result.error
    };
    if (dataField && result[dataField] !== undefined) {
        response[dataField] = result[dataField];
    }
    res.status(statusCode).json(response);
}
class ExpensesModel {
    static expenseCollection = "expenses";
    //categories
    static async createCategory(req, res) {
        const { refId, name } = req.body;
        if (validateRequiredFields(res, { refId, name })) {
            return;
        }
        const { status, ...responseData } = await categories_model_1.default.createCategory(new mongodb_1.ObjectId(refId), name);
        formatResponse(res, responseData, undefined, status);
    }
    static async getCategoriesNames(req, res) {
        const { refId } = req.params;
        if (validateRequiredFields(res, { refId })) {
            return;
        }
        const { status, ...responseData } = await categories_model_1.default.getCategoriesNames(new mongodb_1.ObjectId(refId));
        formatResponse(res, responseData, 'categoriesNames', status);
    }
    static async renameCategory(req, res) {
        const { refId, oldName, newName } = req.body;
        if (validateRequiredFields(res, { refId, oldName, newName })) {
            return;
        }
        const { status, ...responseData } = await categories_model_1.default.renameCategory(new mongodb_1.ObjectId(refId), oldName, newName);
        formatResponse(res, responseData, undefined, status);
    }
    static async deleteCategory(req, res) {
        const { refId, catName } = req.query;
        if (validateRequiredFields(res, { refId, catName })) {
            return;
        }
        const { status, ...responseData } = await categories_model_1.default.deleteCategory(new mongodb_1.ObjectId(refId), catName);
        formatResponse(res, responseData, undefined, status);
    }
    //businesses
    static async addBusinessToCategory(req, res) {
        const { refId, catName, name } = req.body;
        if (validateRequiredFields(res, { refId, catName, name })) {
            return;
        }
        const { status, ...responseData } = await business_model_1.default.addBusinessToCategory(new mongodb_1.ObjectId(refId), catName, name);
        formatResponse(res, responseData, undefined, status);
    }
    static async renameBusiness(req, res) {
        const { refId, catName, oldName, newName } = req.body;
        if (validateRequiredFields(res, { refId, catName, oldName, newName })) {
            return;
        }
        const { status, ...responseData } = await business_model_1.default.renameBusiness(new mongodb_1.ObjectId(refId), catName, oldName, newName);
        formatResponse(res, responseData, undefined, status);
    }
    static async getBusinessNamesByCategory(req, res) {
        const { refId, catName } = req.params;
        if (validateRequiredFields(res, { refId, catName })) {
            return;
        }
        const { status, ...responseData } = await business_model_1.default.getBusinessNamesByCategory(new mongodb_1.ObjectId(refId), catName);
        formatResponse(res, responseData, 'businessNames', status);
    }
    static async deleteBusiness(req, res) {
        const { refId, catName, busName } = req.query;
        if (validateRequiredFields(res, { refId, catName, busName })) {
            return;
        }
        const { status, ...responseData } = await business_model_1.default.deleteBusiness(new mongodb_1.ObjectId(refId), catName, busName);
        formatResponse(res, responseData, undefined, status);
    }
    // Transaction methods
    static async createTransaction(req, res) {
        const { refId, catName, busName, transaction } = req.body;
        if (validateRequiredFields(res, { refId, catName, busName, transaction })) {
            return;
        }
        const { status, ...responseData } = await transaction_model_1.default.createTransaction(new mongodb_1.ObjectId(refId), catName, busName, transaction);
        formatResponse(res, responseData, undefined, status);
    }
    static async changeTransactionAmount(req, res) {
        const { refId, catName, busName, transactionId, newAmount } = req.body;
        if (validateRequiredFields(res, { refId, catName, busName, transactionId, newAmount })) {
            return;
        }
        const { status, ...responseData } = await transaction_model_1.default.changeTransactionAmount(new mongodb_1.ObjectId(refId), catName, busName, new mongodb_1.ObjectId(transactionId), newAmount);
        formatResponse(res, responseData, undefined, status);
    }
    static async getTransactionsByBusiness(req, res) {
        const { refId, catName, busName } = req.params;
        if (!refId || !catName || !busName) {
            res.status(400).json({ message: "RefId, category name, and business name are required" });
            return;
        }
        const { status, ...responseData } = await transaction_model_1.default.getTransactionsByBusiness(new mongodb_1.ObjectId(refId), catName, busName);
        formatResponse(res, responseData, 'transactions', status);
    }
    static async deleteTransaction(req, res) {
        const { refId, catName, busName, transactionId } = req.query;
        if (validateRequiredFields(res, { refId, catName, busName, transactionId })) {
            return;
        }
        const { status, ...responseData } = await transaction_model_1.default.deleteTransaction(new mongodb_1.ObjectId(refId), catName, busName, new mongodb_1.ObjectId(transactionId));
        formatResponse(res, responseData, undefined, status);
    }
    static async getTransactionById(req, res) {
        const { refId, catName, busName, transactionId } = req.params;
        if (validateRequiredFields(res, { refId, catName, busName, transactionId })) {
            return;
        }
        const { status, ...responseData } = await transaction_model_1.default.getTransactionById(new mongodb_1.ObjectId(refId), catName, busName, new mongodb_1.ObjectId(transactionId));
        formatResponse(res, responseData, 'transaction', status);
    }
    // Data Retrieval method
    static async getProfileExpenses(req, res) {
        const { refId } = req.params;
        if (validateRequiredFields(res, { refId })) {
            return;
        }
        try {
            const rawExpenses = await server_1.default.GetDocument(ExpensesModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId) });
            if (!rawExpenses) {
                formatResponse(res, { message: "Expenses not found" }, undefined, 404);
                return;
            }
            const expenses = rawExpenses.categories;
            formatResponse(res, {
                message: "Expenses retrieved successfully",
                expenses
            }, undefined, 200);
        }
        catch (error) {
            console.error("Error fetching expenses:", error);
            formatResponse(res, { message: "Internal server error" }, undefined, 500);
        }
    }
}
exports.default = ExpensesModel;
//# sourceMappingURL=expenses.model.js.map