"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const server_1 = __importDefault(require("../../server"));
class BudgetModel {
    static expenseCollection = "expenses";
    static profileCollection = "profiles";
    static async updateCategoryBudgetSpent(refId, catName, budgetId, amount) {
        try {
            const result = await server_1.default.UpdateDocument(this.expenseCollection, { _id: new mongodb_1.ObjectId(refId) }, { $inc: { "categories.$[cat].budgets.$[budget].spent": amount } }, {
                arrayFilters: [
                    { "cat.name": catName },
                    { "budget._id": new mongodb_1.ObjectId(budgetId) }
                ]
            });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to update category budget spent" };
            }
            return { success: true, message: "Category budget spent updated successfully" };
        }
        catch (error) {
            console.error("Error in BudgetModel.updateCategoryBudgetSpent", error);
            throw new Error("Failed to update category budget spent");
        }
    }
    static async addBudgetToChild(username, profileName, budgetData) {
        try {
            const formattedBudgetData = {
                startDate: new Date(budgetData.startDate).toISOString(),
                endDate: new Date(budgetData.endDate).toISOString(),
                amount: budgetData.amount
            };
            const result = await server_1.default.UpdateDocument(this.profileCollection, { username, profileName }, { $push: { newBudgets: formattedBudgetData } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Child profile not found or budget is the same" };
            }
            return { success: true, message: "Budget added to child profile successfully" };
        }
        catch (error) {
            console.error("Error in ProfileModel.addBudgetToChild", error);
            throw new Error("Failed to add budget to child profile");
        }
    }
    static async createBudget(username, profileName, refId, profileBudget, categoriesBudgets, childProfile) {
        try {
            const operations = [
                {
                    collection: this.profileCollection,
                    query: { username, profileName },
                    update: { $push: { budgets: profileBudget } }
                },
                ...categoriesBudgets.map(({ categoryName, ...catBudget }) => ({
                    collection: this.expenseCollection,
                    query: { _id: new mongodb_1.ObjectId(refId), "categories.name": categoryName },
                    update: { $addToSet: { "categories.$.budgets": catBudget } }
                }))
            ];
            if (childProfile) {
                console.log("Removing newBudget from child profile");
                operations.push({
                    collection: this.profileCollection,
                    query: { username, profileName },
                    update: {
                        $pull: {
                            newBudgets: {
                                startDate: profileBudget.startDate,
                                endDate: profileBudget.endDate,
                                amount: profileBudget.amount
                            }
                        }
                    }
                });
            }
            const transactionResult = await server_1.default.TransactionUpdateMany(operations);
            if (!transactionResult || !transactionResult.success) {
                return { success: false, message: transactionResult?.message || "Failed to create budget" };
            }
            return { success: true, message: "Budget created successfully" };
        }
        catch (error) {
            console.error("Error in ProfileModel.createBudget", error);
            throw new Error("Failed to create budget");
        }
    }
    static async updateBudgetSpentOnTransaction(username, profileName, budgetId, tAmount) {
        try {
            const result = await server_1.default.UpdateDocument(this.profileCollection, { username, profileName }, {
                $inc: { "budgets.$[budget].spent": tAmount }
            }, {
                arrayFilters: [
                    { "budget._id": new mongodb_1.ObjectId(budgetId) }
                ]
            });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Profile or budget not found, or amount was zero" };
            }
            return { success: true, message: "Budget spent updated successfully" };
        }
        catch (error) {
            console.error("Error in ProfileModel.updateBudgetSpentOnTransaction", error);
            throw new Error("Failed to update budget spent");
        }
    }
    static async deleteBudget(username, profileName, budgetId, refId) {
        try {
            const expensesId = refId instanceof mongodb_1.ObjectId ? refId.toString() : refId;
            const operations = [{
                    collection: this.profileCollection,
                    query: { username, profileName },
                    update: { $pull: { budgets: { _id: new mongodb_1.ObjectId(budgetId) } } }
                },
                {
                    collection: this.expenseCollection,
                    query: {
                        _id: new mongodb_1.ObjectId(expensesId),
                        "categories.budgets._id": new mongodb_1.ObjectId(budgetId)
                    },
                    update: {
                        $pull: {
                            "categories.$[].budgets": { _id: new mongodb_1.ObjectId(budgetId) }
                        }
                    }
                }
            ];
            const result = await server_1.default.TransactionUpdateMany(operations);
            if (!result || !result.success) {
                return { success: false, message: "Budget not found" };
            }
            return { success: true, message: "Budget deleted successfully" };
        }
        catch (error) {
            console.error("Error in ProfileModel.deleteBudget", error);
            throw new Error("Failed to delete budget");
        }
    }
}
exports.default = BudgetModel;
//# sourceMappingURL=budget.model.js.map