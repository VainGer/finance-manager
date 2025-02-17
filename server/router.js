import Router from 'express';
import authRouter from './auth/auth.router.js';
import userRouter from './user/user.router.js';
import profileRouter from './profile/profile.router.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/profile', profileRouter)

export default router;