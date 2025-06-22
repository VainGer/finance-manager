import { Category, CategoryBudget } from "./expenses.types";
import { Response, Request } from "express";
import db from "../../server";
import { ObjectId } from "mongodb";

export default class CategoriesModel {
    private static expenseCollection: string = "expenses";

    static async createCategory(refId: ObjectId, name: string) {
        try {
            const newCategory: Category = {
                name,
                budgets: [],
                Businesses: []
            };
            const result = await db.UpdateDocument(CategoriesModel.expenseCollection, { _id: new ObjectId(refId) },
                { $addToSet: { categories: newCategory } });

            if (!result || result.modifiedCount === 0) {
                return { status: 400, error: "Failed to create category" };
            } else {
                return { status: 201, message: "Category created successfully" };
            }
        } catch (error) {
            console.error("Error creating category:", error);
            return { status: 500, error: "Internal server error" };
        }
    }

    static async createBudget(refId: ObjectId, catName: string, budget: CategoryBudget) {
        try {
        const result = await db.UpdateDocument(
            CategoriesModel.expenseCollection,
            { _id: new ObjectId(refId), "categories.name": catName },
            { $push: { "categories.$.budgets": budget } });

        if (!result || result.modifiedCount === 0) {
            return { status: 400, error: "Failed to create budget" };
        } else {
            return { status: 201, message: "Budget created successfully" };
        }
    } catch(error) {
        console.error("Error creating budget:", error);
        return { status: 500, error: "Internal server error" };
    }
}

    static async getCategoriesNames(refId: ObjectId) {
    try {
        const rawExpenses = await db.GetDocument(CategoriesModel.expenseCollection, { _id: new ObjectId(refId) });
        if (!rawExpenses) {
            return { status: 404, error: "Expenses not found" };
        }
        const categoriesNames = rawExpenses.categories.map((category: Category) => category.name);
        return { status: 200, categoriesNames };
    } catch (error) {
        console.error("Error fetching categories names:", error);
        return { status: 500, error: "Internal server error" };
    }
}

    static async renameCategory(refId: ObjectId, oldName: string, newName: string) {
    try {
        const result = await db.UpdateDocument(
            CategoriesModel.expenseCollection,
            { _id: new ObjectId(refId), "categories.name": oldName },
            { $set: { "categories.$.name": newName } });

        if (!result || result.modifiedCount === 0) {
            return { status: 404, error: "Category not found" };
        } else {
            return { status: 200, message: "Category renamed successfully" };
        }
    } catch (error) {
        console.error("Error renaming category:", error);
        return { status: 500, error: "Internal server error" };
    }
}

    static async deleteCategory(refId: ObjectId, catName: string) {
    try {
        const result = await db.UpdateDocument(
            CategoriesModel.expenseCollection,
            { _id: new ObjectId(refId) },
            { $pull: { categories: { name: catName } } });

        if (!result || result.modifiedCount === 0) {
            return { status: 404, error: "Category not found" };
        } else {
            return { status: 200, message: "Category deleted successfully" };
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        return { status: 500, error: "Internal server error" };
    }
}
}