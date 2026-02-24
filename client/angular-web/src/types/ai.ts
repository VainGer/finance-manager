export interface HistoryResponse {
  _id: string;
  status: 'idle' | 'error' | 'processing';
  profileId: string;
  history: History[];
}

export interface History {
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  profileId: string;
  _id: string;
  generatedAt: string;
  coachOutput: CoachOutput;
}

export interface CoachOutput {
  summary: {
    global: {
      budget: number;
      spent: number;
      remaining: number;
      utilizationPct: number;
    };
    topSignals: {
      type: 'over_budget' | 'near_limit' | 'anomaly' | 'unplanned' | string;
      message: string;
    }[];
  };
  categories: CategoryInsight[];
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

export interface CategoryInsight {
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
      | 'reduce'
      | 'switch'
      | 'cap'
      | 'adjust_budget'
      | 'investigate'
      | string;
    proposal: string;
    quantifiedImpact: { monthlySave: number; oneTimeSave: number };
    evidence: string;
  }[];
}
