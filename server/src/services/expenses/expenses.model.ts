import { Response, Request } from "express";
import db from "../../server";
import { ObjectId } from "mongodb";
import CategoriesModel from "./categories.model";
import BusinessModel from "./business.model";
import TransactionModel from "./transaction.model";
import { CategoryBudget, Transaction } from "./expenses.types";

export default class ExpensesModel {
    private static expenseCollection: string = "expenses";

    //categories
    static async createCategory(req: Request, res: Response) {
        const { refId, name } = req.body as { refId: ObjectId, name: string };
        if (!name || !refId) {
            res.status(400).json({ error: "Name and refId are required" });
            return;
        }
        const result = await CategoriesModel.createCategory(new ObjectId(refId), name);
        res.status(result.status).json(result);
    }

    static async createBudget(req: Request, res: Response) {
        const { refId, catName, budget } = req.body as {
            refId: ObjectId, catName: string, budget: CategoryBudget
        };
        if (!budget || !catName || !refId) {
            res.status(400).json({ error: "Budget, category name, and expenses id are required" });
            return;
        }
        const result = await CategoriesModel.createBudget(new ObjectId(refId), catName, budget);
        res.status(result.status).json(result);
    }

    static async getCategoriesNames(req: Request, res: Response) {
        const { refId } = req.params as { refId: string };
        if (!refId) {
            res.status(400).json({ error: "RefId is required" });
            return;
        }
        const result = await CategoriesModel.getCategoriesNames(new ObjectId(refId));
        res.status(result.status).json(result);
    }

    static async renameCategory(req: Request, res: Response) {
        const { refId, oldName, newName } = req.body as
            { refId: ObjectId, oldName: string, newName: string };
        if (!oldName || !newName || !refId) {
            res.status(400).json({ error: "Old name, new name, and refId are required" });
            return;
        }
        const result = await CategoriesModel.renameCategory(new ObjectId(refId), oldName, newName);
        res.status(result.status).json(result);
    }

    static async deleteCategory(req: Request, res: Response) {
        const { refId, catName } = req.body as { refId: ObjectId, catName: string };
        if (!catName || !refId) {
            res.status(400).json({ error: "Category name and refId are required" });
            return;
        }
        const result = await CategoriesModel.deleteCategory(new ObjectId(refId), catName);
        res.status(result.status).json(result);
    }


    //businesses

    static async addBusinessToCategory(req: Request, res: Response) {
        const { refId, catName, name } = req.body as { refId: ObjectId, catName: string, name: string };
        if (!name || !catName || !refId) {
            res.status(400).json({ error: "Business name, category name, and refId are required" });
            return;
        }
        const result = await BusinessModel.addBusinessToCategory(new ObjectId(refId), catName, name);
        res.status(result.status).json(result);
    }

    static async renameBusiness(req: Request, res: Response) {
        const { refId, catName, oldName, newName } = req.body as
            { refId: ObjectId, catName: string, oldName: string, newName: string };
        if (!oldName || !newName || !catName || !refId) {
            res.status(400).json({ error: "Old name, new name, category name, and refId are required" });
            return;
        }
        const result = await BusinessModel.renameBusiness(new ObjectId(refId), catName, oldName, newName);
        res.status(result.status).json(result);
    }

    static async getBusinessNamesByCategory(req: Request, res: Response) {
        const { refId, catName } = req.params as { refId: string, catName: string };
        if (!refId || !catName) {
            res.status(400).json({ error: "RefId and category name are required" });
            return;
        }
        const result = await BusinessModel.getBusinessNamesByCategory(new ObjectId(refId), catName);
        res.status(result.status).json(result);
    }

    static async deleteBusiness(req: Request, res: Response) {
        const { refId, catName, busName } = req.body as { refId: ObjectId, catName: string, busName: string };
        if (!busName || !catName || !refId) {
            res.status(400).json({ error: "Business name, category name, and refId are required" });
            return;
        }
        const result = await BusinessModel.deleteBusiness(new ObjectId(refId), catName, busName);
        res.status(result.status).json(result);
    }

    // Transaction methods
    static async createTransaction(req: Request, res: Response) {
        const { refId, catName, busName, transaction } = req.body as {
            refId: ObjectId, catName: string, busName: string, transaction: Transaction
        };

        if (!transaction || !catName || !busName || !refId) {
            res.status(400).json({ error: "Transaction, category, business name, and expenses id are required" });
            return;
        }
        const result = await TransactionModel.createTransaction(
            new ObjectId(refId),
            catName,
            busName,
            transaction
        );
        res.status(result.status).json(result);
    }

    static async changeTransactionAmount(req: Request, res: Response) {
        const { refId, catName, busName, transactionId, newAmount } = req.body as {
            refId: ObjectId, catName: string, busName: string, transactionId: ObjectId, newAmount: number
        };
        if (!refId || !catName || !busName || !transactionId || newAmount === undefined) {
            res.status(400).json(
                { error: "Expenses ID, category name, business name, transaction ID, and new amount are required" });
            return;
        }
        const result = await TransactionModel.changeTransactionAmount(
            new ObjectId(refId),
            catName,
            busName,
            new ObjectId(transactionId),
            newAmount
        );
        res.status(result.status).json(result);
    }

    static async getTransactionsByBusiness(req: Request, res: Response) {
        const { refId, catName, busName } = req.params as {
            refId: string, catName: string, busName: string
        };
        if (!refId || !catName || !busName) {
            res.status(400).json({ error: "RefId, category name, and business name are required" });
            return;
        }
        const result = await TransactionModel.getTransactionsByBusiness(
            new ObjectId(refId),
            catName,
            busName
        );
        res.status(result.status).json(result);
    }

    static async deleteTransaction(req: Request, res: Response) {
        const { refId, catName, busName, transactionId } = req.body as {
            refId: ObjectId, catName: string, busName: string, transactionId: ObjectId
        };
        if (!refId || !catName || !busName || !transactionId) {
            res.status(400).json({ error: "Expenses ID, category name, business name, and transaction ID are required" });
            return;
        }
        const result = await TransactionModel.deleteTransaction(
            new ObjectId(refId),
            catName,
            busName,
            new ObjectId(transactionId)
        );
        res.status(result.status).json(result);
    }

    static async getTransactionById(req: Request, res: Response) {
        const { refId, catName, busName, transactionId } = req.params as {
            refId: string, catName: string, busName: string, transactionId: string
        };
        if (!refId || !catName || !busName || !transactionId) {
            res.status(400).json({ error: "RefId, category name, business name, and transaction ID are required" });
            return;
        }
        const result = await TransactionModel.getTransactionById(
            new ObjectId(refId),
            catName,
            busName,
            new ObjectId(transactionId)
        );
        res.status(result.status).json(result);
    }

    
    // Data Retrieval method
    static async getProfileExpenses(req: Request, res: Response) {
        const { refId } = req.params as { refId: string };
        if (!refId) {
            res.status(400).json({ error: "RefId is required" });
            return;
        }

        try {
            const rawExpenses = await db.GetDocument(ExpensesModel.expenseCollection, { _id: new ObjectId(refId) });

            if (!rawExpenses) {
                res.status(404).json({ error: "Expenses not found", status: 404 });
                return;
            }

            const expenses = rawExpenses.categories;
            res.status(200).json({
                expenses,
                status: 200
            });
        } catch (error) {
            console.error("Error fetching expenses:", error);
            res.status(500).json({ error: "Internal server error", status: 500 });
        }
    }
}

