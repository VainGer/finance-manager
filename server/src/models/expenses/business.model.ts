import db from "../../server";
import { Business, Category } from "../../types/expenses.types";
import { ObjectId } from "mongodb";

export default class BusinessModel {
    private static expensesCollection: string = "expenses";

    static async createBusiness(refId: ObjectId, categoryName: string, business: Business) {
        try {
            const result = await db.UpdateDocument(BusinessModel.expensesCollection,
                { _id: new ObjectId(refId), "categories.name": categoryName },
                { $addToSet: { "categories.$.Businesses": business } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to create business" };
            }
            return { success: true, message: "Business created successfully" };
        } catch (error) {
            console.error("Error in BusinessModel.createBusiness", error);
            throw new Error("Failed to create business");
        }
    }

    static async renameBusiness(refId: ObjectId, categoryName: string, oldName: string, newName: string) {
        try {
            const result = await db.UpdateDocument(
                BusinessModel.expensesCollection,
                { _id: new ObjectId(refId), "categories.name": categoryName, "categories.Businesses.name": oldName },
                { $set: { "categories.$.Businesses.$[bizFilter].name": newName } },
                {
                    arrayFilters: [{ "bizFilter.name": oldName }]
                });

            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Business not found or name is the same" };
            }
            return { success: true, message: "Business renamed successfully" };
        } catch (error) {
            console.error("Error in BusinessModel.renameBusiness", error);
            throw new Error("Failed to rename business");
        }
    }

    static async deleteBusiness(refId: ObjectId, categoryName: string, businessName: string) {
        try {
            const result = await db.UpdateDocument(
                BusinessModel.expensesCollection,
                { _id: new ObjectId(refId), "categories.name": categoryName },
                { $pull: { "categories.$.Businesses": { name: businessName } } });

            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Business not found" };
            }
            return { success: true, message: "Business deleted successfully" };
        } catch (error) {
            console.error("Error in BusinessModel.deleteBusiness", error);
            throw new Error("Failed to delete business");
        }
    }

}