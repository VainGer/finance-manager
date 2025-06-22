import Router from 'express';
import accountRouter from '../services/account/account.router';
import profileRouter from '../services/profile/profile.router';
import expensesRouter from '../services/expenses/expenses.router';

const routerV1 = Router();
routerV1.use('/account', accountRouter);
routerV1.use('/profile', profileRouter);
routerV1.use('/expenses', expensesRouter);

export default routerV1;