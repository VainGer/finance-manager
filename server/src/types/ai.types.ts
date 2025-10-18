import { ObjectId } from "mongodb";
import { ProfileBudget } from "./profile.types";
import { CategoryForAI } from "./expenses.types";

export type HistoryDoc = {
    profileId: string | ObjectId;
    status: string;
    history: AIHistoryEntry[];
};

export interface AIHistoryEntry {
    _id?: ObjectId;
    profileId: string | ObjectId;
    startDate: string;
    endDate: string;
    coachOutput: AICoachOutput;
    generatedAt: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AICoachOutput {
    summary: {
        global: {
            budget: number;
            spent: number;
            remaining: number;
            utilizationPct: number;
        };
        topSignals: {
            type: "over_budget" | "near_limit" | "anomaly" | "unplanned" | string;
            message: string;
        }[];
    };
    categories: AICategoryInsight[];
    nextMonthPlan: {
        proposedBudgets: {
            category: string;
            current: number;
            proposed: number;
            rationale: string;
        }[];
        watchList: string[];
        reminders: string[];
    };
    questions: { toConfirm: string; reason: string }[];
    dataQuality: { issue: string; detail: string }[];
}

export interface AICategoryInsight {
    name: string;
    budget: number;
    spent: number;
    variance: number;
    utilizationPct: number;
    unexpected?: boolean;
    unexpectedSpent?: number;
    drivers: { business: string; amount: number }[];
    actions: {
        kind:
        | "reduce"
        | "switch"
        | "cap"
        | "adjust_budget"
        | "investigate"
        | string;
        proposal: string;
        quantifiedImpact: { monthlySave: number; oneTimeSave: number };
        evidence: string;
    }[];
}

export interface CategoryBudgetForAI {
    _id: ObjectId | string;
    categoryName: string;
    startDate: string | Date;
    endDate: string | Date;
    amount: number;
    spent: number;
    unexpected?: boolean;
}

export interface AICoachInput {
    recentlyClosedGlobalBudget: ProfileBudget;
    recentlyClosedCategoryBudgets: CategoryBudgetForAI[];
    budgetRelevantExpenses: CategoryForAI[];
    relevantAiHistory: AIHistoryEntry[];
}
