import { Router } from 'express';
import {
    addTransactionC,
    editTransPriceC,
    editTransactionDateC,
    deleteTransactionC
} from './transactions.controller.js';

const transactionRouter = Router();

transactionRouter.post('/add', addTransactionC);

transactionRouter.put('/edit-price', editTransPriceC);
transactionRouter.put('/edit-date', editTransactionDateC);

transactionRouter.delete('/delete', deleteTransactionC);

export default transactionRouter;