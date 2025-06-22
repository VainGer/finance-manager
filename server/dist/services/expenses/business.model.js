"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const mongodb_1 = require("mongodb");
class BusinessModel {
    static expenseCollection = "expenses";
    static async addBusinessToCategory(refId, catName, name) {
        try {
            const newBusiness = {
                name,
                transactions: []
            };
            const result = await server_1.default.UpdateDocument(BusinessModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId), "categories.name": catName }, { $addToSet: { "categories.$.Businesses": newBusiness } });
            if (!result || result.modifiedCount === 0) {
                return { status: 404, error: "Expense or category not found, or business already exists" };
            }
            else {
                return { status: 201, message: "Business added to category successfully" };
            }
        }
        catch (error) {
            console.error("Error adding business to category:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
    static async renameBusiness(refId, catName, oldName, newName) {
        try {
            const result = await server_1.default.UpdateDocument(BusinessModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId), "categories.name": catName, "categories.Businesses.name": oldName }, { $set: { "categories.$.Businesses.$[bizFilter].name": newName } }, {
                arrayFilters: [{ "bizFilter.name": oldName }]
            });
            if (!result || result.modifiedCount === 0) {
                return { status: 404, error: "Expense, category, or business not found" };
            }
            else {
                return { status: 200, message: "Business renamed successfully" };
            }
        }
        catch (error) {
            console.error("Error renaming business:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
    static async getBusinessNamesByCategory(refId, catName) {
        try {
            const rawExpenses = await server_1.default.GetDocument(BusinessModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId) });
            if (!rawExpenses) {
                return { status: 404, error: "Expenses not found" };
            }
            const category = rawExpenses.categories.find((cat) => cat.name === catName);
            if (!category) {
                return { status: 404, error: "Category not found" };
            }
            const businessNames = category.Businesses.map((business) => business.name);
            return {
                status: 200,
                businessNames
            };
        }
        catch (error) {
            console.error("Error fetching business names:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
    static async deleteBusiness(refId, catName, busName) {
        try {
            const result = await server_1.default.UpdateDocument(BusinessModel.expenseCollection, { _id: new mongodb_1.ObjectId(refId), "categories.name": catName }, { $pull: { "categories.$.Businesses": { name: busName } } });
            if (!result || result.modifiedCount === 0) {
                return { status: 404, error: "Expense, category, or business not found" };
            }
            else {
                return { status: 200, message: "Business deleted successfully" };
            }
        }
        catch (error) {
            console.error("Error deleting business:", error);
            return { status: 500, error: "Internal server error" };
        }
    }
}
exports.default = BusinessModel;
//# sourceMappingURL=business.model.js.map