import Router from 'express';
import { addProfile, rename, deleteP, changePinCode } from './user.controller.js';

const userRouter = Router();

userRouter
    .post('/create', addProfile)
    .post('/rename', rename)
    .post('/delete', deleteP)
    .post('/change_pin', changePinCode)
export default userRouter;