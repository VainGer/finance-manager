import { Router } from "express";

const categoryRouter = Router();

// categoryRouter.post<{}, {}, { refId: string, name: string }>(
//     '/create-category', ExpensesModel.createCategory);

// categoryRouter.get<{ refId: string }, {}, {}>(
//     '/categories/:refId', ExpensesModel.getCategoriesNames);

// categoryRouter.put<{}, {}, { refId: string, oldName: string, newName: string }>(
//     '/rename-category', ExpensesModel.renameCategory);

// categoryRouter.delete<{}, {}, {}, { refId: string, catName: string }>(
//     '/delete-category', ExpensesModel.deleteCategory);

// categoryRouter.post<{}, {}, { refId: string, catName: string, budget: CategoryBudget }>(
//     '/add-category-budget', ExpensesModel.createCategoryBudget);

export default categoryRouter;