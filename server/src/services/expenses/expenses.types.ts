import { ObjectId } from "mongodb";

export type Category = {
    name: string;
    budgets?: CategoryBudget[];
    Businesses?: Business[];
}

export type Business = {
    name: string;
    transactions: Transaction[];
}

export type CategoryBudget = {
    startDate: Date;
    endDate: Date;
    amount: number;
    spent: number;
}

export type Transaction = {
    _id: ObjectId;
    amount: number;
    date: Date;
    description: string;
}

export type TransactionWithoutId = Omit<Transaction, '_id'>;