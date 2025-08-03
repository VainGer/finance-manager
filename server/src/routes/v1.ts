import Router from 'express';
import accountRouter from './account/account.router';
import profileRouter from './profile/profile.router';

const routerV1 = Router();
routerV1.use('/account', accountRouter);
routerV1.use('/profile', profileRouter);
// routerV1.use('/expenses', expensesRouter);

export default routerV1;