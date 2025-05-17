import Router from 'express';
import {
    addBusinessC, renameBusinessInCategoryC,
    migrateBusinessC, getBusinessNamesC,
    removeBusinessFromCategoryC
} from './business.controller.js';

const businessRouter = Router();

businessRouter.post('/add', addBusinessC)
    .post('/names', getBusinessNamesC);

businessRouter.put('/rename', renameBusinessInCategoryC);
businessRouter.put('/migrate', migrateBusinessC);

businessRouter.delete('/remove', removeBusinessFromCategoryC);

export default businessRouter;