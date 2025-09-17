import db from "../../server";
import { Category } from "../../types/expenses.types";
import { ObjectId } from "mongodb";

export default class CategoriesModel {
    private static expenseCollection: string = "expenses";

    static async createCategory(refId: string, category: Category) {
        try {
            const result = await db.UpdateDocument(this.expenseCollection, { _id: new ObjectId(refId) },
                { $addToSet: { categories: category } });
            if (!result || result.modifiedCount === 0) {
                return null;
            }
            return { success: true, message: "Category created successfully" };
        } catch (error) {
            console.error("Error in CategoriesModel.createCategory", error);
            throw new Error("Failed to create category");
        }
    }

    static async getCategories(refId: string) {
        try {
            const categories = await db.GetDocument(this.expenseCollection,
                { _id: new ObjectId(refId) });
            if (!categories) {
                return null;
            }
            return categories;
        } catch (error) {
            console.error("Error in CategoriesModel.getCategories", error);
            throw new Error("Failed to find category");
        }
    }

    static async renameCategory(refId: string, oldName: string, newName: string) {
        try {
            const result = await db.UpdateDocument(
                CategoriesModel.expenseCollection,
                { _id: new ObjectId(refId), "categories.name": oldName },
                { $set: { "categories.$.name": newName } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Category not found or name is the same" };
            }
            return { success: true, message: "Category renamed successfully" };
        } catch (error) {
            console.error("Error in CategoriesModel.renameCategory", error);
            throw new Error("Failed to rename category");
        }
    }

    static async deleteCategory(refId: string, catName: string) {
        try {
            const result = await db.UpdateDocument(
                CategoriesModel.expenseCollection,
                { _id: new ObjectId(refId) },
                { $pull: { categories: { name: catName } } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Category not found" };
            }
            return { success: true, message: "Category deleted successfully" };
        } catch (error) {
            console.error("Error in CategoriesModel.deleteCategory", error);
            throw new Error("Failed to delete category");
        }
    }



}