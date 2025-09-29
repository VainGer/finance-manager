import { ObjectId } from "mongodb";
import CategoriesModel from "../expenses/categories.model";
import ProfileModel from "../profile/profile.model";
import db from "../../server";
import { CategoryBudget } from "../../types/expenses.types";
import { ProfileBudget } from "../../types/profile.types";

export default class BudgetModel {

    private static expenseCollection: string = "expenses";
    private static profileCollection: string = "profiles";

    static async createCategoriesBudgets(refId: string, budget: CategoryBudget, categoryName: string) {
        try {
            const result = await db.UpdateDocument(
                this.expenseCollection,
                { _id: new ObjectId(refId), "categories.name": categoryName },
                { $addToSet: { "categories.$.budgets": budget } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to create category budget" };
            }
            return { success: true, message: "Category budget created successfully" };
        } catch (error) {
            console.error("Error in BudgetModel.createCategoriesBudgets", error);
            throw new Error("Failed to create category budget");
        }
    }

    static async updateCategoryBudgetSpent(refId: string, catName: string, budgetId: string, amount: number) {
        try {
            const result = await db.UpdateDocument(
                this.expenseCollection,
                { _id: new ObjectId(refId) },
                { $inc: { "categories.$[cat].budgets.$[budget].spent": amount } },
                {
                    arrayFilters: [
                        { "cat.name": catName },
                        { "budget._id": new ObjectId(budgetId) }
                    ]
                }
            );
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Failed to update category budget spent" };
            }
            return { success: true, message: "Category budget spent updated successfully" };
        } catch (error) {
            console.error("Error in BudgetModel.updateCategoryBudgetSpent", error);
            throw new Error("Failed to update category budget spent");
        }
    }

    static async addBudgetToChild(username: string, profileName: string, budgetData: { startDate: Date, endDate: Date, amount: number }) {
        try {
            const formattedBudgetData = {
                startDate: new Date(budgetData.startDate).toISOString(),
                endDate: new Date(budgetData.endDate).toISOString(),
                amount: budgetData.amount
            };

            const result = await db.UpdateDocument(this.profileCollection,
                { username, profileName },
                { $push: { newBudgets: formattedBudgetData } });

            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Child profile not found or budget is the same" };
            }
            return { success: true, message: "Budget added to child profile successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.addBudgetToChild", error);
            throw new Error("Failed to add budget to child profile");
        }
    }

    static async pullChildBudget(username: string, profileName: string, startDate: Date, endDate: Date) {
        try {
            const markResult = await db.UpdateDocument(
                this.profileCollection,
                { username, profileName },
                { $set: { "newBudgets.$[budget]": null } },
                {
                    arrayFilters: [
                        {
                            "$and": [
                                { "budget.startDate": new Date(startDate).toISOString() },
                                { "budget.endDate": new Date(endDate).toISOString() }
                            ]
                        }
                    ]
                }
            );
            const pullResult = await db.UpdateDocument(
                this.profileCollection,
                { username, profileName },
                { $pull: { newBudgets: null } }
            );

            if ((!markResult || markResult.modifiedCount === 0) &&
                (!pullResult || pullResult.modifiedCount === 0)) {
                return { success: false, message: "Budget not found with the specified dates" };
            }

            return { success: true, message: "Child budget removed successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.pullChildBudget", error);
            throw new Error("Failed to pull child budget");
        }
    }

    static async createBudget(username: string, profileName: string, budgetData: ProfileBudget) {
        try {
            const result = await db.UpdateDocument(this.profileCollection,
                { username, profileName }, { $push: { budgets: budgetData } });
            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Profile not found or budget is the same" };
            }
            return { success: true, message: "Budget created successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.createBudget", error);
            throw new Error("Failed to create budget");
        }
    }


    static async updateBudgetSpentOnTransaction(username: string, profileName: string, budgetId: string, tAmount: number) {
        try {
            const result = await db.UpdateDocument(this.profileCollection,
                { username, profileName },
                {
                    $inc: { "budgets.$[budget].spent": tAmount }
                },
                {
                    arrayFilters: [
                        { "budget._id": new ObjectId(budgetId) }
                    ]
                }
            );

            if (!result || result.modifiedCount === 0) {
                return { success: false, message: "Profile or budget not found, or amount was zero" };
            }
            return { success: true, message: "Budget spent updated successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.updateBudgetSpentOnTransaction", error);
            throw new Error("Failed to update budget spent");
        }
    }

    static async deleteBudget(username: string, profileName: string, budgetId: string) {
        try {
            const profileResult = await db.UpdateDocument(this.profileCollection,
                { username, profileName },
                { $pull: { budgets: { _id: new ObjectId(budgetId) } } });
            const expenseResult = await db.UpdateDocument(this.expenseCollection,
                { username, profileName },
                { $pull: { budgets: { _id: new ObjectId(budgetId) } } });

            if ((!profileResult || profileResult.modifiedCount === 0) &&
                (!expenseResult || expenseResult.modifiedCount === 0)) {
                return { success: false, message: "Budget not found" };
            }

            return { success: true, message: "Budget deleted successfully" };
        } catch (error) {
            console.error("Error in ProfileModel.deleteBudget", error);
            throw new Error("Failed to delete budget");
        }
    }
}