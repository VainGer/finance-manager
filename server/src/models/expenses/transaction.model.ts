import db from "../../server";
import { ObjectId } from "mongodb";
import { Transaction, TransactionWithoutId } from "../../types/expenses.types";


export default class TransactionModel {
    private static expenseCollection: string = "expenses";

    static async createTransaction(refId: ObjectId, catName: string, busName: string, transaction: Transaction) {
        try {
            const result = await db.UpdateDocument(
                TransactionModel.expenseCollection,
                { _id: refId },
                { $push: { "categories.$[catFilter].Businesses.$[bizFilter].transactions": transaction } },
                {
                    arrayFilters: [
                        { "catFilter.name": catName },
                        { "bizFilter.name": busName }
                    ]
                });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to create transaction" };
            }
            return { success: true, message: "Transaction created successfully" };
        } catch (error) {
            console.error("Error in TransactionModel.createTransaction", error);
            throw new Error("Failed to create transaction");
        }
    }

    static async changeTransactionAmount
        (refId: ObjectId, catName: string, busName: string, transactionId: ObjectId, newAmount: number) {
        try {
            const result = await db.UpdateDocument(
                TransactionModel.expenseCollection,
                { _id: refId },
                { $set: { "categories.$[catFilter].Businesses.$[bizFilter].transactions.$[transFilter].amount": newAmount } },
                {
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
        } catch (error) {
            console.error("Error in TransactionModel.changeTransactionAmount", error);
            throw new Error("Failed to change transaction amount");
        }
    }

    static async deleteTransaction(refId: ObjectId, catName: string, busName: string, transactionId: ObjectId) {
        try {
            const result = await db.UpdateDocument(
                TransactionModel.expenseCollection,
                { _id: refId },
                { $pull: { "categories.$[catFilter].Businesses.$[bizFilter].transactions": { _id: transactionId } } },
                {
                    arrayFilters: [
                        { "catFilter.name": catName },
                        { "bizFilter.name": busName }
                    ]
                });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to delete transaction" };
            }
            return { success: true, message: "Transaction deleted successfully" };
        } catch (error) {
            console.error("Error in TransactionModel.deleteTransaction", error);
            throw new Error("Failed to delete transaction");
        }
    }

}