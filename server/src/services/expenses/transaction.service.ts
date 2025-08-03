import * as appErrors from "../../errors/AppError";
import TransactionModel from "../../models/expenses/transaction.model";
import { ObjectId } from "mongodb";
import { Category, Transaction, TransactionWithoutId } from "../../types/expenses.types";
import CategoryService from "./category.service";
import CategoriesModel from "../../models/expenses/categories.model";

export default class TransactionService {

    static async createTransaction
        (refId: string, catName: string, busName: string, transactionData: TransactionWithoutId) {
        if (!refId || !catName || !busName || !transactionData) {
            throw new appErrors.BadRequestError("Reference ID, category name, business name and transaction data are required");
        }
        const transaction: Transaction = { ...transactionData, _id: new ObjectId() };
        const result = await TransactionModel.createTransaction(refId, catName, busName, transaction);
        if (!result?.success) {
            throw new appErrors.AppError(result?.message || "Failed to create transaction", 500);
        }
        return result;
    }

    static async changeTransactionAmount
        (refId: string, catName: string, busName: string, transactionId: ObjectId, newAmount: number) {
        if (!refId || !catName || !busName || !transactionId || newAmount === undefined) {
            throw new appErrors.BadRequestError("Reference ID, category name, business name, transaction ID and new amount are required");
        }
        const result = await TransactionModel.changeTransactionAmount(refId, catName, busName, transactionId, newAmount);
        if (!result?.success) {
            throw new appErrors.AppError(result?.message || "Failed to change transaction amount", 500);
        }
        return result;
    }

    static async deleteTransaction
        (refId: string, catName: string, busName: string, transactionId: ObjectId) {
        if (!refId || !catName || !busName || !transactionId) {
            throw new appErrors.BadRequestError
                ("Reference ID, category name, business name and transaction ID are required");
        }
        const result = await TransactionModel.deleteTransaction(refId, catName, busName, transactionId);
        if (!result?.success) {
            throw new appErrors.AppError(result?.message || "Failed to delete transaction", 500);
        }
        return result;
    }

    static async getTransactionById
        (refId: string, catName: string, busName: string, transactionId: ObjectId) {
        if (!refId || !catName || !busName || !transactionId) {
            throw new appErrors.BadRequestError("Reference ID, category name, business name and transaction ID are required");
        }
        const categories = await CategoriesModel.getCategories(refId);
        if (!categories) {
            throw new appErrors.AppError("Failed to retrieve categories", 500);
        }
        const transaction = categories.categories.find((cat: Category) =>
            cat.name === catName && cat.Businesses.some(biz => biz.name === busName &&
                biz.transactions.some(trans => trans._id === transactionId))
        );
        if (!transaction) {
            throw new appErrors.NotFoundError("Transaction not found");
        }
        return transaction;
    }
}