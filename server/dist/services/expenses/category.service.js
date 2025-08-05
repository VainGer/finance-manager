"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("../../errors/AppError");
const categories_model_1 = __importDefault(require("../../models/expenses/categories.model"));
const mongodb_1 = require("mongodb");
class CategoryService {
    static async createCategory(refId, name) {
        if (!refId || !name) {
            throw new AppError_1.BadRequestError("Reference ID and category name are required");
        }
        const existingCategories = await categories_model_1.default.getCategories(refId);
        if (!existingCategories) {
            throw new AppError_1.NotFoundError("Expenses document not found");
        }
        if (existingCategories.categories.some((category) => category.name === name)) {
            throw new AppError_1.ConflictError("Category already exists");
        }
        const category = { name, budgets: [], Businesses: [] };
        const result = await categories_model_1.default.createCategory(refId, category);
        if (!result?.success) {
            throw new AppError_1.AppError("Failed to create category", 500);
        }
        return result;
    }
    static async getCategoriesNames(refId) {
        if (!refId) {
            throw new AppError_1.BadRequestError("Reference ID is required");
        }
        const categories = await categories_model_1.default.getCategories(refId);
        if (!categories) {
            throw new AppError_1.NotFoundError("Categories not found");
        }
        const categoriesNames = categories.categories.map((category) => category.name);
        return { success: true, categoriesNames };
    }
    static async renameCategory(refId, oldName, newName) {
        if (!refId || !oldName || !newName) {
            throw new AppError_1.BadRequestError("Reference ID, old name and new name are required");
        }
        if (oldName === newName) {
            throw new AppError_1.BadRequestError("Old name and new name cannot be the same");
        }
        const existingCategories = await categories_model_1.default.getCategories(refId);
        if (existingCategories?.categories.some((category) => category.name === newName)) {
            throw new AppError_1.ConflictError("Category with the new name already exists");
        }
        const result = await categories_model_1.default.renameCategory(refId, oldName, newName);
        if (!result || !result.success) {
            throw new AppError_1.AppError(result?.message || "Failed to rename category", 500);
        }
        return result;
    }
    static async deleteCategory(refId, catName) {
        if (!refId || !catName) {
            throw new AppError_1.BadRequestError("Reference ID and category name are required");
        }
        const result = await categories_model_1.default.deleteCategory(refId, catName);
        if (!result || !result.success) {
            throw new AppError_1.AppError(result?.message || "Failed to delete category", 500);
        }
        return result;
    }
    static async getProfileExpenses(refId) {
        if (!refId) {
            throw new AppError_1.BadRequestError("Reference ID is required");
        }
        const categories = await categories_model_1.default.getCategories(refId);
        if (!categories) {
            throw new AppError_1.NotFoundError("Categories not found");
        }
        return { success: true, categories: categories.categories };
    }
    static async getCategoriesBudgets(refId) {
        if (!refId) {
            throw new AppError_1.BadRequestError("Reference ID is required");
        }
        const categories = await categories_model_1.default.getCategories(refId);
        if (!categories) {
            throw new AppError_1.NotFoundError("Categories not found");
        }
        const categoriesBudgets = categories.categories.map((category) => ({
            name: category.name,
            budgets: category.budgets
        }));
        return { success: true, categoriesBudgets };
    }
    static async createCategoryBudget(refId, budget, categoryName) {
        if (!refId || !budget || !categoryName) {
            throw new AppError_1.BadRequestError("Reference ID, budget and category name are required");
        }
        const existingCategories = await categories_model_1.default.getCategories(refId);
        if (!existingCategories) {
            throw new AppError_1.NotFoundError("Expenses document not found");
        }
        const category = existingCategories.categories.find((cat) => cat.name === categoryName);
        if (!category) {
            throw new AppError_1.NotFoundError("Category not found");
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
        const newBudget = {
            _id: new mongodb_1.ObjectId(),
            ...budget,
        };
        const result = await categories_model_1.default.createCategoriesBudgets(refId, newBudget, categoryName);
        if (!result || !result.success) {
            throw new AppError_1.AppError(result?.message || "Failed to create category budget", 500);
        }
        return result;
    }
}
exports.default = CategoryService;
//# sourceMappingURL=category.service.js.map