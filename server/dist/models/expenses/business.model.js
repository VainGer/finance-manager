"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const mongodb_1 = require("mongodb");
class BusinessModel {
    static expensesCollection = "expenses";
    static async createBusiness(refId, categoryName, business) {
        try {
            const result = await server_1.default.UpdateDocument(BusinessModel.expensesCollection, { _id: new mongodb_1.ObjectId(refId), "categories.name": categoryName }, { $addToSet: { "categories.$.Businesses": business } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to create business" };
            }
            return { success: true, message: "Business created successfully" };
        }
        catch (error) {
            console.error("Error in BusinessModel.createBusiness", error);
            throw new Error("Failed to create business");
        }
    }
    static async renameBusiness(refId, categoryName, oldName, newName) {
        try {
            const result = await server_1.default.UpdateDocument(BusinessModel.expensesCollection, { _id: new mongodb_1.ObjectId(refId), "categories.name": categoryName, "categories.Businesses.name": oldName }, { $set: { "categories.$.Businesses.$[bizFilter].name": newName } }, {
                arrayFilters: [{ "bizFilter.name": oldName }]
            });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Business not found or name is the same" };
            }
            return { success: true, message: "Business renamed successfully" };
        }
        catch (error) {
            console.error("Error in BusinessModel.renameBusiness", error);
            throw new Error("Failed to rename business");
        }
    }
    static async deleteBusiness(refId, categoryName, businessName) {
        try {
            const result = await server_1.default.UpdateDocument(BusinessModel.expensesCollection, { _id: new mongodb_1.ObjectId(refId), "categories.name": categoryName }, { $pull: { "categories.$.Businesses": { name: businessName } } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Business not found" };
            }
            return { success: true, message: "Business deleted successfully" };
        }
        catch (error) {
            console.error("Error in BusinessModel.deleteBusiness", error);
            throw new Error("Failed to delete business");
        }
    }
    static async updateBusinessBankName(refId, categoryName, businessName, bankName) {
        try {
            const result = await server_1.default.UpdateDocument(BusinessModel.expensesCollection, { _id: new mongodb_1.ObjectId(refId), "categories.name": categoryName, "categories.Businesses.name": businessName }, { $addToSet: { "categories.$.Businesses.$[bizFilter].bankNames": bankName } }, {
                arrayFilters: [{ "bizFilter.name": businessName }]
            });
            if (!result) {
                return { success: false, message: "Business not found" };
            }
            return { success: true, message: "Business bank name updated successfully" };
        }
        catch (error) {
            console.error("Error in BusinessModel.updateBusinessBankName", error);
            throw new Error("Failed to update business bank name");
        }
    }
}
exports.default = BusinessModel;
//# sourceMappingURL=business.model.js.map