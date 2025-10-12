import db from "../../server";
import { ObjectId } from "mongodb";
import { MonthlyTransactions, Transaction, GroupedTransactions, CategoryForAI } from "../../types/expenses.types";
import { formatDateYM } from "../../utils/date.utils";

export default class TransactionModel {
    private static profileCollection: string = "profiles";
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
                return { success: true, message: "Transaction created successfully" };
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

    static async getTransactionsInDateRange(refId: string, startDate: string, endDate: string) {
        try {
            const pipeline = [
                { $match: { _id: new ObjectId(refId) } },
                { $unwind: "$categories" },
                { $unwind: "$categories.Businesses" },
                { $unwind: "$categories.Businesses.transactionsArray" },
                { $unwind: "$categories.Businesses.transactionsArray.transactions" },

                {
                    $match: {
                        "categories.Businesses.transactionsArray.transactions.date": {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                },

                {
                    $project: {
                        category: "$categories.name",
                        business: "$categories.Businesses.name",
                        bankNames: "$categories.Businesses.bankNames",
                        txId: "$categories.Businesses.transactionsArray.transactions._id",
                        amount: "$categories.Businesses.transactionsArray.transactions.amount",
                        date: "$categories.Businesses.transactionsArray.transactions.date",
                        description: "$categories.Businesses.transactionsArray.transactions.description",
                        dateYM: {
                            $substr: [
                                "$categories.Businesses.transactionsArray.transactions.date",
                                0,
                                7
                            ]
                        }
                    }
                },

                {
                    $group: {
                        _id: {
                            category: "$category",
                            business: "$business",
                            bankNames: "$bankNames",
                            dateYM: "$dateYM"
                        },
                        transactions: {
                            $push: {
                                _id: "$txId",
                                amount: "$amount",
                                date: "$date",
                                description: "$description"
                            }
                        }
                    }
                },

                {
                    $project: {
                        _id: 0,
                        category: "$_id.category",
                        business: "$_id.business",
                        bankNames: "$_id.bankNames",
                        dateYM: "$_id.dateYM",
                        transactions: 1
                    }
                },
                {
                    $group: {
                        _id: {
                            category: "$category",
                            business: "$business",
                            bankNames: "$bankNames"
                        },
                        transactionsArray: {
                            $push: {
                                dateYM: "$dateYM",
                                transactions: "$transactions"
                            }
                        }
                    }
                },

                {
                    $project: {
                        _id: 0,
                        category: "$_id.category",
                        business: "$_id.business",
                        bankNames: "$_id.bankNames",
                        transactionsArray: 1
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        Businesses: {
                            $push: {
                                name: "$business",
                                bankNames: "$bankNames",
                                transactionsArray: "$transactionsArray"
                            }
                        }
                    }
                },

                {
                    $project: {
                        _id: 0,
                        name: "$_id",
                        Businesses: 1
                    }
                },

                { $sort: { name: 1 } }
            ];

            const results = await db.Aggregate(this.expenseCollection, pipeline);
            return results || [];
        } catch (error) {
            console.error("Error in TransactionModel.getTransactionsInDateRange", error);
            throw new Error("Failed to get transactions in date range");
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
                {
                    $project: {
                        transactionsArray: "$categories.Businesses.transactionsArray",
                        _id: 0
                    }
                }
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
                {
                    $project: {
                        transactionsArray: "$categories.Businesses.transactionsArray",
                        _id: 0
                    }
                }
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

    static async uploadFromFile(
        profileName: string,
        refId: string,
        groupedTransactions: GroupedTransactions[],
        profileIncs: { id: ObjectId; amount: number }[],
        categoryIncs: { id: ObjectId; categoryName: string; amount: number }[]
    ) {
        try {
            const operations: { collection: string; query: any; update: any; options?: any }[] = [];

            // 1. Insert grouped transactions
            for (const group of groupedTransactions) {
                // Step 1a: ensure the month bucket exists
                operations.push({
                    collection: "expenses",
                    query: { _id: new ObjectId(refId) },
                    update: {
                        $addToSet: {
                            "categories.$[cat].Businesses.$[biz].transactionsArray": {
                                dateYM: group.dateYM,
                                transactions: []
                            }
                        }
                    },
                    options: {
                        arrayFilters: [
                            { "cat.name": group.category },
                            { "biz.name": group.business }
                        ]
                    }
                });

                // Step 1b: push transactions into the correct month
                operations.push({
                    collection: "expenses",
                    query: { _id: new ObjectId(refId) },
                    update: {
                        $push: {
                            "categories.$[cat].Businesses.$[biz].transactionsArray.$[month].transactions": {
                                $each: group.transactions
                            }
                        }
                    },
                    options: {
                        arrayFilters: [
                            { "cat.name": group.category },
                            { "biz.name": group.business },
                            { "month.dateYM": group.dateYM }
                        ]
                    }
                });
            }

            // 2. Update category budgets
            for (const inc of categoryIncs) {
                operations.push({
                    collection: "expenses",
                    query: { _id: new ObjectId(refId) },
                    update: {
                        $inc: { "categories.$[cat].budgets.$[b].spent": inc.amount }
                    },
                    options: {
                        arrayFilters: [
                            { "cat.name": inc.categoryName },
                            { "b._id": inc.id }
                        ]
                    }
                });
            }

            // 3. Update profile budgets
            for (const inc of profileIncs) {
                operations.push({
                    collection: "profiles",
                    query: { profileName, "budgets._id": inc.id },
                    update: {
                        $inc: { "budgets.$.spent": inc.amount }
                    }
                });
            }

            // 4. Execute all ops atomically
            const result = await db.TransactionUpdateMany(operations);
            return result;
        } catch (error) {
            console.error("Error in TransactionModel.uploadFromFile", error);
            throw new Error("Failed to upload transactions from file");
        }
    }
}