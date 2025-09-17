import * as appErrors from "../../errors/AppError";
import TransactionModel from "../../models/expenses/transaction.model";
import { ObjectId } from "mongodb";
import { Transaction, TransactionWithoutId } from "../../types/expenses.types";
import { ProfileBudget } from "../../types/profile.types";
import BudgetService from "../budget/budget.service";
import CategoriesModel from "../../models/expenses/categories.model";
import ProfileModel from "../../models/profile/profile.model";

export default class TransactionService {

    static async create
        (refId: string, catName: string, busName: string, transactionData: TransactionWithoutId) {
        if (!refId || !catName || !busName || !transactionData) {
            throw new appErrors.ValidationError("Reference ID, category name, business name and transaction data are required.");
        }

        const id = new ObjectId();
        const transaction: Transaction = { ...transactionData, _id: id };
        transaction.amount = parseFloat(transaction.amount.toString());

        const result = await TransactionModel.create(refId, catName, busName, transaction);
        if (!result?.success) {
            throw new appErrors.DatabaseError(result?.message || `Failed to create transaction for ${busName}.`);
        }

        const updateBudgetOnTransaction = await this.updateBudgetOnTransaction
            (refId, catName, busName, id.toString(), transaction.amount, true);
        if (!updateBudgetOnTransaction?.success) {
            throw new appErrors.DatabaseError(updateBudgetOnTransaction?.message || "Failed to update budget on transaction.");
        }

        return result;
    }

    static async changeAmount
        (refId: string, catName: string, busName: string, transactionId: any, newAmount: number) {
        if (!refId || !catName || !busName || !transactionId || newAmount === undefined) {
            throw new appErrors.ValidationError("Reference ID, category name, business name, transaction ID and new amount are required.");
        }

        newAmount = parseFloat(newAmount.toString());

        const txId = typeof transactionId === 'string' ? new ObjectId(transactionId) : transactionId;

        const updatedBudgetResult = await this.updateBudgetOnTransaction(refId, catName, busName, txId.toString(), newAmount);
        if (!updatedBudgetResult?.success) {
            throw new appErrors.DatabaseError(updatedBudgetResult?.message || "Failed to update budget on transaction.");
        }

        const result = await TransactionModel.changeAmount(refId, catName, busName, txId, newAmount);
        if (!result?.success) {
            throw new appErrors.DatabaseError(result?.message || `Failed to change amount for transaction ${txId}.`);
        }

        return result;
    }

    static async changeDate
        (refId: string, catName: string, busName: string, transactionId: string, newDate: Date) {
        if (!refId || !catName || !busName || !transactionId || !newDate) {
            throw new appErrors.ValidationError("Reference ID, category name, business name, transaction ID and new date are required.");
        }

        const transaction = await this.getById(refId, catName, busName, transactionId);
        if (!transaction) {
            throw new appErrors.NotFoundError(`Transaction ${transactionId} not found.`);
        }

        const newCreated = await this.create(refId, catName, busName, {
            amount: transaction.amount,
            date: newDate,
            description: transaction.description
        });

        const oldDeleted = await this.delete(refId, catName, busName, transactionId);

        if (!newCreated?.success || !oldDeleted?.success) {
            throw new appErrors.DatabaseError("Failed to complete transaction date change operation.");
        }

        return { success: true, message: "Transaction date changed successfully" };
    }

    static async changeDescription
        (refId: string, catName: string, busName: string, transactionId: string, newDescription: string) {
        if (!refId || !catName || !busName || !transactionId || !newDescription) {
            throw new appErrors.ValidationError("Reference ID, category name, business name, transaction ID and new description are required.");
        }

        const result = await TransactionModel.changeDescription(refId, catName, busName, transactionId, newDescription);
        if (!result?.success) {
            throw new appErrors.DatabaseError(result?.message || `Failed to change description for transaction ${transactionId}.`);
        }

        return result;
    }

    static async delete
        (refId: string, catName: string, busName: string, transactionId: string) {
        if (!refId || !catName || !busName || !transactionId) {
            throw new appErrors.ValidationError
                ("Reference ID, category name, business name and transaction ID are required.");
        }

        const updatedBudgetResult = await this.updateBudgetOnTransaction(refId, catName, busName, transactionId, 0);
        if (!updatedBudgetResult?.success) {
            throw new appErrors.DatabaseError(updatedBudgetResult?.message || "Failed to update budget on transaction deletion.");
        }

        const result = await TransactionModel.delete(refId, catName, busName, transactionId);
        if (!result?.success) {
            throw new appErrors.DatabaseError(result?.message || `Failed to delete transaction ${transactionId}.`);
        }

        return result;
    }



    private static async getById
        (refId: string, catName: string, busName: string, transactionId: string) {
        if (!refId || !catName || !busName || !transactionId) {
            throw new appErrors.ValidationError("Reference ID, category name, business name and transaction ID are required.");
        }

        const transaction = await TransactionModel.getById(refId, catName, busName, transactionId);
        if (!transaction) {
            throw new appErrors.NotFoundError(`Transaction '${transactionId}' not found.`);
        }
        return transaction;
    }

    private static async updateBudgetOnTransaction
        (refId: string, catName: string, busName: string, transactionId: string, newAmount: number, newTransaction: boolean = false) {
        if (!refId || !catName || !busName || !transactionId || newAmount === undefined) {
            throw new appErrors.ValidationError("Reference ID, category name, business name, transaction ID and new amount are required.");
        }

        const expenses = await CategoriesModel.getCategories(refId);
        if (!expenses) {
            throw new appErrors.NotFoundError("Expenses document not found.");
        }

        const { username, profileName } = { username: expenses.username, profileName: expenses.profileName };

        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new appErrors.NotFoundError(`Profile '${profileName}' not found.`);
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

        const resultProfile = await BudgetService.updateBudgetSpentOnTransaction(
            username, profileName, budget._id.toString(), diff);
        const resultCategory = await BudgetService.updateCategoryBudgetSpent(
            refId, catName, budget._id.toString(), diff);

        if (!resultProfile?.success || !resultCategory?.success) {
            throw new appErrors.DatabaseError(
                "Failed to update budget amounts for transaction."
            );
        }

        return { success: true, message: "Budget updated successfully" };
    }
}