import LLM from "../../utils/LLM";
import BudgetService from "../budget/budget.service";
import { HistoryDoc, AIHistoryEntry, AICoachOutput, AICoachInput, CategoryBudgetForAI } from "../../types/ai.types";
import { ProfileBudget } from "../../types/profile.types";
import { CategoryBudget, CategoryForAI } from "../../types/expenses.types";
import ProfileModel from "../../models/profile/profile.model";
import TransactionModel from "../../models/expenses/transaction.model";
import * as AppError from "../../errors/AppError";
import AiModel from "../../models/ai/ai.model";
import AdminService from "../admin/admin.service";
import { ObjectId } from "mongodb";

export default class AiService {

    public static async generateCoachingReport(
        username: string,
        profileName: string,
        profileId: string
    ) {
        if (!username || !profileName || !profileId) {
            console.error("[AI] Missing required parameters in generateCoachingReport");
            return null;
        }
        try {
            const currentStatus = await AiModel.getHistoryStatus(profileId);
            if (currentStatus === "processing") {
                console.info("[AI] Coaching generation already in progress for profile:", profileId);
                return null;
            }
            const aiInputObj = await this.prepareInput(username, profileName, profileId);
            if (!aiInputObj) {
                console.warn("[AI] No valid input found for coaching generation");
                return null;
            }

            try {
                await AiModel.updateHistoryStatus(profileId, "processing");
            } catch (statusErr) {
                console.error("[AI] Failed to update history status to 'processing':", statusErr);
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
                AdminService.logAction({
                    type: "create",
                    executeAccount: username,
                    executeProfile: profileName,
                    action: "ai_generate_coaching_report",
                    target: { profileId }
                });
            } catch (saveErr) {
                console.error("[AI] Failed to save history entry:", saveErr);
            }

            return true;

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
        const status = await AiModel.getHistoryStatus(profileId);
        if (!status) {
            throw new AppError.NotFoundError("History status not found");
        }
        const analyzeStatus = status;
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
            const categoriesBudgets = budgetsRes.budgets.categories as {
                name: string;
                budgets: CategoryBudget[];
            }[];

            const now = new Date();
            const THREE_MONTHS_MS = 1000 * 60 * 60 * 24 * 90;

            const closedBudgets = profileBudgets.filter(b => {
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

            const matchingCategoryBudgets: CategoryBudgetForAI[] = [];
            for (const cb of categoriesBudgets) {
                for (const b of cb.budgets) {
                    if (
                        b.startDate === targetBudget.startDate &&
                        b.endDate === targetBudget.endDate
                    ) {
                        matchingCategoryBudgets.push({
                            _id: b._id,
                            categoryName: cb.name,
                            startDate: b.startDate,
                            endDate: b.endDate,
                            amount: b.amount,
                            spent: b.spent
                        });
                    }
                }
            }

            const budgetRelevantExpenses = (await TransactionModel.getTransactionsInDateRange(
                profile.expenses,
                new Date(targetBudget.startDate).toISOString(),
                new Date(targetBudget.endDate).toISOString()
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