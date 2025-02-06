import Router from 'express';
import { login, register } from './auth.controller.js';

const authRouter = Router();

authRouter
    .post('/login', login)
    .post('/register', register);

export default authRouter;