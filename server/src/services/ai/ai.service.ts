import LLM from "../../utils/LLM";
import BudgetService from "../budget/budget.service";
import { HistoryDoc, AIHistoryEntry, AICoachOutput, AICoachInput } from "../../types/ai.types";
import { ProfileBudget } from "../../types/profile.types";
import { CategoryBudget, CategoryForAI } from "../../types/expenses.types";
import ProfileModel from "../../models/profile/profile.model";
import TransactionModel from "../../models/expenses/transaction.model";
import * as AppError from "../../errors/AppError";
import AiModel from "../../models/ai/ai.model";
import { ObjectId } from "mongodb";

export default class AiService {

    public static async generateCoachingReport(
        username: string,
        profileName: string,
        profileId: string
    ): Promise<AICoachOutput | null> {
        if (!username || !profileName || !profileId) {
            console.error("[AI] Missing required parameters in generateCoachingReport");
            return null;
        }
        try {
            try {
                await AiModel.updateHistoryStatus(profileId, "processing");
            } catch (statusErr) {
                console.error("[AI] Failed to update history status to 'processing':", statusErr);
            }

            const aiInputObj = await this.prepareInput(username, profileName, profileId);
            if (!aiInputObj) {
                console.warn("[AI] No valid input found for coaching generation");
                await AiModel.updateHistoryStatus(profileId, "idle");
                return null;
            }

            const aiInputStr = JSON.stringify(aiInputObj);
            const result = (await LLM.generateCoachAdvice(aiInputStr)) as AICoachOutput | null;

            if (!result) {
                console.error("[AI] LLM returned no result");
                await AiModel.updateHistoryStatus(profileId, "error");
                return null;
            }

            const { startDate, endDate } = aiInputObj.recentlyClosedGlobalBudget;
            const periodLabel = `${startDate} to ${endDate}`;

            const historyEntry: AIHistoryEntry = {
                _id: new ObjectId().toString(),
                profileId,
                periodLabel,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                inputHash: `${startDate}_${endDate}`,
                coachOutput: result,
                generatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            try {
                await AiModel.saveToHistory(profileId, historyEntry);
            } catch (saveErr) {
                console.error("[AI] Failed to save history entry:", saveErr);
            }

            return result;

        } catch (err) {
            console.error("[AI] Unexpected error in generateCoachingReport:", err);
            try {
                await AiModel.updateHistoryStatus(profileId, "error");
            } catch {
                // Avoid infinite loops if this fails too
            }
            return null;
        }
    }

    public static async getHistory(profileId: string): Promise<HistoryDoc> {
        if (!profileId) {
            throw new AppError.BadRequestError("Profile ID is required");
        }
        const history = await AiModel.getAllHistory(profileId) as HistoryDoc;
        if (!history) {
            throw new AppError.NotFoundError("History not found");
        }
        return history;
    }

    public static async checkHistoryStatus(profileId: string
    ): Promise<{ analyzeStatus: string, message: string }> {
        if (!profileId) {
            throw new AppError.BadRequestError("Profile ID is required");
        }
        const history = await AiModel.getAllHistory(profileId) as HistoryDoc;
        if (!history) {
            throw new AppError.NotFoundError("History not found");
        }
        const analyzeStatus = history.status;
        return { analyzeStatus, message: "History status retrieved successfully." };
    }


    private static async prepareInput(
        username: string,
        profileName: string,
        profileId: string
    ): Promise<AICoachInput | null> {
        try {
            const profile = await ProfileModel.findProfileById(username, profileId);
            if (!profile) {
                console.warn("[AI] Profile not found for:", { username, profileId });
                return null;
            }

            const budgetsRes = await BudgetService.getBudgets(username, profileName);
            if (!budgetsRes) {
                console.warn("[AI] Budgets not found for profile:", profileId);
                return null;
            }

            const profileBudgets = budgetsRes.budgets.profile as ProfileBudget[];
            const categoriesBudgets = budgetsRes.budgets.categories as CategoryBudget[];
            const now = new Date();
            const THREE_MONTHS_MS = 1000 * 60 * 60 * 24 * 90;

            const closedBudgets = profileBudgets.filter((b) => {
                const end = new Date(b.endDate);
                return end < now && now.getTime() - end.getTime() <= THREE_MONTHS_MS;
            });

            if (closedBudgets.length === 0) {
                console.info("[AI] No closed budgets in the last 3 months for:", profileId);
                return null;
            }

            const aiHistory = (await AiModel.getRecentHistory(profileId)) as AIHistoryEntry[];
            const analyzedHashes = new Set(aiHistory.map(entry => entry.inputHash));

            const sortedClosedBudgets = [...closedBudgets].sort(
                (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
            );

            const targetBudget = sortedClosedBudgets.find(b => {
                const hash = `${b.startDate}_${b.endDate}`;
                return !analyzedHashes.has(hash);
            });

            if (!targetBudget) {
                console.info("[AI] All recent budgets already analyzed for:", profileId);
                return null;
            }

            const matchingCategoryBudgets = categoriesBudgets.filter(
                cb => cb._id.toString() === targetBudget._id.toString()
            );

            const budgetRelevantExpenses = (await TransactionModel.getTransactionsInDateRange(
                profile.expenses,
                targetBudget.startDate.toISOString(),
                targetBudget.endDate.toISOString()
            )) as CategoryForAI[];

            return {
                recentlyClosedGlobalBudget: targetBudget,
                recentlyClosedCategoryBudgets: matchingCategoryBudgets,
                budgetRelevantExpenses,
                relevantAiHistory: aiHistory
            };
        } catch (err) {
            console.error("[AI] Error preparing input for profile:", profileId, err);
            return null;
        }
    }

}