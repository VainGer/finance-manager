import { Category, CategoryBudget } from "./expenses.types";
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
                return { status: 400, error: "Failed to rename category" };
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

    static async getCategoriesBudgets(refId: ObjectId) {
        try {
            const rawExpenses = await db.GetDocument(CategoriesModel.expenseCollection, { _id: new ObjectId(refId) });
            if (!rawExpenses) {
                return { status: 404, error: "Expenses not found" };
            }
            const categoriesBudgets = rawExpenses.categories.map((category: Category) => ({
                name: category.name,
                budgets: category.budgets
            }));
            return { status: 200, categoriesBudgets };
        } catch (error) {
            console.error("Error fetching categories budgets:", error);
            return { status: 500, error: "Internal server error" };
        }
    }

    static async createCategoryBudget(refId: ObjectId, budget: CategoryBudget, categoryName: string) {
        try {
            let totalSpent = 0;
            const expenses = await db.GetDocument(CategoriesModel.expenseCollection, { _id: new ObjectId(refId) });
            if (!expenses) {
                throw new Error("Expenses not found");
            }
            const category = expenses.categories.find((cat: Category) => cat.name === categoryName);
            category.Businesses.forEach((business: any) => {
                business.transactions.forEach((transaction: any) => {
                    if (transaction.date >= budget.startDate && transaction.date <= budget.endDate) {
                        totalSpent += transaction.amount;
                    }
                });
            });

            budget.spent = totalSpent;

            const result = await db.UpdateDocument(
                CategoriesModel.expenseCollection,
                { _id: new ObjectId(refId), "categories.name": categoryName },
                { $addToSet: { "categories.$.budgets": budget } });

            if (!result || result.modifiedCount === 0) {
                return { success: false, spent: totalSpent };
            } else {
                return { success: true, spent: totalSpent };
            }
        } catch (error) {
            console.error("Error creating category budget:", error);
            return { success: false };
        }
    }

}
