import { Router } from 'express';

import categoryRouter from './expenses.category.router';
import businessRouter from './expenses.business.router';
import transactionRouter from './expenses.transaction.router';

const expensesRouter = Router();

expensesRouter.use('/category', categoryRouter);
expensesRouter.use('/business', businessRouter);
expensesRouter.use('/transaction', transactionRouter);

// expensesRouter.get<{ refId: string }, {}, {}>(
//     '/profile-expenses/:refId',
//     ExpensesModel.getProfileExpenses
// );

export default expensesRouter;