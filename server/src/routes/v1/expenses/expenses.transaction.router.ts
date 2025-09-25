import { Router } from "express";
import ExpensesController from "../../../controllers/expenses.controller";
import { TransactionWithoutId } from "../../../types/expenses.types";
import { accessTokenVerification } from "../../../middleware/auth.middleware";

const transactionRouter = Router();

transactionRouter.post<{}, {}, {
    refId: string, catName: string, busName: string, transaction: TransactionWithoutId
}>('/create', accessTokenVerification, ExpensesController.createTransaction
);

transactionRouter.put<{}, {}, {
    refId: string, catName: string, busName: string, transactionId: string, newAmount: number
}>
    ('/change-amount', accessTokenVerification, ExpensesController.changeTransactionAmount);

transactionRouter.put<{}, {}, {
    refId: string, catName: string, busName: string, transactionId: string, newDate: Date
}>('/change-date', accessTokenVerification, ExpensesController.changeTransactionDate);

transactionRouter.put<{}, {}, {
    refId: string, catName: string, busName: string, transactionId: string, newDescription: string
}>('/change-description', accessTokenVerification, ExpensesController.changeTransactionDescription);

transactionRouter.delete<
    { refId: string, catName: string, busName: string, transactionId: string }, {}, {}, {}>
    ('/delete-transaction', accessTokenVerification, ExpensesController.deleteTransaction);
    
transactionRouter.get<
    { refId: string, catName: string, busName: string }, {}, {}, {}>
    ('/:refId/:catName/:busName', accessTokenVerification, ExpensesController.getAllTransactions);
    
transactionRouter.get<
    { refId: string, catName: string, busName: string }, {}, {}, {}>
    ('/:refId/:catName/:busName/by-month', accessTokenVerification, ExpensesController.getAllTransactionsByMonth);

export default transactionRouter;