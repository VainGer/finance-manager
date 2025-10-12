import { Router } from "express";
import ExpensesController from "../../../controllers/expenses.controller";
import { accessTokenVerification } from "../../../middleware/auth.middleware";
const businessRouter = Router();

businessRouter.post<{}, {}, { refId: string, catName: string, name: string }>(
    '/add', accessTokenVerification, ExpensesController.addBusinessToCategory);

businessRouter.put<{}, {}, { refId: string, catName: string, oldName: string, newName: string }>(
    '/rename', accessTokenVerification, ExpensesController.renameBusiness);

businessRouter.get<{ refId: string, catName: string }, {}, {}>(
    '/get-businesses/:refId/:catName', accessTokenVerification, ExpensesController.getBusinessNamesByCategory);

businessRouter.delete<{ refId: string, catName: string, busName: string }, {}, {}, {}>(
    '/delete/:refId/:catName/:busName', accessTokenVerification, ExpensesController.deleteBusiness);

export default businessRouter;