import { Router } from "express";

const businessRouter = Router();

// businessRouter.post<{}, {}, { refId: string, catName: string, name: string }>(
//     '/add-business', ExpensesModel.addBusinessToCategory);

// businessRouter.put<{}, {}, { refId: string, catName: string, oldName: string, newName: string }>(
//     '/rename-business', ExpensesModel.renameBusiness);

// businessRouter.get<{ refId: string, catName: string }, {}, {}>(
//     '/businesses/:refId/:catName', ExpensesModel.getBusinessNamesByCategory);

// businessRouter.delete<{}, {}, {}, { refId: string, catName: string, busName: string }>(
//     '/delete-business', ExpensesModel.deleteBusiness);

export default businessRouter;