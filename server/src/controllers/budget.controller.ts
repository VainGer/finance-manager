import { Request, Response } from "express";
import * as AppErrors from "../errors/AppError";
import BudgetService from "../services/budget/budget.service";

export default class BudgetController {

    static async addChildBudgets(req: Request, res: Response) {
        try {
            const { username, profileName, budget } = req.body;
            const result = await BudgetService.addChildBudgets(username, profileName, budget);
            res.status(200).json({
                message: result.message || "Child budget added successfully"
            });
        } catch (error) {
            BudgetController.handleError(error, res);
        }
    }

    static async getChildBudgets(req: Request, res: Response) {
        try {
            const { username, profileName } = req.query as { username: string, profileName: string };
            const result = await BudgetService.getChildBudgets(username, profileName);
            res.status(200).json({
                message: "Child budgets retrieved successfully",
                budgets: result.budgets || []
            });
        } catch (error) {
            BudgetController.handleError(error, res);
        }
    }

    static async createBudget(req: Request, res: Response) {
        try {
            const { budgetData } = req.body;
            const result = await BudgetService.createBudget(budgetData);
            res.status(201).json({
                message: result.message || "Budget created successfully"
            });
        } catch (error) {
            BudgetController.handleError(error, res);
        }
    }

    static async getProfileBudgets(req: Request, res: Response) {
        try {
            const { username, profileName } = req.query as { username: string, profileName: string };
            const budgetsRes = await BudgetService.getBudgets(username, profileName);
            const profileBudgets = budgetsRes.budgets.profile;
            const categoryBudgets = budgetsRes.budgets.categories;
            res.status(200).json({
                message: "Budgets retrieved successfully",
                profileBudgets,
                categoryBudgets
            });
        } catch (error) {
            BudgetController.handleError(error, res);
        }
    }

    static async getCategoryBudgets(req: Request, res: Response) {
        try {
            const { refId } = req.query as { refId: string };
            const result = await BudgetService.getCategoriesBudgets(refId);
            res.status(200).json({
                message: "Category budgets retrieved successfully",
                budgets: result.categoriesBudgets || []
            });
        } catch (error) {
            BudgetController.handleError(error, res);
        }
    }

    static async validateBudgetDates(req: Request, res: Response) {
        try {
            const { username, profileName, startDate, endDate } = req.body as { username: string, profileName: string, startDate: Date, endDate: Date };
            const isValid = await BudgetService.validateBudgetDates(username, profileName, startDate, endDate);
            res.status(200).json({
                message: "Dates validated successfully",
                isValid: isValid.success
            });
        } catch (error) {
            BudgetController.handleError(error, res);
        }
    }

    static async deleteBudget(req: Request, res: Response) {
        try {
            const { username, profileName, budgetId } = req.params as { username: string, profileName: string, budgetId: string };
            const result = await BudgetService.deleteBudgets(username, profileName, budgetId);
            res.status(200).json({
                message: result.message || "Budget deleted successfully"
            });
        } catch (error) {
            BudgetController.handleError(error, res);
        }
    }



    private static handleError(error: any, res: Response) {
        console.error("Controller error:", error);
        if (error instanceof AppErrors.AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}
