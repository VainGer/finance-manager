"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const server_1 = __importDefault(require("../../server"));
class TransactionModel {
    static expenseCollection = "expenses";
    static async createTransaction(refId, catName, busName, transaction) {
        try {
            const newTransaction = {
                _id: new mongodb_1.ObjectId(),
                amount: transaction.amount,
                date: transaction.date,
                description: transaction.description
            };
            const result = await server_1.default.UpdateDocument(TransactionModel.expenseCollection, { _id: refId }, { $push: { "categories.$[catFilter].Businesses.$[bizFilter].transactions": newTransaction } }, {
                arrayFilters: [
                    { "catFilter.name": catName },
                    { "bizFilter.name": busName }
                ]
            });
            if (!result || result.modifiedCount === 0) {
                return { status: 404, error: "Expense, category, or business not found" };
            }
            else {
                return {
                    status: 201,
                    message: "Transaction created successfully",
                    transactionId: newTransaction._id
                };
            }
        }
        catch (error) {
            console.error("Error creating transaction:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
    static async changeTransactionAmount(refId, catName, busName, transactionId, newAmount) {
        try {
            const result = await server_1.default.UpdateDocument(TransactionModel.expenseCollection, { _id: refId }, { $set: { "categories.$[catFilter].Businesses.$[bizFilter].transactions.$[transFilter].amount": newAmount } }, {
                arrayFilters: [
                    { "catFilter.name": catName },
                    { "bizFilter.name": busName },
                    { "transFilter._id": transactionId }
                ]
            });
            if (!result || result.matchedCount === 0 || result.modifiedCount === 0) {
                return { status: 404, error: "Expense, category, business, or transaction not found" };
            }
            else {
                return {
                    status: 200,
                    message: "Transaction amount changed successfully",
                };
            }
        }
        catch (error) {
            console.error("Error changing transaction amount:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
    static async getTransactionsByBusiness(refId, catName, busName) {
        try {
            const expensesDoc = await server_1.default.GetDocument(TransactionModel.expenseCollection, { _id: refId }, { projection: { "categories": 1 } });
            if (!expensesDoc || !expensesDoc.categories) {
                return { status: 404, error: "Expense document not found" };
            }
            // Find the relevant category
            const category = expensesDoc.categories.find((cat) => cat.name === catName);
            if (!category) {
                return { status: 404, error: "Category not found" };
            }
            // Find the relevant business
            const business = category.Businesses?.find((bus) => bus.name === busName);
            if (!business) {
                return { status: 404, error: "Business not found" };
            }
            return {
                status: 200,
                transactions: business.transactions || []
            };
        }
        catch (error) {
            console.error("Error fetching transactions:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
    static async deleteTransaction(refId, catName, busName, transactionId) {
        try {
            const result = await server_1.default.UpdateDocument(TransactionModel.expenseCollection, { _id: refId }, { $pull: { "categories.$[catFilter].Businesses.$[bizFilter].transactions": { _id: transactionId } } }, {
                arrayFilters: [
                    { "catFilter.name": catName },
                    { "bizFilter.name": busName }
                ]
            });
            if (!result || result.modifiedCount === 0) {
                return { status: 404, error: "Expense, category, business, or transaction not found" };
            }
            else {
                return {
                    status: 200,
                    message: "Transaction deleted successfully"
                };
            }
        }
        catch (error) {
            console.error("Error deleting transaction:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
    static async getTransactionById(refId, catName, busName, transactionId) {
        try {
            const expensesDoc = await server_1.default.GetDocument(TransactionModel.expenseCollection, { _id: refId }, { projection: { "categories": 1 } });
            if (!expensesDoc || !expensesDoc.categories) {
                return { status: 404, error: "Expense document not found" };
            }
            // Find the relevant category
            const category = expensesDoc.categories.find((cat) => cat.name === catName);
            if (!category) {
                return { status: 404, error: "Category not found" };
            }
            // Find the relevant business
            const business = category.Businesses?.find((bus) => bus.name === busName);
            if (!business) {
                return { status: 404, error: "Business not found" };
            }
            // Find the specific transaction
            const transaction = business.transactions?.find((trans) => trans._id.toString() === transactionId.toString());
            if (!transaction) {
                return { status: 404, error: "Transaction not found" };
            }
            return {
                status: 200,
                transaction
            };
        }
        catch (error) {
            console.error("Error fetching transaction:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
}
exports.default = TransactionModel;
//# sourceMappingURL=transaction.model.js.map