"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const mongodb_1 = require("mongodb");
class TransactionModel {
    static expenseCollection = "expenses";
    static async createTransaction(refId, catName, busName, transaction) {
        try {
            const result = await server_1.default.UpdateDocument(this.expenseCollection, { _id: new mongodb_1.ObjectId(refId) }, { $push: { "categories.$[catFilter].Businesses.$[bizFilter].transactions": transaction } }, {
                arrayFilters: [
                    { "catFilter.name": catName },
                    { "bizFilter.name": busName }
                ]
            });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to create transaction" };
            }
            return { success: true, message: "Transaction created successfully" };
        }
        catch (error) {
            console.error("Error in TransactionModel.createTransaction", error);
            throw new Error("Failed to create transaction");
        }
    }
    static async changeTransactionAmount(refId, catName, busName, transactionId, newAmount) {
        try {
            const result = await server_1.default.UpdateDocument(this.expenseCollection, { _id: new mongodb_1.ObjectId(refId) }, { $set: { "categories.$[catFilter].Businesses.$[bizFilter].transactions.$[transFilter].amount": newAmount } }, {
                arrayFilters: [
                    { "catFilter.name": catName },
                    { "bizFilter.name": busName },
                    { "transFilter._id": transactionId }
                ]
            });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to change transaction amount" };
            }
            return { success: true, message: "Transaction amount changed successfully" };
        }
        catch (error) {
            console.error("Error in TransactionModel.changeTransactionAmount", error);
            throw new Error("Failed to change transaction amount");
        }
    }
    static async deleteTransaction(refId, catName, busName, transactionId) {
        try {
            const result = await server_1.default.UpdateDocument(this.expenseCollection, { _id: new mongodb_1.ObjectId(refId) }, { $pull: { "categories.$[catFilter].Businesses.$[bizFilter].transactions": { _id: new mongodb_1.ObjectId(transactionId) } } }, {
                arrayFilters: [
                    { "catFilter.name": catName },
                    { "bizFilter.name": busName }
                ]
            });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to delete transaction" };
            }
            return { success: true, message: "Transaction deleted successfully" };
        }
        catch (error) {
            console.error("Error in TransactionModel.deleteTransaction", error);
            throw new Error("Failed to delete transaction");
        }
    }
}
exports.default = TransactionModel;
//# sourceMappingURL=transaction.model.js.map