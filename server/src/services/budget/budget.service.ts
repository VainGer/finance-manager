import { Business, Category, CategoryBudget } from "../../types/expenses.types";
import * as AppErrors from "../../errors/AppError";
import CategoriesModel from "../../models/expenses/categories.model";
import BudgetModel from "../../models/budget/budget.model";
import ProfileModel from "../../models/profile/profile.model";
import TransactionModel from "../../models/expenses/transaction.model";
import { ObjectId } from "mongodb";
import { ProfileBudget } from "../../types/profile.types";
import AdminService from "../admin/admin.service";

export default class BudgetService {


    static async createBudget(budgetData: {
        username: string;
        profileName: string;
        refId: string;
        profileBudget: { startDate: string; endDate: string; amount: number };
        categoriesBudgets: { categoryName: string; amount: number }[];
    }) {
        const { username, profileName, refId, profileBudget, categoriesBudgets } = budgetData;
        if (
            !refId || !profileBudget || !profileBudget.startDate ||
            !profileBudget.endDate || !profileBudget.amount || !categoriesBudgets
        ) {
            throw new AppErrors.ValidationError("Reference ID, profile budget data and categories budgets are required.");
        }

        const validDatesInBudgets = await this.validateBudgetDates(
            username,
            profileName,
            profileBudget.startDate,
            profileBudget.endDate
        );
        if (!validDatesInBudgets) {
            throw new AppErrors.ConflictError("Invalid budget dates");
        }

        const existingProfile = await ProfileModel.findProfile(username, profileName);
        const existingCategories = await CategoriesModel.getCategories(refId);
        if (!existingProfile || !existingCategories) {
            throw new AppErrors.NotFoundError("Profile or Categories not found.");
        }

        for (const category of categoriesBudgets) {
            if (!existingCategories.categories.find((cat: Category) => cat.name === category.categoryName)) {
                throw new AppErrors.ValidationError(`Category '${name}' does not exist in DB`);
            }
        }
        const categoriesNames = categoriesBudgets.map(cat => cat.categoryName);

        const startDateObj = new Date(profileBudget.startDate);
        startDateObj.setHours(0, 0, 0, 0);

        const endDateObj = new Date(profileBudget.endDate);
        endDateObj.setHours(23, 59, 59, 999);

        profileBudget.startDate = startDateObj.toISOString();
        profileBudget.endDate = endDateObj.toISOString();

        const budgetId = new ObjectId();
        const { preparedBudgets, totalSpent } = this.prepareCategoriesBudgets(
            categoriesBudgets,
            existingCategories.categories,
            budgetId,
            profileBudget.startDate,
            profileBudget.endDate
        );

        const profileBudgetWithSpent: ProfileBudget = {
            _id: budgetId,
            startDate: profileBudget.startDate,
            endDate: profileBudget.endDate,
            amount: profileBudget.amount,
            spent: totalSpent
        };

        const budgetResult = await BudgetModel.createBudget(
            username,
            profileName,
            refId,
            profileBudgetWithSpent,
            preparedBudgets,
            !existingProfile.parentProfile
        );
        if (!budgetResult || !budgetResult.success) {
            throw new AppErrors.DatabaseError(budgetResult?.message || "Failed to create budget");
        }

        await TransactionModel.updatetUnexpected(
            refId,
            profileBudget.startDate,
            profileBudget.endDate,
            categoriesNames,
            false
        );

        AdminService.logAction({
            type: "create",
            executeAccount: username,
            executeProfile: profileName,
            action: "create_budget",
            target: {
                profileBudget: budgetData.profileBudget,
                categoriesBudgets: budgetData.categoriesBudgets
            }
        });
        return { success: true, message: "Budget created successfully" };
    }

    private static prepareCategoriesBudgets(
        inputBudgets: { categoryName: string; amount: number }[],
        existingCategories: Category[],
        id: ObjectId,
        startDate: string,
        endDate: string
    ) {
        const preparedBudgets: CategoryBudget[] = [];
        let totalSpent = 0;

        for (const inputBudget of inputBudgets) {
            const category = existingCategories.find(cat => cat.name === inputBudget.categoryName);
            const spent = category ? this.transactionsSumInCategoryInDateRange(category, startDate, endDate) : 0;
            totalSpent += spent;
            preparedBudgets.push({
                _id: id,
                categoryName: category?.name,
                startDate,
                endDate,
                amount: inputBudget.amount,
                spent
            });
        }

        return { preparedBudgets, totalSpent };
    }

    static async getCategoriesBudgets(refId: string) {
        if (!refId) {
            throw new AppErrors.ValidationError("Reference ID is required.");
        }

        const categoriesDoc = await CategoriesModel.getCategories(refId);
        if (!categoriesDoc) {
            throw new AppErrors.NotFoundError("Categories not found.");
        }

        const categories = categoriesDoc.categories as Category[];

        const allBudgetPeriods: { key: string, startDate: string, endDate: string }[] = [];

        for (const cat of categories) {
            for (const b of cat.budgets) {
                const key = `${b.startDate}_${b.endDate}`;
                if (!allBudgetPeriods.find(p => p.key === key)) {
                    allBudgetPeriods.push({
                        key,
                        startDate: b.startDate.toString(),
                        endDate: b.endDate.toString()
                    });
                }
            }
        }

        const unexpectedExpenses = [];
        for (const period of allBudgetPeriods) {
            const result = await TransactionModel.getTransactionsInDateRange(
                refId,
                period.startDate,
                period.endDate,
                true
            );
            if (result && result.length > 0) {
                unexpectedExpenses.push(result);
            }
        }
        const categoriesBudgets = categories.map(cat => {
            return {
                name: cat.name,
                budgets: cat.budgets
            }
        });

        return {
            success: true,
            categoriesBudgets,
            unexpectedExpenses
        };
    }


    static async updateCategoryBudgetSpent(refId: string, categoryName: string, budgetId: string, diff: number) {
        if (!refId || !categoryName || !budgetId || diff === undefined) {
            throw new AppErrors.ValidationError(
                "Reference ID, category name, budget ID and difference amount are required."
            );
        }

        const existingCategories = await CategoriesModel.getCategories(refId);
        if (!existingCategories) {
            throw new AppErrors.NotFoundError("Expenses document not found.");
        }

        const category = existingCategories.categories.find((cat: Category) => cat.name === categoryName);
        if (!category) {
            throw new AppErrors.NotFoundError(`Category '${categoryName}' not found.`);
        }

        const budget = category.budgets.find((b: CategoryBudget) => b._id.toString() === budgetId);
        if (!budget) {
            return { success: true, message: "No budget to update" };
        }

        const result = await BudgetModel.updateCategoryBudgetSpent(refId, categoryName, budgetId, diff);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to update budget spent for category '${categoryName}'.`);
        }

        AdminService.logAction({
            type: "update",
            executeAccount: existingCategories.username,
            executeProfile: existingCategories.profileName,
            action: "update_category_budget_spent",
            target: { refId, categoryName, budgetId, diff }
        });

        return result;
    }

    static async addBudgetToChild(username: string, profileName: string, budgetData: { startDate: string; endDate: string; amount: number }) {
        if (!username || !profileName || !budgetData) {
            throw new AppErrors.ValidationError("Username, profile name, and budget data are required.");
        }
        const result = await BudgetModel.addBudgetToChild(username, profileName, budgetData);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to add budget to child profile '${profileName}'.`);
        }
        AdminService.logAction({
            type: "create",
            executeAccount: username,
            executeProfile: "parent profile",
            action: "add_budget_to_child",
            target: `${profileName} ${budgetData.startDate} ${budgetData.endDate} ${budgetData.amount}`
        });
        return result;
    }

    static async updateBudgetSpentOnTransaction(username: string, profileName: string, budgetId: string, tAmount: number) {
        if (!username || !profileName || !budgetId || tAmount === undefined) {
            throw new AppErrors.ValidationError("Username, profile name, budget ID, and transaction amount are required.");
        }
        const result = await BudgetModel.updateBudgetSpentOnTransaction(username, profileName, budgetId, tAmount);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to update budget spent for profile '${profileName}'.`);
        }
        AdminService.logAction({
            type: "update",
            executeAccount: username,
            executeProfile: profileName,
            action: "update_budget_spent_on_transaction",
            target: { budgetId, tAmount }
        });
        return result;
    }

    static async addChildBudgets(username: string, profileName: string, budget: { startDate: string; endDate: string; amount: number }) {
        if (!username || !profileName || !budget || !budget.startDate || !budget.endDate || !budget.amount) {
            throw new AppErrors.ValidationError("Username, profile name and budget data are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const foundNewBudgets = await this.getChildBudgets(username, profileName);
        if (foundNewBudgets.budgets && foundNewBudgets.budgets.length > 0) {
            const newStart = new Date(budget.startDate);
            const newEnd = new Date(budget.endDate);
            const overlappingDates = foundNewBudgets.budgets.some((b: any) => {
                const budgetStart = new Date(b.startDate);
                const budgetEnd = new Date(b.endDate);
                return (
                    (newStart >= budgetStart && newStart <= budgetEnd) ||
                    (newEnd >= budgetStart && newEnd <= budgetEnd) ||
                    (newStart <= budgetStart && newEnd >= budgetEnd) ||
                    (newStart >= budgetStart && newEnd <= budgetEnd)
                );
            });
            if (overlappingDates) {
                throw new AppErrors.ConflictError("Budget dates overlap with existing budgets");
            }
        }
        const validDatesInBudgets = await this.validateBudgetDates(username, profileName, budget.startDate, budget.endDate);
        if (!validDatesInBudgets) {
            throw new AppErrors.ConflictError("Invalid budget dates");
        }
        const result = await BudgetModel.addBudgetToChild(username, profileName, budget);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError("Failed to add budget to child profile");
        }
        return result;
    }

    static async validateBudgetDates(username: string, profileName: string, startDate: string, endDate: string) {
        if (!username || !profileName || !startDate || !endDate) {
            throw new AppErrors.ValidationError("Username, profile name, start date and end date are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }

        const budgets = profile.budgets || [];
        if (budgets.length === 0) {
            return { success: true, message: "No budgets found for validation" };
        }

        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);

        const overlapingDates = budgets.some((budget: ProfileBudget) => {
            const budgetStart = new Date(budget.startDate);
            const budgetEnd = new Date(budget.endDate);
            return (
                (newStart >= budgetStart && newStart <= budgetEnd) ||
                (newEnd >= budgetStart && newEnd <= budgetEnd) ||
                (newStart <= budgetStart && newEnd >= budgetEnd) ||
                (newStart >= budgetStart && newEnd <= budgetEnd)
            );
        });

        if (overlapingDates) {
            throw new AppErrors.ConflictError("Budget dates overlap with existing budgets");
        }

        return { success: true, message: "Budget dates are valid" };
    }

    static async getChildBudgets(username: string, profileName: string) {
        if (!username || !profileName) {
            throw new AppErrors.ValidationError("Username and profile name are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const budgetsToDistribute = profile.newBudgets;
        return { success: true, budgets: budgetsToDistribute || [] };
    }

    static async getBudgets(username: string, profileName: string) {
        if (!username || !profileName) {
            throw new AppErrors.ValidationError("Username and profile name are required");
        }

        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }

        const profileBudgets = profile.budgets;
        if (!profileBudgets || profileBudgets.length === 0) {
            return { success: true, budgets: { profile: [], categories: [] } };
        }

        const { categoriesBudgets, unexpectedExpenses } = await this.getCategoriesBudgets(profile.expenses);
        const unexpectedData = unexpectedExpenses[0] as any[];
        if (!unexpectedData || unexpectedData.length === 0) {
            return { success: true, budgets: { profile: profileBudgets, categories: categoriesBudgets } };
        }
        const unexpectedMap = new Map<string, any>();
        for (const cat of unexpectedData) {
            unexpectedMap.set(cat.name, cat);
        }

        for (const pb of profileBudgets) {
            const start = new Date(pb.startDate);
            const end = new Date(pb.endDate);
            for (const cb of categoriesBudgets) {
                if (cb.budgets.some(b => b._id.toString() === pb._id.toString())) continue;

                const unexpectedBudget = {
                    _id: pb._id,
                    startDate: pb.startDate,
                    endDate: pb.endDate,
                    amount: 0,
                    spent: 0,
                    unexpected: true
                };

                const expCat = unexpectedMap.get(cb.name);
                if (expCat) {
                    for (const bus of expCat.Businesses) {
                        for (const arr of bus.transactionsArray) {
                            for (const tx of arr.transactions) {
                                const txDate = new Date(tx.date);
                                if (txDate >= start && txDate <= end) {
                                    unexpectedBudget.spent += tx.amount;
                                }
                            }
                        }
                    }
                }

                if (unexpectedBudget.spent > 0) {
                    cb.budgets.push(unexpectedBudget);
                }
            }
        }

        return { success: true, budgets: { profile: profileBudgets, categories: categoriesBudgets } };
    }

    static async deleteBudgets(username: string, profileName: string, budgetId: string, byAdmin = false) {
        if (!username || !profileName || !budgetId) {
            throw new AppErrors.ValidationError("Username, profile name and budget ID are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const budget = profile.budgets.find((b: ProfileBudget) => b._id.toString() === budgetId);
        if (budget) {
            const allCategoryBudgets =
                await this.getCategoriesBudgets(profile.expenses) as {
                    success: boolean, categoriesBudgets: {
                        name: string,
                        budgets: CategoryBudget[]
                    }[]
                };
            const categoryNames = allCategoryBudgets.categoriesBudgets
                .filter(cat =>
                    cat.budgets.some(b => b._id.toString() === budget._id.toString())
                )
                .map(cat => cat.name);
            if (categoryNames) {
                await TransactionModel.updatetUnexpected(
                    profile.expenses,
                    budget.startDate,
                    budget.endDate,
                    categoryNames,
                    true
                );
            }
        }
        const result = await BudgetModel.deleteBudget(username, profileName, budgetId, profile.expenses);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to delete budget with ID '${budgetId}'`);
        }
        if (!byAdmin) {
            AdminService.logAction({
                type: "delete",
                executeAccount: username,
                executeProfile: profileName,
                action: "delete_budget",
                target: { budgetId }
            });
        }
        return result;
    }

    private static transactionsSumInCategoryInDateRange(category: Category, startDate: string, endDate: string) {
        let sum = 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        category.Businesses.forEach((business: Business) => {
            business.transactionsArray.forEach(monthlyTransactions => {
                monthlyTransactions.transactions.forEach(transaction => {
                    const transactionDate = new Date(transaction.date);
                    if (transactionDate >= start && transactionDate <= end) {
                        sum += transaction.amount;
                    }
                });
            });
        });
        return sum;
    }
}
