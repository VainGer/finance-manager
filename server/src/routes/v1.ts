import Router from 'express';
import userRouter from '../services/user/user.router';
import profileRouter from '../services/profile/profile.router';


const routerV1 = Router();
routerV1.use('/user', userRouter);
routerV1.use('/profile', profileRouter);

export default routerV1;