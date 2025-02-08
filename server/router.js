import Router from 'express';
import authRouter from './auth/auth.router.js';
import userRouter from './user/user.router.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;