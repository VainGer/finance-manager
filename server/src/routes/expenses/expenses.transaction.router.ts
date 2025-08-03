import { Router } from "express";

const transactionRouter = Router();

// transactionRouter.post<{}, {}, {
//     refId: string,
//     catName: string,
//     busName: string,
//     transaction: TransactionWithoutId
// }>(
//     '/create-transaction',
//     ExpensesModel.createTransaction
// );

// transactionRouter.put<{}, {}, {
//     refId: string,
//     catName: string,
//     busName: string,
//     transactionId: string,
//     newAmount: number
// }>(
//     '/change-transaction-amount',
//     ExpensesModel.changeTransactionAmount
// );

// transactionRouter.get<{ refId: string, catName: string, busName: string }, {}, {}>(
//     '/transactions/:refId/:catName/:busName',
//     ExpensesModel.getTransactionsByBusiness
// );

// transactionRouter.get<{ refId: string, catName: string, busName: string, transactionId: string }, {}, {}>(
//     '/transaction/:refId/:catName/:busName/:transactionId',
//     ExpensesModel.getTransactionById
// );

// transactionRouter.delete<{}, {}, {}, {
//     refId: string,
//     catName: string,
//     busName: string,
//     transactionId: string
// }>(
//     '/delete-transaction',
//     ExpensesModel.deleteTransaction
// );

export default transactionRouter;