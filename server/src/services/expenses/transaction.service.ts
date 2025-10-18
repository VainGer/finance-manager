import * as appErrors from "../../errors/AppError";
import TransactionModel from "../../models/expenses/transaction.model";
import { ObjectId } from "mongodb";
import { CategoryBudget, MonthlyTransactions, Transaction, TransactionWithoutId } from "../../types/expenses.types";
import { ProfileBudget } from "../../types/profile.types";
import BudgetService from "../budget/budget.service";
import CategoriesModel from "../../models/expenses/categories.model";
import ProfileModel from "../../models/profile/profile.model";
import AdminService from "../admin/admin.service";

export default class TransactionService {

    static async create
        (refId: string, catName: string, busName: string, transactionData: TransactionWithoutId) {
        if (!refId || !catName || !busName || !transactionData) {
            throw new appErrors.ValidationError("Reference ID, category name, business name and transaction data are required.");
        }
        const categoriesDoc = await CategoriesModel.getCategories(refId);
        const username = categoriesDoc?.username;
        const profileName = categoriesDoc?.profileName;
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
        AdminService.logAction({
            type: 'create',
            executeAccount: username,
            executeProfile: profileName,
            action: 'create_transaction',
            target: { refId, catName, busName, transaction }
        });
        return result;
    }

    static async changeAmount
        (refId: string, catName: string, busName: string, transactionId: any, newAmount: number) {
        if (!refId || !catName || !busName || !transactionId || newAmount === undefined) {
            throw new appErrors.ValidationError("Reference ID, category name, business name, transaction ID and new amount are required.");
        }

        newAmount = parseFloat(newAmount.toString());

        const txId = typeof transactionId === 'string' ? new ObjectId(transactionId) : transactionId;
        const categoriesDoc = await CategoriesModel.getCategories(refId);
        if (!categoriesDoc) throw new appErrors.NotFoundError("Categories document not found.");
        const { username, profileName } = categoriesDoc;
        const updatedBudgetResult = await this.updateBudgetOnTransaction(refId, catName, busName, txId.toString(), newAmount);
        if (!updatedBudgetResult?.success) {
            throw new appErrors.DatabaseError(updatedBudgetResult?.message || "Failed to update budget on transaction.");
        }

        const result = await TransactionModel.changeAmount(refId, catName, busName, txId, newAmount);
        if (!result?.success) {
            throw new appErrors.DatabaseError(result?.message || `Failed to change amount for transaction ${txId}.`);
        }
        AdminService.logAction({
            type: 'update',
            executeAccount: username,
            executeProfile: profileName,
            action: 'change_transaction_amount',
            target: { refId, catName, busName, transactionId, newAmount }
        });

        return result;
    }

    static async changeDate(refId: string, catName: string, busName: string, transactionId: string, newDate: string) {
        if (!refId || !catName || !busName || !transactionId || !newDate) {
            throw new appErrors.ValidationError("Reference ID, category name, business name, transaction ID and new date are required.");
        }
        const transaction = await this.getById(refId, catName, busName, transactionId);
        if (!transaction) {
            throw new appErrors.NotFoundError(`Transaction ${transactionId} not found.`);
        }

        const deleteResult = await this.delete(refId, catName, busName, transactionId);
        if (!deleteResult?.success) {
            throw new appErrors.DatabaseError(
                deleteResult?.message || `Failed to delete transaction ${transactionId} for date change.`);
        }
        const newTransaction: TransactionWithoutId = {
            amount: transaction.amount,
            date: newDate,
            description: transaction.description,
        };
        const categoriesDoc = await CategoriesModel.getCategories(refId);
        if (!categoriesDoc) throw new appErrors.NotFoundError("Categories document not found.");
        const { username, profileName } = categoriesDoc;
        const createResult = await this.create(refId, catName, busName, newTransaction);
        if (!createResult?.success) {
            throw new appErrors.DatabaseError(
                createResult?.message || `Failed to create transaction for ${busName}.`);
        }
        AdminService.logAction({
            type: 'update',
            executeAccount: username,
            executeProfile: profileName,
            action: 'change_transaction_date',
            target: { refId, catName, busName, transactionId, newDate }
        });
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
        const categoriesDoc = await CategoriesModel.getCategories(refId);
        if (!categoriesDoc) throw new appErrors.NotFoundError("Categories document not found.");
        const { username, profileName } = categoriesDoc;
        AdminService.logAction({
            type: 'update',
            executeAccount: username,
            executeProfile: profileName,
            action: 'change_transaction_description',
            target: { refId, catName, busName, transactionId, newDescription }
        });
        return result;
    }

    static async delete
        (refId: string, catName: string, busName: string, transactionId: string) {
        if (!refId || !catName || !busName || !transactionId) {
            throw new appErrors.ValidationError
                ("Reference ID, category name, business name and transaction ID are required.");
        }
        const categoriesDoc = await CategoriesModel.getCategories(refId);
        if (!categoriesDoc) throw new appErrors.NotFoundError("Categories document not found.");
        const { username, profileName } = categoriesDoc;
        const updatedBudgetResult = await this.updateBudgetOnTransaction(refId, catName, busName, transactionId, 0);
        if (!updatedBudgetResult?.success) {
            throw new appErrors.DatabaseError(updatedBudgetResult?.message || "Failed to update budget on transaction deletion.");
        }

        const result = await TransactionModel.delete(refId, catName, busName, transactionId);
        if (!result?.success) {
            throw new appErrors.DatabaseError(result?.message || `Failed to delete transaction ${transactionId}.`);
        }
        AdminService.logAction({
            type: 'delete',
            executeAccount: username,
            executeProfile: profileName,
            action: 'delete_transaction',
            target: { refId, catName, busName, transactionId }
        });
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

        const categoriesBudgets = (await BudgetService.getCategoriesBudgets(refId)).categoriesBudgets;

        const foundCategoryBudget = categoriesBudgets.find((cb) => {
            return cb.name === catName && cb.budgets.find((b) => b._id.toString() === budget._id.toString());
        });

        if (!budget || !foundCategoryBudget) {
            await TransactionModel.setUnexpected(refId, catName, busName, transactionId, transaction.date, true);
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

    static async getAll(refId: string, catName: string, busName: string) {
        if (!refId || !catName || !busName) {
            throw new appErrors.ValidationError("Reference ID, category name, and business name are required.");
        }

        try {
            const transactions = await TransactionModel.getAll(refId, catName, busName);
            return {
                success: true,
                transactions,
                message: "Transactions retrieved successfully"
            };
        } catch (error) {
            console.error("Error in TransactionService.getAll", error);
            throw new appErrors.DatabaseError("Failed to retrieve transactions.");
        }
    }

    static async getAllByMonth(refId: string, catName: string, busName: string) {
        if (!refId || !catName || !busName) {
            throw new appErrors.ValidationError("Reference ID, category name, and business name are required.");
        }

        try {
            const monthlyTransactions = await TransactionModel.getAllByMonth(refId, catName, busName);
            return {
                success: true,
                monthlyTransactions,
                message: "Monthly transactions retrieved successfully"
            };
        } catch (error) {
            console.error("Error in TransactionService.getAllByMonth", error);
            throw new appErrors.DatabaseError("Failed to retrieve monthly transactions.");
        }
    }
}