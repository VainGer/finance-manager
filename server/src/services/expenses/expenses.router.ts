import ExpensesModel from "./expenses.model";
import { Router } from "express";
import { TransactionWithoutId, CategoryBudget, Transaction } from "./expenses.types";

const expensesRouter = Router();

// Category Routes
expensesRouter.post<{}, {}, { refId: string, name: string }>(
    '/create-category', ExpensesModel.createCategory);

expensesRouter.post<{}, {}, { refId: string, catName: string, budget: CategoryBudget }>(
    '/create-budget', ExpensesModel.createBudget);

expensesRouter.get<{ refId: string }, {}, {}>(
    '/categories/:refId', ExpensesModel.getCategoriesNames);

expensesRouter.put<{}, {}, { refId: string, oldName: string, newName: string }>(
    '/rename-category', ExpensesModel.renameCategory);

expensesRouter.delete<{}, {}, { refId: string, catName: string }>(
    '/delete-category', ExpensesModel.deleteCategory);

// Business Routes
expensesRouter.post<{}, {}, { refId: string, catName: string, name: string }>(
    '/add-business', ExpensesModel.addBusinessToCategory);

expensesRouter.put<{}, {}, { refId: string, catName: string, oldName: string, newName: string }>(
    '/rename-business', ExpensesModel.renameBusiness);

expensesRouter.get<{ refId: string, catName: string }, {}, {}>(
    '/businesses/:refId/:catName', ExpensesModel.getBusinessNamesByCategory);

expensesRouter.delete<{}, {}, { refId: string, catName: string, busName: string }>(
    '/delete-business', ExpensesModel.deleteBusiness);

// Transaction Routes
expensesRouter.post<{}, {}, { 
    refId: string, 
    catName: string, 
    busName: string, 
    transaction: TransactionWithoutId 
}>(
    '/create-transaction', 
    ExpensesModel.createTransaction
);

expensesRouter.put<{}, {}, { 
    refId: string, 
    catName: string, 
    busName: string, 
    transactionId: string, 
    newAmount: number 
}>(
    '/change-transaction-amount', 
    ExpensesModel.changeTransactionAmount
);

expensesRouter.get<{ refId: string, catName: string, busName: string }, {}, {}>(
    '/transactions/:refId/:catName/:busName', 
    ExpensesModel.getTransactionsByBusiness
);

expensesRouter.get<{ refId: string, catName: string, busName: string, transactionId: string }, {}, {}>(
    '/transaction/:refId/:catName/:busName/:transactionId', 
    ExpensesModel.getTransactionById
);

expensesRouter.delete<{}, {}, { 
    refId: string, 
    catName: string, 
    busName: string, 
    transactionId: string 
}>(
    '/delete-transaction', 
    ExpensesModel.deleteTransaction
);

// Data Retrieval Routes
expensesRouter.get<{ refId: string }, {}, {}>(
    '/profile-expenses/:refId', 
    ExpensesModel.getProfileExpenses
);

export default expensesRouter;