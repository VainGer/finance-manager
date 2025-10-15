"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppErrors = __importStar(require("../../errors/AppError"));
const categories_model_1 = __importDefault(require("../../models/expenses/categories.model"));
const budget_model_1 = __importDefault(require("../../models/budget/budget.model"));
const profile_model_1 = __importDefault(require("../../models/profile/profile.model"));
const mongodb_1 = require("mongodb");
const admin_service_1 = __importDefault(require("../admin/admin.service"));
class BudgetService {
    static async createBudget(budgetData) {
        const { username, profileName, refId, profileBudget, categoriesBudgets } = budgetData;
        if (!refId || !profileBudget || !profileBudget.startDate || !profileBudget.endDate || !profileBudget.amount || !categoriesBudgets) {
            throw new AppErrors.ValidationError("Reference ID, profile budget data and categories budgets are required.");
        }
        const validDatesInBudgets = await this.validateBudgetDates(username, profileName, profileBudget.startDate, profileBudget.endDate);
        if (!validDatesInBudgets) {
            throw new AppErrors.ConflictError("Invalid budget dates");
        }
        const existingProfile = await profile_model_1.default.findProfile(username, profileName);
        const existingCategories = await categories_model_1.default.getCategories(refId);
        if (!existingProfile || !existingCategories) {
            throw new AppErrors.NotFoundError("Profile or Categories not found.");
        }
        for (const category of existingCategories.categories) {
            if (!categoriesBudgets.find(cat => cat.categoryName === category.name)) {
                throw new AppErrors.ValidationError(`Budget for category '${category.name}' is missing.`);
            }
        }
        for (const budget of categoriesBudgets) {
            if (!existingCategories.categories.find((cat) => cat.name === budget.categoryName)) {
                throw new AppErrors.ValidationError(`Category '${budget.categoryName}' does not exist in DB`);
            }
        }
        const budgetId = new mongodb_1.ObjectId();
        const { preparedBudgets, totalSpent } = this.prepareCategoriesBudgets(categoriesBudgets, existingCategories.categories, budgetId, profileBudget.startDate, profileBudget.endDate);
        const profileBudgetWithSpent = {
            _id: budgetId,
            startDate: profileBudget.startDate,
            endDate: profileBudget.endDate,
            amount: profileBudget.amount,
            spent: totalSpent
        };
        const budgetResult = await budget_model_1.default.createBudget(username, profileName, refId, profileBudgetWithSpent, preparedBudgets, !existingProfile.parentProfile);
        if (!budgetResult || !budgetResult.success) {
            throw new AppErrors.DatabaseError(budgetResult?.message || "Failed to create budget");
        }
        admin_service_1.default.logAction({
            type: 'create',
            executeAccount: budgetData.username,
            executeProfile: budgetData.profileName,
            action: 'create_budget',
            target: {
                profileBudget: budgetData.profileBudget,
                categoriesBudgets: budgetData.categoriesBudgets
            }
        });
        return { success: true, message: "Budget created successfully" };
    }
    static prepareCategoriesBudgets(inputBudgets, existingCategories, id, startDate, endDate) {
        const preparedBudgets = [];
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
    static async getCategoriesBudgets(refId) {
        if (!refId) {
            throw new AppErrors.ValidationError("Reference ID is required.");
        }
        const categories = await categories_model_1.default.getCategories(refId);
        if (!categories) {
            throw new AppErrors.NotFoundError("Categories not found.");
        }
        const categoriesBudgets = categories.categories.map((category) => ({
            name: category.name,
            budgets: category.budgets
        }));
        return { success: true, categoriesBudgets };
    }
    static async updateCategoryBudgetSpent(refId, categoryName, budgetId, diff) {
        if (!refId || !categoryName || !budgetId || diff === undefined) {
            throw new AppErrors.ValidationError("Reference ID, category name, budget ID and difference amount are required.");
        }
        const existingCategories = await categories_model_1.default.getCategories(refId);
        if (!existingCategories) {
            throw new AppErrors.NotFoundError("Expenses document not found.");
        }
        const category = existingCategories.categories.find((cat) => cat.name === categoryName);
        if (!category) {
            throw new AppErrors.NotFoundError(`Category '${categoryName}' not found.`);
        }
        const budget = category.budgets.find((b) => b._id.toString() === budgetId);
        if (!budget) {
            return { success: true, message: "No budget to update" };
        }
        const result = await budget_model_1.default.updateCategoryBudgetSpent(refId, categoryName, budgetId, diff);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to update budget spent for category '${categoryName}'.`);
        }
        admin_service_1.default.logAction({
            type: 'update',
            executeAccount: existingCategories.username,
            executeProfile: existingCategories.profileName,
            action: 'update_category_budget_spent',
            target: { refId, categoryName, budgetId, diff }
        });
        return result;
    }
    static async addBudgetToChild(username, profileName, budgetData) {
        if (!username || !profileName || !budgetData) {
            throw new AppErrors.ValidationError("Username, profile name, and budget data are required.");
        }
        const result = await budget_model_1.default.addBudgetToChild(username, profileName, budgetData);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to add budget to child profile '${profileName}'.`);
        }
        admin_service_1.default.logAction({
            type: 'create',
            executeAccount: username,
            executeProfile: "parent profile",
            action: 'add_budget_to_child',
            target: profileName + " " + budgetData.startDate + " " + budgetData.endDate + " " + budgetData.amount
        });
        return result;
    }
    static async updateBudgetSpentOnTransaction(username, profileName, budgetId, tAmount) {
        if (!username || !profileName || !budgetId || tAmount === undefined) {
            throw new AppErrors.ValidationError("Username, profile name, budget ID, and transaction amount are required.");
        }
        const result = await budget_model_1.default.updateBudgetSpentOnTransaction(username, profileName, budgetId, tAmount);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to update budget spent for profile '${profileName}'.`);
        }
        admin_service_1.default.logAction({
            type: 'update',
            executeAccount: username,
            executeProfile: profileName,
            action: 'update_budget_spent_on_transaction',
            target: { budgetId, tAmount }
        });
        return result;
    }
    static async addChildBudgets(username, profileName, budget) {
        if (!username || !profileName || !budget || !budget.startDate || !budget.endDate || !budget.amount) {
            throw new AppErrors.ValidationError("Username, profile name and budget data are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const foundNewBudgets = await this.getChildBudgets(username, profileName);
        if (foundNewBudgets.budgets && foundNewBudgets.budgets.length > 0) {
            const newStart = new Date(budget.startDate);
            const newEnd = new Date(budget.endDate);
            const overlappingDates = foundNewBudgets.budgets.some((b) => {
                const budgetStart = new Date(b.startDate);
                const budgetEnd = new Date(b.endDate);
                return ((newStart >= budgetStart && newStart <= budgetEnd) ||
                    (newEnd >= budgetStart && newEnd <= budgetEnd) ||
                    (newStart <= budgetStart && newEnd >= budgetEnd) ||
                    (newStart >= budgetStart && newEnd <= budgetEnd));
            });
            if (overlappingDates) {
                throw new AppErrors.ConflictError("Budget dates overlap with existing budgets");
            }
        }
        const validDatesInBudgets = await this.validateBudgetDates(username, profileName, budget.startDate, budget.endDate);
        if (!validDatesInBudgets) {
            throw new AppErrors.ConflictError("Invalid budget dates");
        }
        const result = await budget_model_1.default.addBudgetToChild(username, profileName, budget);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError("Failed to add budget to child profile");
        }
        return result;
    }
    static async validateBudgetDates(username, profileName, startDate, endDate) {
        if (!username || !profileName || !startDate || !endDate) {
            throw new AppErrors.ValidationError("Username, profile name, start date and end date are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const budgets = profile.budgets || [];
        if (budgets.length === 0) {
            return { success: true, message: "No budgets found for validation" };
        }
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);
        const overlapingDates = budgets.some((budget) => {
            const budgetStart = new Date(budget.startDate);
            const budgetEnd = new Date(budget.endDate);
            return ((newStart >= budgetStart && newStart <= budgetEnd) ||
                (newEnd >= budgetStart && newEnd <= budgetEnd) ||
                (newStart <= budgetStart && newEnd >= budgetEnd) ||
                (newStart >= budgetStart && newEnd <= budgetEnd));
        });
        if (overlapingDates) {
            throw new AppErrors.ConflictError("Budget dates overlap with existing budgets");
        }
        return { success: true, message: "Budget dates are valid" };
    }
    static async getChildBudgets(username, profileName) {
        if (!username || !profileName) {
            throw new AppErrors.ValidationError("Username and profile name are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const budgetsToDistribute = profile.newBudgets;
        return { success: true, budgets: budgetsToDistribute || [] };
    }
    static async getBudgets(username, profileName) {
        if (!username || !profileName) {
            throw new AppErrors.ValidationError("Username and profile name are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const profileBudget = profile.budgets;
        if (!profileBudget) {
            throw new AppErrors.NotFoundError("No budgets found for this profile");
        }
        const categoriesBudgets = await this.getCategoriesBudgets(profile.expenses);
        return { success: true, budgets: { profile: profileBudget, categories: categoriesBudgets.categoriesBudgets } };
    }
    static async deleteBudgets(username, profileName, budgetId, byAdmin = false) {
        if (!username || !profileName || !budgetId) {
            throw new AppErrors.ValidationError("Username, profile name and budget ID are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile) {
            throw new AppErrors.NotFoundError("Profile not found");
        }
        const result = await budget_model_1.default.deleteBudget(username, profileName, budgetId, profile.expenses);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to delete budget with ID '${budgetId}'`);
        }
        if (!byAdmin) {
            admin_service_1.default.logAction({
                type: 'delete',
                executeAccount: username,
                executeProfile: profileName,
                action: 'delete_budget',
                target: { budgetId }
            });
        }
        return result;
    }
    static transactionsSumInCategoryInDateRange(category, startDate, endDate) {
        let sum = 0;
        category.Businesses.forEach((business) => {
            business.transactionsArray.forEach((monthlyTransactions) => {
                monthlyTransactions.transactions.forEach((transaction) => {
                    const transactionDate = new Date(transaction.date);
                    if (transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate)) {
                        sum += transaction.amount;
                    }
                });
            });
        });
        return sum;
    }
}
exports.default = BudgetService;
//# sourceMappingURL=budget.service.js.map