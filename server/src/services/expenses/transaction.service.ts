import * as appErrors from "../../errors/AppError";
import TransactionModel from "../../models/expenses/transaction.model";
import { ObjectId } from "mongodb";
import { Business, Category, Transaction, TransactionWithoutId } from "../../types/expenses.types";
import { Profile, ProfileBudget } from "../../types/profile.types";
import CategoryService from "./category.service";
import CategoriesModel from "../../models/expenses/categories.model";
import ProfileService from "../profile/profile.service";
import ProfileModel from "../../models/profile/profile.model";

export default class TransactionService {

    static async create
        (refId: string, catName: string, busName: string, transactionData: TransactionWithoutId) {
        if (!refId || !catName || !busName || !transactionData) {
            throw new appErrors.BadRequestError("Reference ID, category name, business name and transaction data are required");
        }
        const id = new ObjectId();
        const transaction: Transaction = { ...transactionData, _id: id };
        transaction.amount = parseFloat(transaction.amount.toString());
        const result = await TransactionModel.create(refId, catName, busName, transaction);
        const updateBudgetOnTransaction = await this.updateBudgetOnTransaction
            (refId, catName, busName, id.toString(), transaction.amount, true);
        if (!result?.success) {
            throw new appErrors.AppError(result?.message || "Failed to create transaction", 500);
        }
        if (!updateBudgetOnTransaction?.success) {
            throw new appErrors.AppError(updateBudgetOnTransaction?.message || "Failed to update budget on transaction", 500);
        }
        return result;
    }

    static async changeAmount
        (refId: string, catName: string, busName: string, transactionId: any, newAmount: number) {
        if (!refId || !catName || !busName || !transactionId || newAmount === undefined) {
            throw new appErrors.BadRequestError("Reference ID, category name, business name, transaction ID and new amount are required");
        }
        newAmount = parseFloat(newAmount.toString());
        const txId = typeof transactionId === 'string' ? new ObjectId(transactionId) : transactionId;
        const updatedBudgetResult = await this.updateBudgetOnTransaction(refId, catName, busName, txId.toString(), newAmount);
        if (!updatedBudgetResult?.success) {
            throw new appErrors.AppError(updatedBudgetResult?.message || "Failed to update budget on transaction", 500);
        }
        const result = await TransactionModel.changeAmount(refId, catName, busName, txId, newAmount);
        if (!result?.success) {
            throw new appErrors.AppError(result?.message || "Failed to change transaction amount", 500);
        }
        return result;
    }

    static async changeDate
        (refId: string, catName: string, busName: string, transactionId: string, newDate: Date) {
        if (!refId || !catName || !busName || !transactionId || !newDate) {
            throw new appErrors.BadRequestError("Reference ID, category name, business name, transaction ID and new date are required");
        }
        const transaction = await this.getById(refId, catName, busName, transactionId);
        if (!transaction) {
            throw new appErrors.NotFoundError("Transaction not found");
        }
        const newCreated = await this.create(refId, catName, busName, { amount: transaction.amount, date: newDate, description: transaction.description });
        const oldDeleted = await this.delete(refId, catName, busName, transactionId);
        if (!newCreated?.success || !oldDeleted?.success) {
            throw new appErrors.AppError("Failed to change transaction date", 500);
        }
        return { success: true, message: "Transaction date changed successfully" };
    }

    static async changeDescription
        (refId: string, catName: string, busName: string, transactionId: string, newDescription: string) {
        try {
            if (!refId || !catName || !busName || !transactionId || !newDescription) {
                throw new appErrors.BadRequestError("Reference ID, category name, business name, transaction ID and new description are required");
            }
            const result = await TransactionModel.changeDescription(refId, catName, busName, transactionId, newDescription);
            if (!result?.success) {
                throw new appErrors.AppError(result?.message || "Failed to change transaction description", 500);
            }
            return result;
        } catch (error) {
            throw new appErrors.AppError("Failed to change transaction description", 500);
        }
    }

    static async delete
        (refId: string, catName: string, busName: string, transactionId: string) {
        if (!refId || !catName || !busName || !transactionId) {
            throw new appErrors.BadRequestError
                ("Reference ID, category name, business name and transaction ID are required");
        }
        const updatedBudgetResult = await this.updateBudgetOnTransaction(refId, catName, busName, transactionId, 0);
        if (!updatedBudgetResult?.success) {
            throw new appErrors.AppError(updatedBudgetResult?.message || "Failed to update budget on transaction", 500);
        }
        const result = await TransactionModel.delete(refId, catName, busName, transactionId);
        if (!result?.success) {
            throw new appErrors.AppError(result?.message || "Failed to delete transaction", 500);
        }
        return result;
    }

    private static async getById
        (refId: string, catName: string, busName: string, transactionId: string) {
        if (!refId || !catName || !busName || !transactionId) {
            throw new appErrors.BadRequestError("Reference ID, category name, business name and transaction ID are required");
        }
        const categories = await CategoriesModel.getCategories(refId);
        if (!categories) {
            throw new appErrors.AppError("Failed to retrieve categories", 500);
        }
        const category = categories.categories.find((cat: Category) => cat.name === catName);
        const business = category?.Businesses.find((b: Business) => b.name === busName);
        const transaction = business?.transactions.find((t: Transaction) => t._id.toString() === transactionId);
        if (!transaction) {
            throw new appErrors.NotFoundError("Transaction not found");
        }
        return transaction;
    }

    private static async updateBudgetOnTransaction
        (refId: string, catName: string, busName: string, transactionId: string, newAmount: number, newTransaction: boolean = false) {
        if (!refId || !catName || !busName || !transactionId || newAmount === undefined) {
            throw new appErrors.BadRequestError("Reference ID, category name, business name, transaction ID and new amount are required");
        }
        const expenses = await CategoriesModel.getCategories(refId);
        if (!expenses) {
            throw new appErrors.NotFoundError("Expenses not found");
        }
        const { username, profileName } = { username: expenses.username, profileName: expenses.profileName };
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new appErrors.NotFoundError("Profile not found");
        }
        const transaction = await this.getById(refId, catName, busName, transactionId);
        const budget = profile.budgets.find((b: ProfileBudget) => {
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
        const resultProfile = await ProfileModel.updateBudgetSpentOnTransaction(username, profileName, budget._id.toString(), diff);
        const resultCategory = await CategoryService.updateCategoryBudgetSpent(refId, catName, budget._id.toString(), diff);
        if (!resultProfile?.success || !resultCategory?.success) {
            throw new appErrors.AppError("Failed to update budget on transaction", 500);
        }
        return { success: true, message: "Budget updated successfully" };
    }
}