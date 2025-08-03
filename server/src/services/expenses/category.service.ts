import { Category, CategoryBudget, CategoryBudgetWithoutId } from "../../types/expenses.types";
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

    static async createCategoryBudget(refId: string, budget: CategoryBudgetWithoutId, categoryName: string) {
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
        /*
        TODO after completing transactions model
        add logic to calculate total spent in the category based on the budget dates
        and update the budget with the spent amount before saving it to the database 
        ***********************************************************************************
                        newBudget._id should be given by profile budget
                        newBudget dates should be given by profile budget
        ***********************************************************************************
        */
        const newBudget: CategoryBudget = {
            _id: new ObjectId(),
            ...budget,
        }
        const result = await CategoriesModel.createCategoriesBudgets(refId, newBudget, categoryName);
        if (!result || !result.success) {
            throw new AppError(result?.message || "Failed to create category budget", 500);
        }
        return result;
    }

}