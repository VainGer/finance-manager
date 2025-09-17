import { Router } from "express";
import { CategoryBudget } from "../../../types/expenses.types";
import ExpensesController from "../../../controllers/expenses.controller";

const categoryRouter = Router();

categoryRouter.post<{}, {}, { refId: string, name: string }>(
    '/create', ExpensesController.createCategory);

categoryRouter.get<{ refId: string }, {}, {}>(
    '/get-names/:refId', ExpensesController.getCategoriesNames);

categoryRouter.put<{}, {}, { refId: string, oldName: string, newName: string }>(
    '/rename', ExpensesController.renameCategory);

categoryRouter.delete<{ refId: string, catName: string }, {}, {}, {}>(
    '/delete/:refId/:catName', ExpensesController.deleteCategory);

export default categoryRouter;