import db from "../../server";
import { ObjectId } from "mongodb";
import { MonthlyTransactions, Transaction, TransactionWithoutId } from "../../types/expenses.types";
import { formatDateYM } from "../../utils/date.utils";

export default class TransactionModel {
    private static expenseCollection: string = "expenses";

    static async create(refId: string, catName: string, busName: string, transaction: Transaction) {
        try {
            const dateYM = formatDateYM(transaction.date);
            const existingMonth = await this.findMonthlyTransactionsByDateYM(
                refId, catName, busName, dateYM);
            
            if (existingMonth) {
                const result = await db.UpdateDocument(
                    this.expenseCollection,
                    { _id: new ObjectId(refId) },
                    { 
                        $push: { 
                            "categories.$[catFilter].Businesses.$[bizFilter].transactionsArray.$[dateFilter].transactions": transaction 
                        }
                    },
                    {
                        arrayFilters: [
                            { "catFilter.name": catName },
                            { "bizFilter.name": busName },
                            { "dateFilter.dateYM": dateYM }
                        ]
                    }
                );
                
                if (!result || result.modifiedCount === 0) {
                    return { success: false, message: "Failed to create transaction" };
                }
                return { success: true, message: "Transaction created successfully" };
            } else {
                const newMonthlyTransactions: MonthlyTransactions = {
                    dateYM,
                    transactions: [transaction]
                };
                
                const result = await db.UpdateDocument(
                    this.expenseCollection,
                    { _id: new ObjectId(refId) },
                    { 
                        $push: { 
                            "categories.$[catFilter].Businesses.$[bizFilter].transactionsArray": newMonthlyTransactions 
                        }
                    },
                    {
                        arrayFilters: [
                            { "catFilter.name": catName },
                            { "bizFilter.name": busName }
                        ]
                    }
                );
                
                if (!result || result.modifiedCount === 0) {
                    return { success: false, message: "Failed to create transaction" };
                }
                return { success: true, message: "Transaction created successfully with new month grouping" };
            }
        } catch (error) {
            console.error("Error in TransactionModel.create", error);
            throw new Error("Failed to create transaction");
        }
    }

    static async changeAmount
        (refId: string, catName: string, busName: string, transactionId: ObjectId | string, newAmount: number) {
        try {
            const txId = typeof transactionId === 'string' ? new ObjectId(transactionId) : transactionId;
            
            const result = await db.UpdateDocument(
                this.expenseCollection,
                { _id: new ObjectId(refId) },
                { 
                    $set: { 
                        "categories.$[catFilter].Businesses.$[bizFilter].transactionsArray.$[].transactions.$[transFilter].amount": newAmount 
                    }
                },
                {
                    arrayFilters: [
                        { "catFilter.name": catName },
                        { "bizFilter.name": busName },
                        { "transFilter._id": txId }
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
                { 
                    $set: { 
                        "categories.$[catFilter].Businesses.$[bizFilter].transactionsArray.$[].transactions.$[transFilter].description": newDescription 
                    }
                },
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
            const transaction = await this.getById(refId, catName, busName, transactionId);
            if (!transaction) {
                return { success: false, message: "Transaction not found" };
            }
            
            const dateYM = formatDateYM(transaction.date);
            const result = await db.UpdateDocument(
                this.expenseCollection,
                { _id: new ObjectId(refId) },
                { 
                    $pull: { 
                        "categories.$[catFilter].Businesses.$[bizFilter].transactionsArray.$[dateFilter].transactions": { 
                            _id: new ObjectId(transactionId) 
                        } 
                    }
                },
                {
                    arrayFilters: [
                        { "catFilter.name": catName },
                        { "bizFilter.name": busName },
                        { "dateFilter.dateYM": dateYM }
                    ]
                });
                
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to delete transaction" };
            }
            
            const monthlyTransactions = await this.findMonthlyTransactionsByDateYM(
                refId, catName, busName, dateYM);
            
            if (monthlyTransactions && monthlyTransactions.transactions.length === 0) {
                await db.UpdateDocument(
                    this.expenseCollection,
                    { _id: new ObjectId(refId) },
                    {
                        $pull: {
                            "categories.$[catFilter].Businesses.$[bizFilter].transactionsArray": {
                                dateYM: dateYM
                            }
                        }
                    },
                    {
                        arrayFilters: [
                            { "catFilter.name": catName },
                            { "bizFilter.name": busName }
                        ]
                    }
                );
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
                { $unwind: "$categories.Businesses.transactionsArray" },
                { $unwind: "$categories.Businesses.transactionsArray.transactions" },
                { $match: { "categories.Businesses.transactionsArray.transactions._id": new ObjectId(transactionId) } },
                { $replaceRoot: { newRoot: "$categories.Businesses.transactionsArray.transactions" } }
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
    
    static async findMonthlyTransactionsByDateYM(refId: string, catName: string, busName: string, dateYM: string) {
        try {
            const pipeline = [
                { $match: { _id: new ObjectId(refId) } },
                { $unwind: "$categories" },
                { $match: { "categories.name": catName } },
                { $unwind: "$categories.Businesses" },
                { $match: { "categories.Businesses.name": busName } },
                { $unwind: "$categories.Businesses.transactionsArray" },
                { $match: { "categories.Businesses.transactionsArray.dateYM": dateYM } },
                { $replaceRoot: { newRoot: "$categories.Businesses.transactionsArray" } }
            ];
            const results = await db.Aggregate(this.expenseCollection, pipeline);
            if (!results || results.length === 0) {
                return null;
            }
            return results[0];
        } catch (error) {
            console.error("Error in TransactionModel.findMonthlyTransactionsByDateYM", error);
            throw new Error("Failed to find transaction array by date");
        }
    }
    
    static async getAll(refId: string, catName: string, busName: string) {
        try {
            const pipeline = [
                { $match: { _id: new ObjectId(refId) } },
                { $unwind: "$categories" },
                { $match: { "categories.name": catName } },
                { $unwind: "$categories.Businesses" },
                { $match: { "categories.Businesses.name": busName } },
                { $project: {
                    transactionsArray: "$categories.Businesses.transactionsArray",
                    _id: 0
                }}
            ];
            const results = await db.Aggregate(this.expenseCollection, pipeline);
            if (!results || results.length === 0) {
                return [];
            }
            let allTransactions: Transaction[] = [];
            const monthlyArrays = results[0].transactionsArray || [];
            
            monthlyArrays.forEach((monthlyTx: MonthlyTransactions) => {
                if (monthlyTx.transactions && monthlyTx.transactions.length > 0) {
                    allTransactions = allTransactions.concat(monthlyTx.transactions);
                }
            });
            
            return allTransactions;
        } catch (error) {
            console.error("Error in TransactionModel.getAll", error);
            throw new Error("Failed to get all transactions");
        }
    }
    
    static async getAllByMonth(refId: string, catName: string, busName: string) {
        try {
            const pipeline = [
                { $match: { _id: new ObjectId(refId) } },
                { $unwind: "$categories" },
                { $match: { "categories.name": catName } },
                { $unwind: "$categories.Businesses" },
                { $match: { "categories.Businesses.name": busName } },
                { $project: {
                    transactionsArray: "$categories.Businesses.transactionsArray",
                    _id: 0
                }}
            ];
            const results = await db.Aggregate(this.expenseCollection, pipeline);
            if (!results || results.length === 0) {
                return [];
            }
            return results[0].transactionsArray || [];
        } catch (error) {
            console.error("Error in TransactionModel.getAllByMonth", error);
            throw new Error("Failed to get transactions grouped by month");
        }
    }
}