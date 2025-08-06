import { Router } from "express";
import ExpensesController from "../../controllers/expenses.controller";
import { TransactionWithoutId } from "../../types/expenses.types";
const transactionRouter = Router();

transactionRouter.post<{}, {}, {
    refId: string, catName: string, busName: string, transaction: TransactionWithoutId
}>('/create', ExpensesController.createTransaction
);

transactionRouter.put<{}, {}, {
    refId: string, catName: string, busName: string, transactionId: string, newAmount: number
}>
    ('/change-amount', ExpensesController.changeTransactionAmount);

transactionRouter.put<{}, {}, {
    refId: string, catName: string, busName: string, transactionId: string, newDate: Date
}>('/change-date', ExpensesController.changeTransactionDate);

transactionRouter.put<{}, {}, {
    refId: string, catName: string, busName: string, transactionId: string, newDescription: string
}>('/change-description', ExpensesController.changeTransactionDescription);

transactionRouter.delete<{}, {}, {
    refId: string, catName: string, busName: string, transactionId: string
}>('/delete-transaction', ExpensesController.deleteTransaction);

export default transactionRouter;