import { Business, Category, CategoryBudget } from "../../types/expenses.types";
import * as AppErrors from "../../errors/AppError";
import CategoriesModel from "../../models/expenses/categories.model";
import BudgetModel from "../../models/budget/budget.model";
import ProfileModel from "../../models/profile/profile.model";
import { ObjectId } from "mongodb";
import { ProfileBudget } from "../../types/profile.types";

export default class BudgetService {

    static async createBudget(budgetData:
        {
            username: string, profileName: string, refId: string,
            profileBudget:
            { startDate: Date, endDate: Date, amount: number },
            categoriesBudgets: { categoryName: string, amount: number }[]
        }) {
        const { username, profileName, refId, profileBudget, categoriesBudgets } = budgetData;
        if (!refId || !profileBudget || !profileBudget.startDate || !profileBudget.endDate || !profileBudget.amount || !categoriesBudgets) {
            throw new AppErrors.ValidationError("Reference ID, profile budget data and categories budgets are required.");
        }
        const validDatesInBudgets = await this.validateBudgetDates(username, profileName, profileBudget.startDate, profileBudget.endDate);
        if (!validDatesInBudgets) {
            throw new AppErrors.ConflictError("Invalid budget dates");
        }
        const existingProfile = await ProfileModel.findProfile(username, profileName);
        const existingCategories = await CategoriesModel.getCategories(refId);
        if (!existingProfile || !existingCategories) {
            throw new AppErrors.NotFoundError("Profile or Categories not found.");
        }
        for (const category of existingCategories.categories) {
            if (!categoriesBudgets.find(cat => cat.categoryName === category.name)) {
                throw new AppErrors.ValidationError(`Budget for category '${category.name}' is missing.`);
            }
        }
        for (const budget of categoriesBudgets) {
            if (!existingCategories.categories.find((cat: Category) => cat.name === budget.categoryName)) {
                throw new AppErrors.ValidationError(`Category '${budget.categoryName}' does not exist in DB`);
            }
        }

        const budgetId = new ObjectId();
        const { preparedBudgets, totalSpent } = this.prepareCategoriesBudgets(categoriesBudgets, existingCategories.categories, budgetId, profileBudget.startDate, profileBudget.endDate);
        const profileBudgetWithSpent: ProfileBudget = {
            _id: budgetId,
            startDate: profileBudget.startDate,
            endDate: profileBudget.endDate,
            amount: profileBudget.amount,
            spent: totalSpent
        };
        const budgetResult = await BudgetModel.createBudget(username, profileName, refId,
            profileBudgetWithSpent, preparedBudgets, !existingProfile.parentProfile);
        if (!budgetResult || !budgetResult.success) {
            throw new AppErrors.DatabaseError(budgetResult?.message || "Failed to create budget");
        }
        return { success: true, message: "Budget created successfully" };
    }

    private static prepareCategoriesBudgets(inputBudgets:
        { categoryName: string, amount: number }[],
        existingCategories: Category[], id: ObjectId, startDate: Date, endDate: Date) {
        const preparedBudgets: CategoryBudget[] = [];
        let totalSpent = 0;
        for (const inputBudget of inputBudgets) {
            const category = existingCategories.find(cat => cat.name === inputBudget.categoryName);
            const spent = category ? this.transactionsSumInCategoryInDateRange(category, startDate, endDate) : 0;
            totalSpent += spent;
            preparedBudgets.push({
                _id: id,
                categoryName: category?.name,
                startDate,
                endDate,
                amount: inputBudget.amount,
                spent
            });
        }
        return { preparedBudgets, totalSpent };
    }

    static async getCategoriesBudgets(refId: string) {
        if (!refId) {
            throw new AppErrors.ValidationError("Reference ID is required.");
        }

        const categories = await CategoriesModel.getCategories(refId);
        if (!categories) {
            throw new AppErrors.NotFoundError("Categories not found.");
        }

        const categoriesBudgets = categories.categories.map((category: Category) => ({
            name: category.name,
            budgets: category.budgets
        }));

        return { success: true, categoriesBudgets };
    }

    static async updateCategoryBudgetSpent(refId: string, categoryName: string, budgetId: string, diff: number) {
        if (!refId || !categoryName || !budgetId || diff === undefined) {
            throw new AppErrors.ValidationError("Reference ID, category name, budget ID and difference amount are required.");
        }
        const existingCategories = await CategoriesModel.getCategories(refId);
        if (!existingCategories) {
            throw new AppErrors.NotFoundError("Expenses document not found.");
        }
        const category = existingCategories.categories.find((cat: Category) => cat.name === categoryName);
        if (!category) {
            throw new AppErrors.NotFoundError(`Category '${categoryName}' not found.`);
        }
        const budget = category.budgets.find((b: CategoryBudget) => b._id.toString() === budgetId);
        if (!budget) {
            return { success: true, message: "No budget to update" };
        }
        const result = await BudgetModel.updateCategoryBudgetSpent(refId, categoryName, budgetId, diff);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to update budget spent for category '${categoryName}'.`);
        }
        return result;
    }



    static async addBudgetToChild(username: string, profileName: string, budgetData: { startDate: Date, endDate: Date, amount: number }) {
        if (!username || !profileName || !budgetData) {
            throw new AppErrors.ValidationError("Username, profile name, and budget data are required.");
        }
        const result = await BudgetModel.addBudgetToChild(username, profileName, budgetData);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to add budget to child profile '${profileName}'.`);
        }
        return result;
    }

    static async updateBudgetSpentOnTransaction(username: string, profileName: string, budgetId: string, tAmount: number) {
        if (!username || !profileName || !budgetId || tAmount === undefined) {
            throw new AppErrors.ValidationError("Username, profile name, budget ID, and transaction amount are required.");
        }
        const result = await BudgetModel.updateBudgetSpentOnTransaction(username, profileName, budgetId, tAmount);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to update budget spent for profile '${profileName}'.`);
        }
        return result;
    }

    static async addChildBudgets(username: string, profileName: string, budget: { startDate: Date; endDate: Date; amount: number }) {
        if (!username || !profileName || !budget || !budget.startDate || !budget.endDate || !budget.amount) {
            throw new AppErrors.ValidationError("Username, profile name and budget data are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const foundNewBudgets = await this.getChildBudgets(username, profileName);
        if (foundNewBudgets.budgets && foundNewBudgets.budgets.length > 0) {
            const newStart = new Date(budget.startDate);
            const newEnd = new Date(budget.endDate);
            const overlappingDates = foundNewBudgets.budgets.some((b: any) => {
                const budgetStart = new Date(b.startDate);
                const budgetEnd = new Date(b.endDate);
                return (
                    (newStart >= budgetStart && newStart <= budgetEnd) ||
                    (newEnd >= budgetStart && newEnd <= budgetEnd) ||
                    (newStart <= budgetStart && newEnd >= budgetEnd) ||
                    (newStart >= budgetStart && newEnd <= budgetEnd)
                );
            });
            if (overlappingDates) {
                throw new AppErrors.ConflictError("Budget dates overlap with existing budgets");
            }
        }
        const validDatesInBudgets = await this.validateBudgetDates(username, profileName, budget.startDate, budget.endDate);
        if (!validDatesInBudgets) {
            throw new AppErrors.ConflictError("Invalid budget dates");
        }
        const result = await BudgetModel.addBudgetToChild(username, profileName, budget);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError("Failed to add budget to child profile");
        }
        return result;
    }

    static async validateBudgetDates(username: string, profileName: string, startDate: Date, endDate: Date) {
        if (!username || !profileName || !startDate || !endDate) {
            throw new AppErrors.ValidationError("Username, profile name, start date and end date are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const budgets = profile.budgets || [];
        if (budgets.length === 0) {
            return { success: true, message: "No budgets found for validation" };
        }

        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);

        const overlapingDates = budgets.some((budget: ProfileBudget) => {
            const budgetStart = new Date(budget.startDate);
            const budgetEnd = new Date(budget.endDate);

            return (
                (newStart >= budgetStart && newStart <= budgetEnd) ||
                (newEnd >= budgetStart && newEnd <= budgetEnd) ||
                (newStart <= budgetStart && newEnd >= budgetEnd) ||
                (newStart >= budgetStart && newEnd <= budgetEnd)
            );
        });
        if (overlapingDates) {
            throw new AppErrors.ConflictError("Budget dates overlap with existing budgets");
        }
        return { success: true, message: "Budget dates are valid" };
    }

    static async getChildBudgets(username: string, profileName: string) {
        if (!username || !profileName) {
            throw new AppErrors.ValidationError("Username and profile name are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const budgetsToDistribute = profile.newBudgets;
        return { success: true, budgets: budgetsToDistribute || [] };
    }

    static async getBudgets(username: string, profileName: string) {
        if (!username || !profileName) {
            throw new AppErrors.ValidationError("Username and profile name are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const profileBudget = profile.budgets;
        if (!profileBudget) {
            throw new AppErrors.NotFoundError("No budgets found for this profile");
        }
        const categoriesBudgets = await this.getCategoriesBudgets(profile.expenses);
        return { success: true, budgets: { profile: profileBudget, categories: categoriesBudgets.categoriesBudgets } };
    }

    static async deleteBudgets(username: string, profileName: string, budgetId: string) {
        if (!username || !profileName || !budgetId) {
            throw new AppErrors.ValidationError("Username, profile name and budget ID are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const result = await BudgetModel.deleteBudget(username, profileName, budgetId, profile.expenses);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to delete budget with ID '${budgetId}'`);
        }
        return result;
    }


    private static transactionsSumInCategoryInDateRange(category: Category, startDate: Date, endDate: Date) {
        let sum: number = 0;
        category.Businesses.forEach((business: Business) => {
            business.transactionsArray.forEach((monthlyTransactions) => {
                monthlyTransactions.transactions.forEach((transaction) => {
                    const transactionDate = new Date(transaction.date);
                    if (transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate)) {
                        sum += transaction.amount;
                    }
                });
            });
        });
        return sum;
    }
}
