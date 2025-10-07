import { Router } from "express";
import BudgetController from "../../controllers/budget.controller";
import { BudgetCreationData } from "../../types/profile.types";
import { CategoryBudget } from "../../types/expenses.types";
import { accessTokenVerification } from "../../middleware/auth.middleware";

const budgetRouter = Router();

// Profile budget routes - all protected with token verification
budgetRouter.post<{}, {}, { username: string, profileName: string, budget: { startDate: Date; endDate: Date; amount: number } }>(
    "/add-child-budget", accessTokenVerification, BudgetController.addChildBudgets);

budgetRouter.get<{}, {}, {}, { username: string, profileName: string }>(
    "/get-child-budgets", accessTokenVerification, BudgetController.getChildBudgets);

budgetRouter.get<{}, {}, {}, { username: string, profileName: string }>(
    "/get-profile-budgets", accessTokenVerification, BudgetController.getProfileBudgets);

budgetRouter.get<{}, {}, {}, { refId: string }>(
    "/get-category-budgets", accessTokenVerification, BudgetController.getCategoryBudgets);

budgetRouter.post<{}, {}, { budgetData: BudgetCreationData }>(
    "/add-budget", accessTokenVerification, BudgetController.createBudget);

budgetRouter.post<{}, {}, { username: string, profileName: string, startDate: Date, endDate: Date }>(
    "/check-budget-dates", accessTokenVerification, BudgetController.validateBudgetDates);

budgetRouter.delete<{}, {}, {}, { username: string, profileName: string, budgetId: string }>(
    "/delete-budget/:username/:profileName/:budgetId", accessTokenVerification, BudgetController.deleteBudget);


export default budgetRouter;
