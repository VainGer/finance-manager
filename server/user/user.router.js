import Router from 'express';
import { addProfile, rename, deleteP, changePinCode, openProf, getProfs } from './user.controller.js';

const userRouter = Router();

userRouter
    .post('/create', addProfile)
    .post('/rename', rename)
    .post('/delete', deleteP)
    .post('/change_pin', changePinCode)
    .post('/enter', openProf)
    .post('/get-profiles', getProfs)
    
export default userRouter;