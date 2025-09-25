import { Router } from "express";
import { CategoryBudget } from "../../../types/expenses.types";
import ExpensesController from "../../../controllers/expenses.controller";
import { accessTokenVerification } from "../../../middleware/auth.middleware";

const categoryRouter = Router();

categoryRouter.post<{}, {}, { refId: string, name: string }>(
    '/create', accessTokenVerification, ExpensesController.createCategory);

categoryRouter.get<{ refId: string }, {}, {}>(
    '/get-names/:refId', accessTokenVerification, ExpensesController.getCategoriesNames);

categoryRouter.put<{}, {}, { refId: string, oldName: string, newName: string }>(
    '/rename', accessTokenVerification, ExpensesController.renameCategory);

categoryRouter.delete<{ refId: string, catName: string }, {}, {}, {}>(
    '/delete/:refId/:catName', accessTokenVerification, ExpensesController.deleteCategory);

export default categoryRouter;