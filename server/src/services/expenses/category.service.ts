import { Business, Category, CategoryBudget, CategoryBudgetWithoutId } from "../../types/expenses.types";
import * as AppErrors from "../../errors/AppError";
import CategoriesModel from "../../models/expenses/categories.model";
import ProfileModel from "../../models/profile/profile.model";

export default class CategoryService {

    static async createCategory(refId: string, name: string) {
        if (!refId || !name) {
            throw new AppErrors.ValidationError("Reference ID and category name are required.");
        }

        const existingCategories = await CategoriesModel.getCategories(refId);
        if (!existingCategories) {
            throw new AppErrors.NotFoundError("Expenses document not found.");
        }

        if (existingCategories.categories.some((category: Category) => category.name === name)) {
            throw new AppErrors.ConflictError(`Category '${name}' already exists.`);
        }

        const category: Category = { name, budgets: [], Businesses: [] };
        const result = await CategoriesModel.createCategory(refId, category);

        if (!result?.success) {
            throw new AppErrors.DatabaseError(`Failed to create category '${name}'.`);
        }

        return result;
    }

    static async getCategoriesNames(refId: string) {
        if (!refId) {
            throw new AppErrors.ValidationError("Reference ID is required.");
        }

        const categories = await CategoriesModel.getCategories(refId);
        if (!categories) {
            throw new AppErrors.NotFoundError("Categories not found.");
        }

        const categoriesNames = categories.categories.map((category: Category) => category.name);
        return { success: true, categoriesNames };
    }

    static async renameCategory(refId: string, oldName: string, newName: string) {
        if (!refId || !oldName || !newName) {
            throw new AppErrors.ValidationError("Reference ID, old name and new name are required.");
        }

        if (oldName === newName) {
            throw new AppErrors.ValidationError("Old name and new name cannot be the same.");
        }

        const existingCategories = await CategoriesModel.getCategories(refId);
        if (!existingCategories) {
            throw new AppErrors.NotFoundError("Categories not found.");
        }

        if (existingCategories.categories.some((category: Category) => category.name === newName)) {
            throw new AppErrors.ConflictError(`Category '${newName}' already exists.`);
        }

        const result = await CategoriesModel.renameCategory(refId, oldName, newName);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to rename category from '${oldName}' to '${newName}'.`);
        }

        return result;
    }

    static async deleteCategory(refId: string, catName: string) {
        if (!refId || !catName) {
            throw new AppErrors.ValidationError("Reference ID and category name are required.");
        }

        const result = await CategoriesModel.deleteCategory(refId, catName);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to delete category '${catName}'.`);
        }

        return result;
    }

    static async getProfileExpenses(refId: string) {
        if (!refId) throw new AppErrors.ValidationError("Reference ID is required.");
        const categories = await CategoriesModel.getCategories(refId);
        if (!categories) throw new AppErrors.NotFoundError("Categories not found.");
        return categories.categories;
    }

    static async getChildProfileExpenses(username: string, childId: string) {
        if (!username || !childId) {
            throw new AppErrors.ValidationError("Username and child ID are required.");
        }

        const profile = await ProfileModel.findProfileById(username, childId);
        if (!profile) {
            throw new AppErrors.NotFoundError(`Child profile not found for ${username}:${childId}`);
        }

        const categories = await CategoriesModel.getCategories(profile.expenses);
        if (!categories) throw new AppErrors.NotFoundError("Categories not found.");
        return categories.categories;
    }
}