"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expenses_model_1 = __importDefault(require("./expenses.model"));
const express_1 = require("express");
const expensesRouter = (0, express_1.Router)();
// Category Routes
expensesRouter.post('/create-category', expenses_model_1.default.createCategory);
expensesRouter.post('/create-budget', expenses_model_1.default.createBudget);
expensesRouter.get('/categories/:refId', expenses_model_1.default.getCategoriesNames);
expensesRouter.put('/rename-category', expenses_model_1.default.renameCategory);
expensesRouter.delete('/delete-category', expenses_model_1.default.deleteCategory);
// Business Routes
expensesRouter.post('/add-business', expenses_model_1.default.addBusinessToCategory);
expensesRouter.put('/rename-business', expenses_model_1.default.renameBusiness);
expensesRouter.get('/businesses/:refId/:catName', expenses_model_1.default.getBusinessNamesByCategory);
expensesRouter.delete('/delete-business', expenses_model_1.default.deleteBusiness);
// Transaction Routes
expensesRouter.post('/create-transaction', expenses_model_1.default.createTransaction);
expensesRouter.put('/change-transaction-amount', expenses_model_1.default.changeTransactionAmount);
expensesRouter.get('/transactions/:refId/:catName/:busName', expenses_model_1.default.getTransactionsByBusiness);
expensesRouter.get('/transaction/:refId/:catName/:busName/:transactionId', expenses_model_1.default.getTransactionById);
expensesRouter.delete('/delete-transaction', expenses_model_1.default.deleteTransaction);
// Data Retrieval Routes
expensesRouter.get('/profile-expenses/:refId', expenses_model_1.default.getProfileExpenses);
exports.default = expensesRouter;
//# sourceMappingURL=expenses.router.js.map