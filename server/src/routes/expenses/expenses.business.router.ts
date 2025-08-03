import { Router } from "express";
import ExpensesController from "../../controllers/expenses.controller";
const businessRouter = Router();

businessRouter.post<{}, {}, { refId: string, catName: string, name: string }>(
    '/add', ExpensesController.addBusinessToCategory);

businessRouter.put<{}, {}, { refId: string, catName: string, oldName: string, newName: string }>(
    '/rename', ExpensesController.renameBusiness);

businessRouter.get<{ refId: string, catName: string }, {}, {}>(
    '/get-businesses/:refId/:catName', ExpensesController.getBusinessNamesByCategory);

businessRouter.delete<{ refId: string, catName: string, busName: string }, {}, {}, {}>(
    '/delete/:refId/:catName/:busName', ExpensesController.deleteBusiness);

export default businessRouter;