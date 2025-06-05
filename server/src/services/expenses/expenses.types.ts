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
    budget: number;
}

export type Transaction = {
    _id: ObjectId;
    amount: number;
    date: Date;
    description: string;
}