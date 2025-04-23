import Router from 'express';
import {
    createProfileC, renameProfileC, deleteProfileC,
    changePinC, openProfileC, getProfilesC
} from './user.controller.js';

const userRouter = Router();

userRouter
    .post('/create', createProfileC)
    .post('/rename', renameProfileC)
    .delete('/delete', deleteProfileC)
    .post('/change_pin', changePinC)
    .post('/open', openProfileC)
    .post('/get_profiles', getProfilesC)

export default userRouter;