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
const appErrors = __importStar(require("../../errors/AppError"));
const transaction_model_1 = __importDefault(require("../../models/expenses/transaction.model"));
const mongodb_1 = require("mongodb");
const budget_service_1 = __importDefault(require("../budget/budget.service"));
const categories_model_1 = __importDefault(require("../../models/expenses/categories.model"));
const profile_model_1 = __importDefault(require("../../models/profile/profile.model"));
const admin_service_1 = __importDefault(require("../admin/admin.service"));
class TransactionService {
    static async create(refId, catName, busName, transactionData) {
        if (!refId || !catName || !busName || !transactionData) {
            throw new appErrors.ValidationError("Reference ID, category name, business name and transaction data are required.");
        }
        const categoriesDoc = await categories_model_1.default.getCategories(refId);
        const username = categoriesDoc?.username;
        const profileName = categoriesDoc?.profileName;
        const id = new mongodb_1.ObjectId();
        const transaction = { ...transactionData, _id: id };
        transaction.amount = parseFloat(transaction.amount.toString());
        const result = await transaction_model_1.default.create(refId, catName, busName, transaction);
        if (!result?.success) {
            throw new appErrors.DatabaseError(result?.message || `Failed to create transaction for ${busName}.`);
        }
        const updateBudgetOnTransaction = await this.updateBudgetOnTransaction(refId, catName, busName, id.toString(), transaction.amount, true);
        if (!updateBudgetOnTransaction?.success) {
            throw new appErrors.DatabaseError(updateBudgetOnTransaction?.message || "Failed to update budget on transaction.");
        }
        admin_service_1.default.logAction({
            type: 'create',
            executeAccount: username,
            executeProfile: profileName,
            action: 'create_transaction',
            target: { refId, catName, busName, transaction }
        });
        return result;
    }
    static async changeAmount(refId, catName, busName, transactionId, newAmount) {
        if (!refId || !catName || !busName || !transactionId || newAmount === undefined) {
            throw new appErrors.ValidationError("Reference ID, category name, business name, transaction ID and new amount are required.");
        }
        newAmount = parseFloat(newAmount.toString());
        const txId = typeof transactionId === 'string' ? new mongodb_1.ObjectId(transactionId) : transactionId;
        const categoriesDoc = await categories_model_1.default.getCategories(refId);
        if (!categoriesDoc)
            throw new appErrors.NotFoundError("Categories document not found.");
        const { username, profileName } = categoriesDoc;
        const updatedBudgetResult = await this.updateBudgetOnTransaction(refId, catName, busName, txId.toString(), newAmount);
        if (!updatedBudgetResult?.success) {
            throw new appErrors.DatabaseError(updatedBudgetResult?.message || "Failed to update budget on transaction.");
        }
        const result = await transaction_model_1.default.changeAmount(refId, catName, busName, txId, newAmount);
        if (!result?.success) {
            throw new appErrors.DatabaseError(result?.message || `Failed to change amount for transaction ${txId}.`);
        }
        admin_service_1.default.logAction({
            type: 'update',
            executeAccount: username,
            executeProfile: profileName,
            action: 'change_transaction_amount',
            target: { refId, catName, busName, transactionId, newAmount }
        });
        return result;
    }
    static async changeDate(refId, catName, busName, transactionId, newDate) {
        if (!refId || !catName || !busName || !transactionId || !newDate) {
            throw new appErrors.ValidationError("Reference ID, category name, business name, transaction ID and new date are required.");
        }
        const transaction = await this.getById(refId, catName, busName, transactionId);
        if (!transaction) {
            throw new appErrors.NotFoundError(`Transaction ${transactionId} not found.`);
        }
        const deleteResult = await this.delete(refId, catName, busName, transactionId);
        if (!deleteResult?.success) {
            throw new appErrors.DatabaseError(deleteResult?.message || `Failed to delete transaction ${transactionId} for date change.`);
        }
        const newTransaction = {
            amount: transaction.amount,
            date: newDate,
            description: transaction.description,
        };
        const categoriesDoc = await categories_model_1.default.getCategories(refId);
        if (!categoriesDoc)
            throw new appErrors.NotFoundError("Categories document not found.");
        const { username, profileName } = categoriesDoc;
        const createResult = await this.create(refId, catName, busName, newTransaction);
        if (!createResult?.success) {
            throw new appErrors.DatabaseError(createResult?.message || `Failed to create transaction for ${busName}.`);
        }
        admin_service_1.default.logAction({
            type: 'update',
            executeAccount: username,
            executeProfile: profileName,
            action: 'change_transaction_date',
            target: { refId, catName, busName, transactionId, newDate }
        });
        return { success: true, message: "Transaction date changed successfully" };
    }
    static async changeDescription(refId, catName, busName, transactionId, newDescription) {
        if (!refId || !catName || !busName || !transactionId || !newDescription) {
            throw new appErrors.ValidationError("Reference ID, category name, business name, transaction ID and new description are required.");
        }
        const result = await transaction_model_1.default.changeDescription(refId, catName, busName, transactionId, newDescription);
        if (!result?.success) {
            throw new appErrors.DatabaseError(result?.message || `Failed to change description for transaction ${transactionId}.`);
        }
        const categoriesDoc = await categories_model_1.default.getCategories(refId);
        if (!categoriesDoc)
            throw new appErrors.NotFoundError("Categories document not found.");
        const { username, profileName } = categoriesDoc;
        admin_service_1.default.logAction({
            type: 'update',
            executeAccount: username,
            executeProfile: profileName,
            action: 'change_transaction_description',
            target: { refId, catName, busName, transactionId, newDescription }
        });
        return result;
    }
    static async delete(refId, catName, busName, transactionId) {
        if (!refId || !catName || !busName || !transactionId) {
            throw new appErrors.ValidationError("Reference ID, category name, business name and transaction ID are required.");
        }
        const categoriesDoc = await categories_model_1.default.getCategories(refId);
        if (!categoriesDoc)
            throw new appErrors.NotFoundError("Categories document not found.");
        const { username, profileName } = categoriesDoc;
        const updatedBudgetResult = await this.updateBudgetOnTransaction(refId, catName, busName, transactionId, 0);
        if (!updatedBudgetResult?.success) {
            throw new appErrors.DatabaseError(updatedBudgetResult?.message || "Failed to update budget on transaction deletion.");
        }
        const result = await transaction_model_1.default.delete(refId, catName, busName, transactionId);
        if (!result?.success) {
            throw new appErrors.DatabaseError(result?.message || `Failed to delete transaction ${transactionId}.`);
        }
        admin_service_1.default.logAction({
            type: 'delete',
            executeAccount: username,
            executeProfile: profileName,
            action: 'delete_transaction',
            target: { refId, catName, busName, transactionId }
        });
        return result;
    }
    static async getById(refId, catName, busName, transactionId) {
        if (!refId || !catName || !busName || !transactionId) {
            throw new appErrors.ValidationError("Reference ID, category name, business name and transaction ID are required.");
        }
        const transaction = await transaction_model_1.default.getById(refId, catName, busName, transactionId);
        if (!transaction) {
            throw new appErrors.NotFoundError(`Transaction '${transactionId}' not found.`);
        }
        return transaction;
    }
    static async updateBudgetOnTransaction(refId, catName, busName, transactionId, newAmount, newTransaction = false) {
        if (!refId || !catName || !busName || !transactionId || newAmount === undefined) {
            throw new appErrors.ValidationError("Reference ID, category name, business name, transaction ID and new amount are required.");
        }
        const expenses = await categories_model_1.default.getCategories(refId);
        if (!expenses) {
            throw new appErrors.NotFoundError("Expenses document not found.");
        }
        const { username, profileName } = { username: expenses.username, profileName: expenses.profileName };
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new appErrors.NotFoundError(`Profile '${profileName}' not found.`);
        }
        const transaction = await this.getById(refId, catName, busName, transactionId);
        const budget = profile.budgets.find((b) => {
            const startDate = new Date(b.startDate);
            const endDate = new Date(b.endDate);
            if (startDate <= new Date(transaction.date) && endDate >= new Date(transaction.date)) {
                return b;
            }
        });
        if (!budget) {
            return { success: true, message: "No budget found for this transaction date" };
        }
        const diff = newTransaction ? newAmount : newAmount - transaction.amount;
        const resultProfile = await budget_service_1.default.updateBudgetSpentOnTransaction(username, profileName, budget._id.toString(), diff);
        const resultCategory = await budget_service_1.default.updateCategoryBudgetSpent(refId, catName, budget._id.toString(), diff);
        if (!resultProfile?.success || !resultCategory?.success) {
            throw new appErrors.DatabaseError("Failed to update budget amounts for transaction.");
        }
        return { success: true, message: "Budget updated successfully" };
    }
    static async getAll(refId, catName, busName) {
        if (!refId || !catName || !busName) {
            throw new appErrors.ValidationError("Reference ID, category name, and business name are required.");
        }
        try {
            const transactions = await transaction_model_1.default.getAll(refId, catName, busName);
            return {
                success: true,
                transactions,
                message: "Transactions retrieved successfully"
            };
        }
        catch (error) {
            console.error("Error in TransactionService.getAll", error);
            throw new appErrors.DatabaseError("Failed to retrieve transactions.");
        }
    }
    static async getAllByMonth(refId, catName, busName) {
        if (!refId || !catName || !busName) {
            throw new appErrors.ValidationError("Reference ID, category name, and business name are required.");
        }
        try {
            const monthlyTransactions = await transaction_model_1.default.getAllByMonth(refId, catName, busName);
            return {
                success: true,
                monthlyTransactions,
                message: "Monthly transactions retrieved successfully"
            };
        }
        catch (error) {
            console.error("Error in TransactionService.getAllByMonth", error);
            throw new appErrors.DatabaseError("Failed to retrieve monthly transactions.");
        }
    }
}
exports.default = TransactionService;
//# sourceMappingURL=transaction.service.js.map