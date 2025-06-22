"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const mongodb_1 = require("mongodb");
class CategoriesModel {
    static expenseCollection = "expenses";
    static async createCategory(refId, name) {
        try {
            const newCategory = {
                name,
                budgets: [],
                Businesses: []
            };
            const result = await server_1.default.UpdateDocument(CategoriesModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId) }, { $addToSet: { categories: newCategory } });
            if (!result || result.modifiedCount === 0) {
                return { status: 400, error: "Failed to create category" };
            }
            else {
                return { status: 201, message: "Category created successfully" };
            }
        }
        catch (error) {
            console.error("Error creating category:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
    static async createBudget(refId, catName, budget) {
        try {
            const result = await server_1.default.UpdateDocument(CategoriesModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId), "categories.name": catName }, { $push: { "categories.$.budgets": budget } });
            if (!result || result.modifiedCount === 0) {
                return { status: 400, error: "Failed to create budget" };
            }
            else {
                return { status: 201, message: "Budget created successfully" };
            }
        }
        catch (error) {
            console.error("Error creating budget:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
    static async getCategoriesNames(refId) {
        try {
            const rawExpenses = await server_1.default.GetDocument(CategoriesModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId) });
            if (!rawExpenses) {
                return { status: 404, error: "Expenses not found" };
            }
            const categoriesNames = rawExpenses.categories.map((category) => category.name);
            return { status: 200, categoriesNames };
        }
        catch (error) {
            console.error("Error fetching categories names:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
    static async renameCategory(refId, oldName, newName) {
        try {
            const result = await server_1.default.UpdateDocument(CategoriesModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId), "categories.name": oldName }, { $set: { "categories.$.name": newName } });
            if (!result || result.modifiedCount === 0) {
                return { status: 404, error: "Category not found" };
            }
            else {
                return { status: 200, message: "Category renamed successfully" };
            }
        }
        catch (error) {
            console.error("Error renaming category:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
    static async deleteCategory(refId, catName) {
        try {
            const result = await server_1.default.UpdateDocument(CategoriesModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId) }, { $pull: { categories: { name: catName } } });
            if (!result || result.modifiedCount === 0) {
                return { status: 404, error: "Category not found" };
            }
            else {
                return { status: 200, message: "Category deleted successfully" };
            }
        }
        catch (error) {
            console.error("Error deleting category:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
}
exports.default = CategoriesModel;
//# sourceMappingURL=categories.model.js.map