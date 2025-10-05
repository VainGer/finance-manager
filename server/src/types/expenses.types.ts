import { ObjectId } from "mongodb";

export type Category = {
    name: string;
    budgets: CategoryBudget[];
    Businesses: Business[];
}

export type Business = {
    name: string;
    transactionsArray: MonthlyTransactions[];
    bankNames: string[];
}

export type CategoryBudget = {
    _id: ObjectId;
    categoryName?: string; // only for service use
    startDate: Date;
    endDate: Date;
    amount: number;
    spent: number;
}

export type CategoryBudgetWithoutId = Omit<CategoryBudget, '_id'>;

export type YearMonth = `${number}-${string}`;

export type MonthlyTransactions = {
    dateYM: YearMonth;
    transactions: Transaction[];
}

export type Transaction = {
    _id: ObjectId;
    amount: number;
    date: string; // ISO string format
    description: string;
}

export type GroupedTransactions = {
    category: string;
    business: string;
    dateYM: string;
    transactions: Transaction[];
};

export type CategoryForAI = Omit<Category, "budgets">;

export type TransactionWithoutId = Omit<Transaction, '_id'>;