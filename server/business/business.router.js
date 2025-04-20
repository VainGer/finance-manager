import Router from 'express';
import {
    addBusinessC,
    renameBusinessInCategoryC,
    migrateBusinessC,
    removeBusinessFromCategoryC
} from './business.controller.js';

const businessRouter = Router();

businessRouter.post('/add', addBusinessC);

businessRouter.put('/rename', renameBusinessInCategoryC);
businessRouter.put('/migrate', migrateBusinessC);

businessRouter.delete('/remove', removeBusinessFromCategoryC);

export default businessRouter;