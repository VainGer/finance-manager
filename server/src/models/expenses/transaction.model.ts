import db from "../../server";
import { ObjectId } from "mongodb";
import { Transaction, TransactionWithoutId } from "../../types/expenses.types";


export default class TransactionModel {
    private static expenseCollection: string = "expenses";

    static async create(refId: string, catName: string, busName: string, transaction: Transaction) {
        try {
            const result = await db.UpdateDocument(
                this.expenseCollection,
                { _id: new ObjectId(refId) },
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
            console.error("Error in TransactionModel.create", error);
            throw new Error("Failed to create transaction");
        }
    }

    static async changeAmount
        (refId: string, catName: string, busName: string, transactionId: ObjectId, newAmount: number) {
        try {
            const result = await db.UpdateDocument(
                this.expenseCollection,
                { _id: new ObjectId(refId) },
                { $set: { "categories.$[catFilter].Businesses.$[bizFilter].transactions.$[transFilter].amount": newAmount } },
                {
                    arrayFilters: [
                        { "catFilter.name": catName },
                        { "bizFilter.name": busName },
                        { "transFilter._id": new ObjectId(transactionId) }
                    ]
                });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to change transaction amount" };
            }
            return { success: true, message: "Transaction amount changed successfully" };
        } catch (error) {
            console.error("Error in TransactionModel.changeAmount", error);
            throw new Error("Failed to change transaction amount");
        }
    }

    static async changeDescription(refId: string, catName: string, busName: string, transactionId: string, newDescription: string) {
        try {
            const result = await db.UpdateDocument(
                this.expenseCollection,
                { _id: new ObjectId(refId) },
                { $set: { "categories.$[catFilter].Businesses.$[bizFilter].transactions.$[transFilter].description": newDescription } },
                {
                    arrayFilters: [
                        { "catFilter.name": catName },
                        { "bizFilter.name": busName },
                        { "transFilter._id": new ObjectId(transactionId) }
                    ]
                });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to change transaction description" };
            }
            return { success: true, message: "Transaction description changed successfully" };
        } catch (error) {
            console.error("Error in TransactionModel.changeDescription", error);
            throw new Error("Failed to change transaction description");
        }
    }

    static async delete(refId: string, catName: string, busName: string, transactionId: string) {
        try {
            const result = await db.UpdateDocument(
                this.expenseCollection,
                { _id: new ObjectId(refId) },
                { $pull: { "categories.$[catFilter].Businesses.$[bizFilter].transactions": { _id: new ObjectId(transactionId) } } },
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
            console.error("Error in TransactionModel.delete", error);
            throw new Error("Failed to delete transaction");
        }
    }

    static async getById(refId: string, catName: string, busName: string, transactionId: string) {
        try {
            const pipeline = [
                { $match: { _id: new ObjectId(refId) } },
                { $unwind: "$categories" },
                { $match: { "categories.name": catName } },
                { $unwind: "$categories.Businesses" },
                { $match: { "categories.Businesses.name": busName } },
                { $unwind: "$categories.Businesses.transactions" },
                { $match: { "categories.Businesses.transactions._id": new ObjectId(transactionId) } },
                { $replaceRoot: { newRoot: "$categories.Businesses.transactions" } }
            ];
            const results = await db.Aggregate(this.expenseCollection, pipeline);     
            if (!results || results.length === 0) {
                return null;
            }
            return results[0];
        } catch (error) {
            console.error("Error in TransactionModel.getById", error);
            throw new Error("Failed to get transaction");
        }
    }
}