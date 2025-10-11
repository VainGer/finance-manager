import * as AppErrors from "../errors/AppError";
import { Request, Response } from "express";
import { cookieOptions } from "../utils/cookies";
import JWT from "../utils/JWT";
import AdminService from "../services/admin/admin.service";
import BudgetService from "../services/budget/budget.service";
import CategoryService from "../services/expenses/category.service";
import { Admin } from "mongodb";

export default class AdminController {

    static async register(req: Request, res: Response) {
        try {
            const { username, password, secret } = req.body;
            const result = await AdminService.createAdmin(username, password, secret);
            res.status(201).json({ message: result.message });
        } catch (error) {
            AdminController.handleError(error, res);
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const result = await AdminService.validateAdmin(username, password);
            AdminController.setAdminAccessToken(res, username);
            res.status(200).json(result);
        } catch (error) {
            AdminController.handleError(error, res);
        }
    }

    static async getRecentActions(req: Request, res: Response) {
        try {
            const { limit } = req.body as { limit?: number };
            const username = req.adminUsername!;
            const actions = await AdminService.getRecentActions(limit ?? 50, username);
            AdminController.setAdminAccessToken(res, username);
            res.status(200).json({ success: true, actions });
        } catch (error) {
            AdminController.handleError(error, res);
        }
    }

    static async getActionsByDateRange(req: Request, res: Response) {
        try {
            const { start, end } = req.body as { start: string; end: string };
            const username = req.adminUsername!;
            const actions = await AdminService.getActionsByDateRange(new Date(start), new Date(end), username);
            AdminController.setAdminAccessToken(res, username);
            res.status(200).json({ success: true, actions });
        } catch (error) {
            AdminController.handleError(error, res);
        }
    }

    static async getAllProfilesGrouped(req: Request, res: Response) {
        try {
            const username = req.adminUsername!;
            const groupedProfiles = await AdminService.getGroupedProfiles(username);
            AdminController.setAdminAccessToken(res, username);
            res.status(200).json({ success: true, groupedProfiles });
        } catch (error) {
            AdminController.handleError(error, res);
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const { username, profileName, updates } = req.body;
            const adminUsername = req.adminUsername!;
            await AdminService.updateProfile(username, profileName, updates, adminUsername);
            AdminController.setAdminAccessToken(res, adminUsername);
            res.status(200).json({ success: true, message: "Profile updated successfully" });
        } catch (error) {
            AdminController.handleError(error, res);
        }
    }

    static async deleteProfile(req: Request, res: Response) {
        try {
            const { username, profileName } = req.body;
            const adminUsername = req.adminUsername!;
            await AdminService.deleteProfile(username, profileName, adminUsername);
            AdminController.setAdminAccessToken(res, adminUsername);
            res.status(200).json({ success: true, message: "Profile deleted successfully" });
        } catch (error) {
            AdminController.handleError(error, res);
        }
    }

    static async getProfileBudgets(req: Request, res: Response) {
        try {
            const { username, profileName } = req.body;
            const adminUsername = req.adminUsername!;
            const budgets = await BudgetService.getBudgets(username, profileName);
            AdminService.logAction({
                type: 'export',
                executeAccount: adminUsername,
                action: 'get_profile_budgets',
                target: { username, profileName }
            });
            AdminController.setAdminAccessToken(res, adminUsername);
            res.status(200).json({ success: true, budgets });
        } catch (error) {
            AdminController.handleError(error, res);
        }
    }

    static async deleteBudget(req: Request, res: Response) {
        try {
            const { username, profileName, budgetId } = req.body;
            const adminUsername = req.adminUsername!;
            const result = await BudgetService.deleteBudgets(username, profileName, budgetId, true);
            AdminController.setAdminAccessToken(res, adminUsername);
            AdminService.logAction({
                type: 'delete',
                executeAccount: adminUsername,
                executeProfile: profileName,
                action: 'delete_budget',
                target: { username, profileName, budgetId }
            });
            res.status(200).json({
                success: true,
                message: result.message || "Budget deleted successfully"
            });
        } catch (error) {
            AdminController.handleError(error, res);
        }
    }

    static async getProfileExpenses(req: Request, res: Response) {
        try {
            const { refId } = req.body;
            const adminUsername = req.adminUsername!;
            const expenses = await CategoryService.getProfileExpenses(refId);
            AdminService.logAction({
                type: 'export',
                executeAccount: adminUsername,
                action: 'get_profile_expenses',
                target: { refId }
            });
            AdminController.setAdminAccessToken(res, adminUsername);
            res.status(200).json({
                success: true,
                expenses,
                message: "Profile expenses fetched successfully"
            });
        } catch (error) {
            AdminController.handleError(error, res);
        }
    }


    private static setAdminAccessToken(res: Response, username: string) {
        const token = JWT.signAdminAccessToken({ username });
        res.cookie("adminAccessToken", token, cookieOptions(15 * 60 * 1000));
    }

    private static handleError(error: any, res: Response) {
        console.error("Controller error:", error);
        if (error instanceof AppErrors.AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}
