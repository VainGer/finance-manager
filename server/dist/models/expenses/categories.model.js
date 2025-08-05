"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const mongodb_1 = require("mongodb");
class CategoriesModel {
    static expenseCollection = "expenses";
    static async createCategory(refId, category) {
        try {
            const result = await server_1.default.UpdateDocument(this.expenseCollection, { _id: new mongodb_1.ObjectId(refId) }, { $addToSet: { categories: category } });
            if (!result || result.modifiedCount === 0) {
                return null;
            }
            return { success: true, message: "Category created successfully" };
        }
        catch (error) {
            console.error("Error in CategoriesModel.createCategory", error);
            throw new Error("Failed to create category");
        }
    }
    static async getCategories(refId) {
        try {
            const categories = await server_1.default.GetDocument(this.expenseCollection, { _id: new mongodb_1.ObjectId(refId) });
            if (!categories) {
                return null;
            }
            return categories;
        }
        catch (error) {
            console.error("Error in CategoriesModel.getCategories", error);
            throw new Error("Failed to find category");
        }
    }
    static async renameCategory(refId, oldName, newName) {
        try {
            const result = await server_1.default.UpdateDocument(CategoriesModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId), "categories.name": oldName }, { $set: { "categories.$.name": newName } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Category not found or name is the same" };
            }
            return { success: true, message: "Category renamed successfully" };
        }
        catch (error) {
            console.error("Error in CategoriesModel.renameCategory", error);
            throw new Error("Failed to rename category");
        }
    }
    static async deleteCategory(refId, catName) {
        try {
            const result = await server_1.default.UpdateDocument(CategoriesModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId) }, { $pull: { categories: { name: catName } } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Category not found" };
            }
            return { success: true, message: "Category deleted successfully" };
        }
        catch (error) {
            console.error("Error in CategoriesModel.deleteCategory", error);
            throw new Error("Failed to delete category");
        }
    }
    static async createCategoriesBudgets(refId, budget, categoryName) {
        try {
            const result = await server_1.default.UpdateDocument(CategoriesModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId), "categories.name": categoryName }, { $addToSet: { "categories.$.budgets": budget } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to create category budget" };
            }
            return { success: true, message: "Category budget created successfully" };
        }
        catch (error) {
            console.error("Error in CategoriesModel.createCategoriesBudgets", error);
            throw new Error("Failed to create category budget");
        }
    }
}
exports.default = CategoriesModel;
//# sourceMappingURL=categories.model.js.map