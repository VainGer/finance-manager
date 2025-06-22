import { Response, Request } from "express";
import db from "../../server";
import { ObjectId } from "mongodb";
import { Business, Category } from "./expenses.types";

export default class BusinessModel {
    private static expenseCollection: string = "expenses";

    static async addBusinessToCategory(refId: ObjectId, catName: string, name: string) {
        try {
            const newBusiness: Business = {
                name,
                transactions: []
            };

            const result = await db.UpdateDocument(BusinessModel.expenseCollection,
                { _id: new ObjectId(refId), "categories.name": catName },
                { $addToSet: { "categories.$.Businesses": newBusiness } });

            if (!result || result.modifiedCount === 0) {
                return { status: 404, error: "Expense or category not found, or business already exists" };
            } else {
                return { status: 201, message: "Business added to category successfully" };
            }
        } catch (error) {
            console.error("Error adding business to category:", error);
            return { status: 500, error: "Internal server error" };
        }
    }

    static async renameBusiness(refId: ObjectId, catName: string, oldName: string, newName: string) {
        try {
            const result = await db.UpdateDocument(
                BusinessModel.expenseCollection,
                { _id: new ObjectId(refId), "categories.name": catName, "categories.Businesses.name": oldName },
                { $set: { "categories.$.Businesses.$[bizFilter].name": newName } },
                {
                    arrayFilters: [{ "bizFilter.name": oldName }]
                });

            if (!result || result.modifiedCount === 0) {
                return { status: 404, error: "Expense, category, or business not found" };
            } else {
                return { status: 200, message: "Business renamed successfully" };
            }
        } catch (error) {
            console.error("Error renaming business:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
    
    static async getBusinessNamesByCategory(refId: ObjectId, catName: string) {
        try {
            const rawExpenses = await db.GetDocument(BusinessModel.expenseCollection, { _id: new ObjectId(refId) });

            if (!rawExpenses) {
                return { status: 404, error: "Expenses not found" };
            }

            const category = rawExpenses.categories.find((cat: Category) => cat.name === catName);
            if (!category) {
                return { status: 404, error: "Category not found" };
            }

            const businessNames = category.Businesses.map((business: Business) => business.name);
            return {
                status: 200,
                businessNames
            };
        } catch (error) {
            console.error("Error fetching business names:", error);
            return { status: 500, error: "Internal server error" };
        }
    }

    static async deleteBusiness(refId: ObjectId, catName: string, busName: string) {
        try {
            const result = await db.UpdateDocument(
                BusinessModel.expenseCollection,
                { _id: new ObjectId(refId), "categories.name": catName },
                { $pull: { "categories.$.Businesses": { name: busName } } }
            );

            if (!result || result.modifiedCount === 0) {
                return { status: 404, error: "Expense, category, or business not found" };
            } else {
                return { status: 200, message: "Business deleted successfully" };
            }
        } catch (error) {
            console.error("Error deleting business:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
}