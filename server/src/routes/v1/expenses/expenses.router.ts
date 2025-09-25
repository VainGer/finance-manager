import { Router } from 'express';
import categoryRouter from './expenses.category.router';
import businessRouter from './expenses.business.router';
import transactionRouter from './expenses.transaction.router';
import ExpensesController from '../../../controllers/expenses.controller';
import { accessTokenVerification } from '../../../middleware/auth.middleware';

const expensesRouter = Router();

expensesRouter.use('/category', categoryRouter);
expensesRouter.use('/business', businessRouter);
expensesRouter.use('/transaction', transactionRouter);

expensesRouter.get('/profile-expenses/:refId', accessTokenVerification, ExpensesController.getProfileExpenses);


export default expensesRouter;