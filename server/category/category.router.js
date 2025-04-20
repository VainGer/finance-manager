import Router from 'express';
import {
    addCategoryC,
    removeCategoryC,
    removeCategorySaveItemsC,
    renameCategoryC,
    setCategoryPrivacyC,
    getCategoriesC,
    getCategoriesListC
} from './category.controller.js';

const categoryRouter = Router();

categoryRouter.post('/add', addCategoryC);

categoryRouter.delete('/remove', removeCategoryC)
    ('/remove-save-items', removeCategorySaveItemsC);

    categoryRouter.put('/rename', renameCategoryC)
    ('/set-privacy', setCategoryPrivacyC);

    categoryRouter.get('/get', getCategoriesC)
    ('/list', getCategoriesListC);

export default router;