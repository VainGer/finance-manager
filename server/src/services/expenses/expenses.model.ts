import { Response, Request } from "express";
import db from "../../server";
import { ObjectId } from "mongodb";
import CategoriesModel from "./categories.model";
import BusinessModel from "./business.model";
import TransactionModel from "./transaction.model";
import { CategoryBudget, Transaction } from "./expenses.types";


function validateRequiredFields(res: Response, fields: Record<string, any>) {
    const missingFields = Object.entries(fields)
        .filter(([key, value]) => value === undefined || value === null || value === '')
        .map(([key, value]) => key);

    if (missingFields.length > 0) {
        res.status(400).json({
            message: `${missingFields.join(', ')} ${missingFields.length === 1 ? 'is' : 'are'} required`
        });
        return true;
    }
    return false;
}

function formatResponse(res: Response, result: any, dataField?: string, statusCode: number = 200) {
    const response: any = {
        message: result.message || result.error
    };

    if (dataField && result[dataField] !== undefined) {
        response[dataField] = result[dataField];
    }

    res.status(statusCode).json(response);
}

export default class ExpensesModel {
    private static expenseCollection: string = "expenses";

    //categories
    static async createCategory(req: Request, res: Response) {
        const { refId, name } = req.body as { refId: ObjectId, name: string };
        if (validateRequiredFields(res, { refId, name })) {
            return;
        }
        const { status, ...responseData } = await CategoriesModel.createCategory(new ObjectId(refId), name);
        formatResponse(res, responseData, undefined, status);
    }

    static async createCategoryBudget(req: Request, res: Response) {
        const { refId, catName, budget } = req.body as {
            refId: ObjectId, catName: string, budget: CategoryBudget
        };
        if (validateRequiredFields(res, { refId, catName, budget })) {
            return;
        }
        const result = await CategoriesModel.createCategoryBudget(new ObjectId(refId), budget, catName);
        if (result.success) {
            formatResponse(res, { message: "Category budget created successfully" }, undefined, 201);
        } else {
            formatResponse(res, { message: "Failed to create category budget" }, undefined, 500);
        }
    }

    static async getCategoriesNames(req: Request, res: Response) {
        const { refId } = req.params as { refId: string };
        if (validateRequiredFields(res, { refId })) {
            return;
        }
        const { status, ...responseData } = await CategoriesModel.getCategoriesNames(new ObjectId(refId));
        formatResponse(res, responseData, 'categoriesNames', status);
    }

    static async renameCategory(req: Request, res: Response) {
        const { refId, oldName, newName } = req.body as
            { refId: ObjectId, oldName: string, newName: string };
        if (validateRequiredFields(res, { refId, oldName, newName })) {
            return;
        }
        const { status, ...responseData } = await CategoriesModel.renameCategory(new ObjectId(refId), oldName, newName);
        formatResponse(res, responseData, undefined, status);
    }

    static async deleteCategory(req: Request, res: Response) {
        const { refId, catName } = req.query as { refId: string, catName: string };
        if (validateRequiredFields(res, { refId, catName })) {
            return;
        }
        const { status, ...responseData } = await CategoriesModel.deleteCategory(new ObjectId(refId), catName);
        formatResponse(res, responseData, undefined, status);
    }


    //businesses

    static async addBusinessToCategory(req: Request, res: Response) {
        const { refId, catName, name } = req.body as { refId: ObjectId, catName: string, name: string };
        if (validateRequiredFields(res, { refId, catName, name })) {
            return;
        }
        const { status, ...responseData } = await BusinessModel.addBusinessToCategory(new ObjectId(refId), catName, name);
        formatResponse(res, responseData, undefined, status);
    }

    static async renameBusiness(req: Request, res: Response) {
        const { refId, catName, oldName, newName } = req.body as
            { refId: ObjectId, catName: string, oldName: string, newName: string };
        if (validateRequiredFields(res, { refId, catName, oldName, newName })) {
            return;
        }
        const { status, ...responseData } = await BusinessModel.renameBusiness(new ObjectId(refId), catName, oldName, newName);
        formatResponse(res, responseData, undefined, status);
    }

    static async getBusinessNamesByCategory(req: Request, res: Response) {
        const { refId, catName } = req.params as { refId: string, catName: string };
        if (validateRequiredFields(res, { refId, catName })) {
            return;
        }
        const { status, ...responseData } = await BusinessModel.getBusinessNamesByCategory(new ObjectId(refId), catName);
        formatResponse(res, responseData, 'businessNames', status);
    }

    static async deleteBusiness(req: Request, res: Response) {
        const { refId, catName, busName } = req.query as { refId: string, catName: string, busName: string };
        if (validateRequiredFields(res, { refId, catName, busName })) {
            return;
        }
        const { status, ...responseData } = await BusinessModel.deleteBusiness(new ObjectId(refId), catName, busName);
        formatResponse(res, responseData, undefined, status);
    }

    // Transaction methods
    static async createTransaction(req: Request, res: Response) {
        const { refId, catName, busName, transaction } = req.body as {
            refId: ObjectId, catName: string, busName: string, transaction: Transaction
        };

        if (validateRequiredFields(res, { refId, catName, busName, transaction })) {
            return;
        }
        const { status, ...responseData } = await TransactionModel.createTransaction(
            new ObjectId(refId),
            catName,
            busName,
            transaction
        );
        formatResponse(res, responseData, undefined, status);
    }

    static async changeTransactionAmount(req: Request, res: Response) {
        const { refId, catName, busName, transactionId, newAmount } = req.body as {
            refId: ObjectId, catName: string, busName: string, transactionId: ObjectId, newAmount: number
        };
        if (validateRequiredFields(res, { refId, catName, busName, transactionId, newAmount })) {
            return;
        }
        const { status, ...responseData } = await TransactionModel.changeTransactionAmount(
            new ObjectId(refId),
            catName,
            busName,
            new ObjectId(transactionId),
            newAmount
        );
        formatResponse(res, responseData, undefined, status);
    }

    static async getTransactionsByBusiness(req: Request, res: Response) {
        const { refId, catName, busName } = req.params as {
            refId: string, catName: string, busName: string
        };
        if (!refId || !catName || !busName) {
            res.status(400).json({ message: "RefId, category name, and business name are required" });
            return;
        }
        const { status, ...responseData } = await TransactionModel.getTransactionsByBusiness(
            new ObjectId(refId),
            catName,
            busName
        );
        formatResponse(res, responseData, 'transactions', status);
    }

    static async deleteTransaction(req: Request, res: Response) {
        const { refId, catName, busName, transactionId } = req.query as {
            refId: string, catName: string, busName: string, transactionId: string
        };
        if (validateRequiredFields(res, { refId, catName, busName, transactionId })) {
            return;
        }
        const { status, ...responseData } = await TransactionModel.deleteTransaction(
            new ObjectId(refId),
            catName,
            busName,
            new ObjectId(transactionId)
        );
        formatResponse(res, responseData, undefined, status);
    }

    static async getTransactionById(req: Request, res: Response) {
        const { refId, catName, busName, transactionId } = req.params as {
            refId: string, catName: string, busName: string, transactionId: string
        };
        if (validateRequiredFields(res, { refId, catName, busName, transactionId })) {
            return;
        }
        const { status, ...responseData } = await TransactionModel.getTransactionById(
            new ObjectId(refId),
            catName,
            busName,
            new ObjectId(transactionId)
        );
        formatResponse(res, responseData, 'transaction', status);
    }


    // Data Retrieval method
    static async getProfileExpenses(req: Request, res: Response) {
        const { refId } = req.params as { refId: string };
        if (validateRequiredFields(res, { refId })) {
            return;
        }

        try {
            const rawExpenses = await db.GetDocument(ExpensesModel.expenseCollection, { _id: new ObjectId(refId) });

            if (!rawExpenses) {
                formatResponse(res, { message: "Expenses not found" }, undefined, 404);
                return;
            }

            const expenses = rawExpenses.categories;
            formatResponse(res, {
                message: "Expenses retrieved successfully",
                expenses
            }, undefined, 200);
        } catch (error) {
            console.error("Error fetching expenses:", error);
            formatResponse(res, { message: "Internal server error" }, undefined, 500);
        }
    }
}

