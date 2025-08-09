import { Request, Response } from "express";
import * as appErrors from "../errors/AppError";
import CategoryService from "../services/expenses/category.service";
import BusinessService from "../services/expenses/business.service";
import TransactionService from "../services/expenses/transaction.service";

export default class ExpensesController {

    //categories
    static async createCategory(req: Request, res: Response) {
        try {
            const { refId, name } = req.body;
            const result = await CategoryService.createCategory(refId, name);
            res.status(201).json({
                message: result.message,
            });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    static async getCategoriesNames(req: Request, res: Response) {
        try {
            const { refId } = req.params;
            const categories = await CategoryService.getCategoriesNames(refId);
            res.status(200).json(categories);
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    static async renameCategory(req: Request, res: Response) {
        try {
            const { refId, oldName, newName } = req.body;
            const result = await CategoryService.renameCategory(refId, oldName, newName);
            res.status(200).json({ message: result.message });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    static async deleteCategory(req: Request, res: Response) {
        try {
            const { refId, catName } = req.params;
            const result = await CategoryService.deleteCategory(refId, catName);
            res.status(200).json({ message: result.message });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    static async createCategoryBudget(req: Request, res: Response) {
        try {
            const { refId, catName, budget } = req.body;
            const result = await CategoryService.createCategoryBudget(refId, budget, catName);
            res.status(201).json({ message: result.message });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    //business
    static async addBusinessToCategory(req: Request, res: Response) {
        try {
            const { refId, catName, name } = req.body;
            const result = await BusinessService.createBusiness(refId, catName, name);
            res.status(201).json({ message: result.message });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    static async renameBusiness(req: Request, res: Response) {
        try {
            const { refId, catName, oldName, newName } = req.body;
            const result = await BusinessService.renameBusiness(refId, catName, oldName, newName);
            res.status(200).json({ message: result.message });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    static async getBusinessNamesByCategory(req: Request, res: Response) {
        try {
            const { refId, catName } = req.params;
            const businesses = await BusinessService.getBusinessNamesByCategory(refId, catName);
            res.status(200).json({ businesses, message: "Businesses fetched successfully" });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    static async deleteBusiness(req: Request, res: Response) {
        try {
            const { refId, catName, busName } = req.params;
            const result = await BusinessService.deleteBusiness(refId, catName, busName);
            res.status(200).json({ message: result.message });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    //transactions

    static async createTransaction(req: Request, res: Response) {
        try {
            const { refId, catName, busName, transaction } = req.body;
            const result = await TransactionService.create(refId, catName, busName, transaction);
            res.status(201).json({ message: result.message });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    static async changeTransactionAmount(req: Request, res: Response) {
        try {
            const { refId, catName, busName, transactionId, newAmount } = req.body;
            const result = await TransactionService.changeAmount(refId, catName, busName, transactionId, newAmount);
            res.status(200).json({ message: result.message });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    static async changeTransactionDate(req: Request, res: Response) {
        try {
            const { refId, catName, busName, transactionId, newDate } = req.body;
            const result = await TransactionService.changeDate(refId, catName, busName, transactionId, newDate);
            res.status(200).json({ message: result.message });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    static async changeTransactionDescription(req: Request, res: Response) {
        try {
            const { refId, catName, busName, transactionId, newDescription } = req.body;
            const result = await TransactionService.changeDescription(refId, catName, busName, transactionId, newDescription);
            res.status(200).json({ message: result.message });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    static async editTransaction(req: Request, res: Response) {
        try {
            const { refId, catName, busName, transactionId, newAmount, newDate, newDescription } = req.body;
            if (!refId || !catName || !busName || !transactionId) {
                throw new appErrors.BadRequestError("Missing required fields");
            }

            // Run only the updates provided, keep current service behavior (including budget updates)
            if (newAmount !== undefined) {
                await TransactionService.changeAmount(refId, catName, busName, transactionId as any, Number(newAmount));
            }
            if (newDate) {
                await TransactionService.changeDate(refId, catName, busName, transactionId, new Date(newDate));
            }
            if (newDescription !== undefined) {
                await TransactionService.changeDescription(refId, catName, busName, transactionId, String(newDescription));
            }

            res.status(200).json({ message: "Transaction updated successfully" });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    static async deleteTransaction(req: Request, res: Response) {
        try {
            const { refId, catName, busName, transactionId } = req.body; 
            const result = await TransactionService.delete(refId, catName, busName, transactionId);
            res.status(200).json({ message: result.message });
        } catch (error) {
            ExpensesController.handleError(error, res);
        }
    }

    static async getProfileExpenses(req: Request, res: Response) {
        try {
            const { refId } = req.params;
            const expenses = await CategoryService.getProfileExpenses(refId);
            res.status(200).json({ expenses, message: "Profile expenses fetched successfully" });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    //private methods

    private static handleError(error: any, res: Response) {
        if (error instanceof appErrors.AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}