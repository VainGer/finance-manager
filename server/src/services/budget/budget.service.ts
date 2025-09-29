import { Business, Category, CategoryBudget } from "../../types/expenses.types";
import * as AppErrors from "../../errors/AppError";
import CategoriesModel from "../../models/expenses/categories.model";
import BudgetModel from "../../models/budget/budget.model";
import ProfileModel from "../../models/profile/profile.model";
import { ObjectId } from "mongodb";
import { ProfileBudget } from "../../types/profile.types";
import CategoryService from "../expenses/category.service";

export default class BudgetService {

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

    static async createCategoryBudget(refId: string, budget: CategoryBudget, categoryName: string) {
        if (!refId || !budget || !categoryName) {
            throw new AppErrors.ValidationError("Reference ID, budget and category name are required.");
        }

        const existingCategories = await CategoriesModel.getCategories(refId);
        if (!existingCategories) {
            throw new AppErrors.NotFoundError("Expenses document not found.");
        }

        const category = existingCategories.categories.find((cat: Category) => cat.name === categoryName);
        if (!category) {
            throw new AppErrors.NotFoundError(`Category '${categoryName}' not found.`);
        }

        budget.spent = await this.transactionsSumInCategoryInDateRange(refId, categoryName, new Date(budget.startDate), new Date(budget.endDate));
        budget.amount = parseFloat(budget.amount.toString());

        const result = await BudgetModel.createCategoriesBudgets(refId, budget, categoryName);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to create budget for category '${categoryName}'.`);
        }

        return result;
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

    private static async transactionsSumInCategoryInDateRange(refId: string, categoryName: string, startDate: Date, endDate: Date) {
        if (!refId || !categoryName || !startDate || !endDate) {
            throw new AppErrors.ValidationError("Reference ID, category name, start date, and end date are required.");
        }

        const categories = await CategoriesModel.getCategories(refId);
        if (!categories) {
            throw new AppErrors.NotFoundError("Categories not found.");
        }

        const category = categories.categories.find((cat: Category) => cat.name === categoryName);
        if (!category) {
            throw new AppErrors.NotFoundError(`Category '${categoryName}' not found.`);
        }

        let sum = 0;
        category.Businesses.forEach((business: Business) => {
            business.transactionsArray.forEach((monthlyTransactions) => {
                monthlyTransactions.transactions.forEach((transaction) => {
                    const transactionDate = new Date(transaction.date);
                    if (transactionDate >= startDate && transactionDate <= endDate) {
                        sum += transaction.amount;
                    }
                });
            });
        });

        return sum;
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

    static async pullChildBudget(username: string, profileName: string, startDate: Date, endDate: Date) {
        if (!username || !profileName || !startDate || !endDate) {
            throw new AppErrors.ValidationError("Username, profile name, start date, and end date are required.");
        }

        const result = await BudgetModel.pullChildBudget(username, profileName, startDate, endDate);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to pull child budget for profile '${profileName}'.`);
        }

        return result;
    }

    static async createProfileBudget(username: string, profileName: string, budgetData: ProfileBudget) {
        if (!username || !profileName || !budgetData) {
            throw new AppErrors.ValidationError("Username, profile name, and budget data are required.");
        }

        const result = await BudgetModel.createBudget(username, profileName, budgetData);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to create budget for profile '${profileName}'.`);
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

    static async createBudget(budgetData: { username: string; profileName: string; profileBudget: any; categoriesBudgets: { categoryName: string; amount: number }[] }) {
        const { username, profileName, profileBudget, categoriesBudgets } = budgetData;
        if (!username || !profileName || !profileBudget || !categoriesBudgets) {
            throw new AppErrors.ValidationError("Username, profile name, profileBudget and categoriesBudgets are required");
        }

        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const refId = profile.expenses;

        const id = new ObjectId();

        const categories = await CategoryService.getCategoriesNames(refId);
        for (const category of categories.categoriesNames) {
            if (!categoriesBudgets.find((cat) => cat.categoryName === category)) {
                throw new AppErrors.ValidationError(`Category '${category}' does not have a budget`);
            }
        }

        const categoriesBudgetsCreated = await this.createCategoryBudgets(
            refId,
            categoriesBudgets,
            id,
            new Date(profileBudget.startDate),
            new Date(profileBudget.endDate)
        );

        const totalSpent = await this.getTransactionSumInBudgetDateRange(refId, id);

        const newProfileBudget: ProfileBudget = {
            _id: id,
            startDate: new Date(profileBudget.startDate),
            endDate: new Date(profileBudget.endDate),
            amount: profileBudget.amount,
            spent: totalSpent
        };

        if (!categoriesBudgetsCreated || !categoriesBudgetsCreated.success) {
            throw new AppErrors.DatabaseError(categoriesBudgetsCreated?.message || "Failed to create categories budgets");
        }

        const profileBudgetCreated = await BudgetModel.createBudget(username, profileName, newProfileBudget);

        if (!profileBudgetCreated || !profileBudgetCreated.success) {
            throw new AppErrors.DatabaseError(profileBudgetCreated?.message || "Failed to create budget");
        }

        if (!profile.parentProfile) {
            const clearResult = await BudgetModel.pullChildBudget(username, profileName, new Date(profileBudget.startDate), new Date(profileBudget.endDate));
            if (!clearResult || !clearResult.success) {
                throw new AppErrors.DatabaseError(clearResult?.message || "Failed to clear child budget");
            }
        }
        return { success: true, message: "Budget created successfully" };
    }

    private static async createCategoryBudgets
        (refId: string, categeriesBudgets: { categoryName: string; amount: number }[], budgetId: ObjectId, startDate: Date, endDate: Date) {
        if (!refId || !categeriesBudgets || !budgetId || !startDate || !endDate) {
            throw new AppErrors.ValidationError("Reference ID, categories budgets, budget ID, start date and end date are required");
        }
        const categories = await CategoryService.getCategoriesNames(refId);
        for (const category of categeriesBudgets) {
            if (!categories.categoriesNames.includes(category.categoryName)) {
                throw new AppErrors.ValidationError(`Category '${category.categoryName}' does not exist`);
            }
        }
        for (const categoryBudget of categeriesBudgets) {
            if (!categoryBudget.categoryName || !categoryBudget.amount) {
                throw new AppErrors.ValidationError("Category name and amount are required for each category budget");
            }
            const budget: CategoryBudget = {
                _id: budgetId,
                startDate: startDate,
                endDate: endDate,
                amount: categoryBudget.amount,
                spent: 0
            };
            const result = await this.createCategoryBudget(refId, budget, categoryBudget.categoryName);
            if (!result || !result.success) {
                throw new AppErrors.DatabaseError(result?.message || "Failed to create category budget");
            }
        }
        return { success: true, message: "Category budgets created successfully" };
    }

    static async getBudgetSpent(refId: string, budgetId: string) {
        if (!refId || !budgetId) {
            throw new AppErrors.ValidationError("Reference ID and budget ID are required.");
        }

        const objectId = new ObjectId(budgetId);
        const totalSpent = await this.getTransactionSumInBudgetDateRange(refId, objectId);

        return {
            success: true,
            spent: totalSpent,
            message: "Budget spent amount calculated successfully"
        };
    }

    private static async getTransactionSumInBudgetDateRange(refId: string, budgetId: ObjectId) {
        if (!refId || !budgetId) {
            throw new AppErrors.ValidationError("Reference ID and budget ID are required.");
        }

        const categories = await CategoriesModel.getCategories(refId);
        if (!categories) {
            throw new AppErrors.NotFoundError("Categories not found.");
        }

        let totalSum = 0;
        for (const category of categories.categories) {
            if (category.budgets && Array.isArray(category.budgets)) {
                const matchingBudget = category.budgets.find((budget: CategoryBudget) =>
                    budget._id && budget._id.toString() === budgetId.toString()
                );

                if (matchingBudget) {
                    totalSum += matchingBudget.spent || 0;
                }
            }
        }
        return totalSum;
    }
}
