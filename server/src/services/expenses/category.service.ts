import { Business, Category, CategoryBudget, CategoryBudgetWithoutId } from "../../types/expenses.types";
import { AppError, NotFoundError, BadRequestError, ConflictError } from "../../errors/AppError";
import CategoriesModel from "../../models/expenses/categories.model";
import { ObjectId } from "mongodb";
import { ref } from "process";

export default class CategoryService {

    static async createCategory(refId: string, name: string) {
        if (!refId || !name) {
            throw new BadRequestError("Reference ID and category name are required");
        }
        const existingCategories = await CategoriesModel.getCategories(refId);
        if (!existingCategories) {
            throw new NotFoundError("Expenses document not found");
        }
        if (existingCategories.categories.some((category: Category) => category.name === name)) {
            throw new ConflictError("Category already exists");
        }
        const category: Category = { name, budgets: [], Businesses: [] };
        const result = await CategoriesModel.createCategory(refId, category);
        if (!result?.success) {
            throw new AppError("Failed to create category", 500);
        }
        return result;
    }

    static async getCategoriesNames(refId: string) {
        if (!refId) {
            throw new BadRequestError("Reference ID is required");
        }
        const categories = await CategoriesModel.getCategories(refId);
        if (!categories) {
            throw new NotFoundError("Categories not found");
        }
        const categoriesNames = categories.categories.map((category: Category) => category.name);
        return { success: true, categoriesNames };
    }

    static async renameCategory(refId: string, oldName: string, newName: string) {
        if (!refId || !oldName || !newName) {
            throw new BadRequestError("Reference ID, old name and new name are required");
        }
        if (oldName === newName) {
            throw new BadRequestError("Old name and new name cannot be the same");
        }
        const existingCategories = await CategoriesModel.getCategories(refId);
        if (existingCategories?.categories.some((category: Category) => category.name === newName)) {
            throw new ConflictError("Category with the new name already exists");
        }
        const result = await CategoriesModel.renameCategory(refId, oldName, newName);
        if (!result || !result.success) {
            throw new AppError(result?.message || "Failed to rename category", 500);
        }
        return result;
    }

    static async deleteCategory(refId: string, catName: string) {
        if (!refId || !catName) {
            throw new BadRequestError("Reference ID and category name are required");
        }
        const result = await CategoriesModel.deleteCategory(refId, catName);
        if (!result || !result.success) {
            throw new AppError(result?.message || "Failed to delete category", 500);
        }
        return result;
    }

    static async getProfileExpenses(refId: string) {
        if (!refId) {
            throw new BadRequestError("Reference ID is required");
        }
        const categories = await CategoriesModel.getCategories(refId);
        if (!categories) {
            throw new NotFoundError("Categories not found");
        }
        return { success: true, categories: categories.categories };
    }

    static async getCategoriesBudgets(refId: string) {
        if (!refId) {
            throw new BadRequestError("Reference ID is required");
        }
        const categories = await CategoriesModel.getCategories(refId);
        if (!categories) {
            throw new NotFoundError("Categories not found");
        }
        const categoriesBudgets = categories.categories.map((category: Category) => ({
            name: category.name,
            budgets: category.budgets
        }));
        return { success: true, categoriesBudgets };
    }



    static async createCategoryBudget(refId: string, budget: CategoryBudget, categoryName: string) {
        if (!refId || !budget || !categoryName) {
            throw new BadRequestError("Reference ID, budget and category name are required");
        }
        const existingCategories = await CategoriesModel.getCategories(refId);
        if (!existingCategories) {
            throw new NotFoundError("Expenses document not found");
        }
        const category = existingCategories.categories.find((cat: Category) => cat.name === categoryName);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        budget.spent = await this.transactionsSumInCategoryInDateRange(refId, categoryName, new Date(budget.startDate), new Date(budget.endDate));
        budget.amount = parseFloat(budget.amount.toString());
        const result = await CategoriesModel.createCategoriesBudgets(refId, budget, categoryName);
        if (!result || !result.success) {
            throw new AppError(result?.message || "Failed to create category budget", 500);
        }
        return result;
    }


    static async updateCategoryBudgetSpent(refId: string, categoryName: string, budgetId: string, diff: number) {
        if (!refId || !categoryName || !budgetId || !diff) {
            throw new BadRequestError("Reference ID, category name, budget ID and difference amount are required");
        }
        const existingCategories = await CategoriesModel.getCategories(refId);
        if (!existingCategories) {
            throw new NotFoundError("Expenses document not found");
        }
        const category = existingCategories.categories.find((cat: Category) => cat.name === categoryName);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        const budget = category.budgets.find((b: CategoryBudget) => b._id.toString() === budgetId);
        if (!budget) {
            return { success: true, message: "No budget to update" };
        }
        const result = await CategoriesModel.updateCategoryBudgetSpent(refId, categoryName, budgetId, diff);
        if (!result || !result.success) {
            throw new AppError(result?.message || "Failed to update category budget spent", 500);
        }
        return result;
    }

    private static async transactionsSumInCategoryInDateRange
        (refId: string, categoryName: string, startDate: Date, endDate: Date) {
        const categories = await CategoriesModel.getCategories(refId);
        if (!categories) {
            throw new NotFoundError("Categories not found");
        }
        const category = categories.categories.find((cat: Category) => cat.name === categoryName);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        let sum = 0;
        category.Businesses.forEach((business: Business) => {
            business.transactions.forEach((transaction) => {
                const transactionDate = new Date(transaction.date);
                if (transactionDate >= startDate && transactionDate <= endDate) {
                    sum += transaction.amount;
                }
            });
        });
        return sum;
    }
}