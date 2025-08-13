import { ObjectId } from "mongodb";

export type Category = {
    name: string;
    budgets: CategoryBudget[];
    Businesses: Business[];
}

export type Business = {
    name: string;
    transactions: Transaction[];
    bankNames: string[];
}

export type CategoryBudget = {
    _id: ObjectId;
    startDate: Date;
    endDate: Date;
    amount: number;
    spent: number;
}

export type CategoryBudgetWithoutId = Omit<CategoryBudget, '_id'>;

export type Transaction = {
    _id: ObjectId;
    amount: number;
    date: Date;
    description: string;
}

export type TransactionWithoutId = Omit<Transaction, '_id'>;