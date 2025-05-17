import Router from 'express';
import userRouter from '../services/user/user.router';

const routerV1 = Router();
routerV1.use('/user', userRouter);

export default routerV1;