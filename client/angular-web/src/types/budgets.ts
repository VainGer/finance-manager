export interface Budget {
  _id: string;
  amount: number;
  spent: number;
  endDate: string;
  startDate: string;
  unexpected?: boolean;
}

export interface CategoryBudget {
  name: string;
  budgets: Budget[];
}