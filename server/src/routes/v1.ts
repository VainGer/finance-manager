import Router from 'express';
import accountRouter from './v1/account.router';
import profileRouter from './v1/profile.router';
import expensesRouter from './v1/expenses/expenses.router';
import budgetRouter from './v1/budgets.router';
import aiRouter from './v1/ai.router';
import adminRouter from './v1/admin.router';

const routerV1 = Router();

routerV1.use('/account', accountRouter);
routerV1.use('/profile', profileRouter);
routerV1.use('/expenses', expensesRouter);
routerV1.use('/budgets', budgetRouter);
routerV1.use('/ai', aiRouter);
routerV1.use('/admin', adminRouter);

export default routerV1;