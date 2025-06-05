import { Category, CategoryBudget, Transaction } from "./expenses.types";
import { Response, Request } from "express";
import db from "../../server";
import { ObjectId } from "mongodb";

export default class ExpensesModel {
    private static expenseCollection: string = "expenses";

    static async createCategory(req: Request, res: Response) {
        try {
            const { name, refId } = req.body as { name: string, refId: string };
            if (!name || !refId) {
                return res.status(400).json({ error: "Name and refId are required" });
            }
            const newCategory: Category = {
                name,
                budgets:[],
                Businesses: []
            };
            // const result = await db.UpdateDocument(
            //     ExpensesModel.expenseCollection,)
        } catch (error) {
            console.error("Error creating category:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}