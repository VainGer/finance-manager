import { Router } from 'express';
import {
    addCategoryC,
    removeCategoryC,
    removeCategoryAndSaveBusinessesC,
    renameCategoryC,
    setCategoryPrivacyC,
    getProfileCategoriesC,
    getAccountCategoriesC,
    getCategoriesNamesC,
    getAccountCategoriesNamesC
} from './category.controller.js';

const categoryRouter = Router();

categoryRouter.post('/add', addCategoryC);

categoryRouter.delete('/remove', removeCategoryC);
categoryRouter.delete('/remove-save-businesses', removeCategoryAndSaveBusinessesC);

categoryRouter.put('/rename', renameCategoryC);
categoryRouter.put('/set-privacy', setCategoryPrivacyC);

categoryRouter.get('/names', getCategoriesNamesC);
categoryRouter.get('/account-names', getAccountCategoriesNamesC);
categoryRouter.get('/profile', getProfileCategoriesC);
categoryRouter.get('/account', getAccountCategoriesC);

export default categoryRouter;