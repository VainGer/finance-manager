import { Router } from "express";
import BudgetController from "../../controllers/budget.controller";
import { BudgetCreationData } from "../../types/profile.types";
import { CategoryBudget } from "../../types/expenses.types";

const budgetRouter = Router();

// Profile budget routes
budgetRouter.post<{}, {}, { username: string, profileName: string, budget: { startDate: Date; endDate: Date; amount: number } }>(
    "/add-child-budget", BudgetController.addChildBudgets);

budgetRouter.get<{}, {}, {}, { username: string, profileName: string }>(
    "/get-child-budgets", BudgetController.getChildBudgets);

budgetRouter.get<{}, {}, {}, { username: string, profileName: string }>(
    "/get-budgets", BudgetController.getBudgets);

budgetRouter.post<{}, {}, { budgetData: BudgetCreationData }>(
    "/add-budget", BudgetController.createBudget);

budgetRouter.post<{}, {}, { username: string, profileName: string, startDate: Date, endDate: Date }>(
    "/check-budget-dates", BudgetController.validateBudgetDates);

export default budgetRouter;
