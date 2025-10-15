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
const LLM_1 = __importDefault(require("../../utils/LLM"));
const budget_service_1 = __importDefault(require("../budget/budget.service"));
const profile_model_1 = __importDefault(require("../../models/profile/profile.model"));
const transaction_model_1 = __importDefault(require("../../models/expenses/transaction.model"));
const AppError = __importStar(require("../../errors/AppError"));
const ai_model_1 = __importDefault(require("../../models/ai/ai.model"));
const admin_service_1 = __importDefault(require("../admin/admin.service"));
const mongodb_1 = require("mongodb");
class AiService {
    static async generateCoachingReport(username, profileName, profileId) {
        if (!username || !profileName || !profileId) {
            console.error("[AI] Missing required parameters in generateCoachingReport");
            return null;
        }
        try {
            const currentStatus = await ai_model_1.default.getHistoryStatus(profileId);
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
                await ai_model_1.default.updateHistoryStatus(profileId, "processing");
            }
            catch (statusErr) {
                console.error("[AI] Failed to update history status to 'processing':", statusErr);
            }
            const aiInputStr = JSON.stringify(aiInputObj);
            const result = (await LLM_1.default.generateCoachAdvice(aiInputStr));
            if (!result) {
                console.error("[AI] LLM returned no result");
                await ai_model_1.default.updateHistoryStatus(profileId, "error");
                return null;
            }
            const { startDate, endDate } = aiInputObj.recentlyClosedGlobalBudget;
            const periodLabel = `${startDate} to ${endDate}`;
            const historyEntry = {
                _id: new mongodb_1.ObjectId().toString(),
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
                await ai_model_1.default.saveToHistory(profileId, historyEntry);
                admin_service_1.default.logAction({
                    type: "create",
                    executeAccount: username,
                    executeProfile: profileName,
                    action: "ai_generate_coaching_report",
                    target: { profileId }
                });
            }
            catch (saveErr) {
                console.error("[AI] Failed to save history entry:", saveErr);
            }
            return true;
        }
        catch (err) {
            console.error("[AI] Unexpected error in generateCoachingReport:", err);
            try {
                await ai_model_1.default.updateHistoryStatus(profileId, "error");
            }
            catch {
                // Avoid infinite loops if this fails too
            }
            return null;
        }
    }
    static async getHistory(profileId) {
        if (!profileId) {
            throw new AppError.BadRequestError("Profile ID is required");
        }
        const history = await ai_model_1.default.getAllHistory(profileId);
        if (!history) {
            throw new AppError.NotFoundError("History not found");
        }
        return history;
    }
    static async checkHistoryStatus(profileId) {
        if (!profileId) {
            throw new AppError.BadRequestError("Profile ID is required");
        }
        const status = await ai_model_1.default.getHistoryStatus(profileId);
        if (!status) {
            throw new AppError.NotFoundError("History status not found");
        }
        const analyzeStatus = status;
        return { analyzeStatus, message: "History status retrieved successfully." };
    }
    static async prepareInput(username, profileName, profileId) {
        try {
            const profile = await profile_model_1.default.findProfileById(username, profileId);
            if (!profile) {
                console.warn("[AI] Profile not found for:", { username, profileId });
                return null;
            }
            const budgetsRes = await budget_service_1.default.getBudgets(username, profileName);
            if (!budgetsRes) {
                console.warn("[AI] Budgets not found for profile:", profileId);
                return null;
            }
            const profileBudgets = budgetsRes.budgets.profile;
            const categoriesBudgets = budgetsRes.budgets.categories;
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
            const aiHistory = (await ai_model_1.default.getRecentHistory(profileId));
            const analyzedHashes = new Set(aiHistory.map(entry => entry.inputHash));
            const sortedClosedBudgets = [...closedBudgets].sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
            const targetBudget = sortedClosedBudgets.find(b => {
                const hash = `${b.startDate}_${b.endDate}`;
                return !analyzedHashes.has(hash);
            });
            if (!targetBudget) {
                console.info("[AI] All recent budgets already analyzed for:", profileId);
                return null;
            }
            const matchingCategoryBudgets = [];
            for (const cb of categoriesBudgets) {
                for (const b of cb.budgets) {
                    if (b.startDate === targetBudget.startDate &&
                        b.endDate === targetBudget.endDate) {
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
            const budgetRelevantExpenses = (await transaction_model_1.default.getTransactionsInDateRange(profile.expenses, new Date(targetBudget.startDate).toISOString(), new Date(targetBudget.endDate).toISOString()));
            return {
                recentlyClosedGlobalBudget: targetBudget,
                recentlyClosedCategoryBudgets: matchingCategoryBudgets,
                budgetRelevantExpenses,
                relevantAiHistory: aiHistory
            };
        }
        catch (err) {
            console.error("[AI] Error preparing input for profile:", profileId, err);
            return null;
        }
    }
}
exports.default = AiService;
//# sourceMappingURL=ai.service.js.map