import LLM from "../../utils/LLM";
import BudgetService from "../budget/budget.service";
import CategoryService from "../expenses/category.service";
import { HistoryDoc, AIHistoryEntry, AICoachOutput, AICategoryInsight, AICoachInput } from "../../types/ai.types";
import { ProfileBudget } from "../../types/profile.types";
import { CategoryBudget, CategoryForAI, GroupedTransactions } from "../../types/expenses.types";
import ProfileModel from "../../models/profile/profile.model";
import TransactionModel from "../../models/expenses/transaction.model";
import * as AppError from "../../errors/AppError";
import AiModel from "../../models/ai/ai.model";


export default class AiService {

    public static async generateCoachingReport(username: string, profileName: string, profileId: string
    ): Promise<AICoachOutput> {
        if (!username || !profileName || !profileId) {
            throw new AppError.BadRequestError("Missing required parameters");
        }
        const aiInputObj = await this.prepareInput(username, profileName, profileId) as AICoachInput;
        const aiInputStr = JSON.stringify(aiInputObj);
        const result = await LLM.generateCoachAdvice(aiInputStr) as AICoachOutput;
        if (!result) {
            throw new Error("AI coaching advice generation failed");
        }
        return result;
    }

    public static async getHistory(profileId: string): Promise<AIHistoryEntry[]> {
        if (!profileId) {
            throw new AppError.BadRequestError("Profile ID is required");
        }
        const history = await AiModel.getAllHistory(profileId) as AIHistoryEntry[];
        return history;
    }


    private static async prepareInput(username: string, profileName: string, profileId: string
    ): Promise<AICoachInput> {
        const profile = await ProfileModel.findProfileById(username, profileId);
        if (!profile) {
            throw new AppError.NotFoundError("Profile not found");
        }
        const budgetsRes = await BudgetService.getBudgets(username, profileName);
        if (!budgetsRes) {
            throw new AppError.NotFoundError("Budgets not found");
        }

        const profileBudgets = budgetsRes.budgets.profile;
        const categoriesBudgets = budgetsRes.budgets.categories;
        const now = new Date();
        const THREE_MONTHS_MS = 1000 * 60 * 60 * 24 * 90;

        const closedBudgets = profileBudgets.filter((b: ProfileBudget) => {
            const end = new Date(b.endDate);
            const endedAgo = now.getTime() - end.getTime();
            return end < now && endedAgo <= THREE_MONTHS_MS;
        });

        if (closedBudgets.length === 0) {
            throw new AppError.BadRequestError("No closed budgets found within the last 3 months");
        }

        const aiHistory = await AiModel.getRecentHistory(profileId) as AIHistoryEntry[];
        const analyzedHashes = new Set(aiHistory.map(entry => entry.inputHash));

        const sortedClosedBudgets = closedBudgets.sort(
            (a: ProfileBudget, b: ProfileBudget) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );

        const targetBudget = sortedClosedBudgets.find((b: ProfileBudget) => {
            const hash = `${b.startDate}_${b.endDate}`;
            return !analyzedHashes.has(hash);
        });

        if (!targetBudget) {
            throw new AppError.BadRequestError("All closed budgets within the last 3 months have already been analyzed by AI");
        }

        const matchingCategoryBudgets = categoriesBudgets.filter(
            (cb: CategoryBudget) => cb._id.toString() === targetBudget._id.toString()
        );

        const budgetRelevantExpenses = await TransactionModel.getTransactionsInDateRange(
            profile.expenses,
            targetBudget.startDate,
            targetBudget.endDate
        ) as CategoryForAI[];

        return {
            recentlyClosedGlobalBudget: targetBudget,
            recentlyClosedCategoryBudgets: matchingCategoryBudgets,
            budgetRelevantExpenses,
            relevantAiHistory: aiHistory
        };
    }

}