import { ObjectId } from "mongodb";
import { Transaction } from "./expenses.types";
import db from "../../server";

export default class TransactionModel {
    private static expenseCollection: string = "expenses";

    static async createTransaction(refId: ObjectId, catName: string, busName: string, transaction: Transaction) {
        try {
            const newTransaction: Transaction = {
                _id: new ObjectId(),
                amount: transaction.amount,
                date: transaction.date,
                description: transaction.description
            };

            const result = await db.UpdateDocument(
                TransactionModel.expenseCollection,
                { _id: refId },
                { $push: { "categories.$[catFilter].Businesses.$[bizFilter].transactions": newTransaction } },
                {
                    arrayFilters: [
                        { "catFilter.name": catName },
                        { "bizFilter.name": busName }
                    ]
                });

            if (!result || result.modifiedCount === 0) {
                return { status: 404, error: "Expense, category, or business not found" };
            } else {
                return {
                    status: 201,
                    message: "Transaction created successfully",
                    transactionId: newTransaction._id
                };
            }
        } catch (error) {
            console.error("Error creating transaction:", error);
            return { status: 500, error: "Internal server error" };
        }
    }

    static async changeTransactionAmount(refId: ObjectId, catName: string, busName: string, transactionId: ObjectId, newAmount: number) {
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

            if (!result || result.matchedCount === 0 || result.modifiedCount === 0) {
                return { status: 404, error: "Expense, category, business, or transaction not found" };
            } else {
                return {
                    status: 200,
                    message: "Transaction amount changed successfully",
                };
            }
        } catch (error) {
            console.error("Error changing transaction amount:", error);
            return { status: 500, error: "Internal server error" };
        }
    }

    static async getTransactionsByBusiness(refId: ObjectId, catName: string, busName: string) {
        try {
            const expensesDoc = await db.GetDocument(
                TransactionModel.expenseCollection,
                { _id: refId },
                { projection: { "categories": 1 } }
            );

            if (!expensesDoc || !expensesDoc.categories) {
                return { status: 404, error: "Expense document not found" };
            }

            // Find the relevant category
            const category = expensesDoc.categories.find((cat: any) => cat.name === catName);
            if (!category) {
                return { status: 404, error: "Category not found" };
            }

            // Find the relevant business
            const business = category.Businesses?.find((bus: any) => bus.name === busName);
            if (!business) {
                return { status: 404, error: "Business not found" };
            }

            return {
                status: 200,
                transactions: business.transactions || []
            };
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return { status: 500, error: "Internal server error" };
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
                return { status: 404, error: "Expense, category, business, or transaction not found" };
            } else {
                return {
                    status: 200,
                    message: "Transaction deleted successfully"
                };
            }
        } catch (error) {
            console.error("Error deleting transaction:", error);
            return { status: 500, error: "Internal server error" };
        }
    }

    static async getTransactionById(refId: ObjectId, catName: string, busName: string, transactionId: ObjectId) {
        try {
            const expensesDoc = await db.GetDocument(
                TransactionModel.expenseCollection,
                { _id: refId },
                { projection: { "categories": 1 } }
            );

            if (!expensesDoc || !expensesDoc.categories) {
                return { status: 404, error: "Expense document not found" };
            }

            // Find the relevant category
            const category = expensesDoc.categories.find((cat: any) => cat.name === catName);
            if (!category) {
                return { status: 404, error: "Category not found" };
            }

            // Find the relevant business
            const business = category.Businesses?.find((bus: any) => bus.name === busName);
            if (!business) {
                return { status: 404, error: "Business not found" };
            }

            // Find the specific transaction
            const transaction = business.transactions?.find(
                (trans: Transaction) => trans._id.toString() === transactionId.toString()
            );

            if (!transaction) {
                return { status: 404, error: "Transaction not found" };
            }

            return {
                status: 200,
                transaction
            };
        } catch (error) {
            console.error("Error fetching transaction:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
}