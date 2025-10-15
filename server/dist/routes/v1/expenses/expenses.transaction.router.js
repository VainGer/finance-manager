"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenses_controller_1 = __importDefault(require("../../../controllers/expenses.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const transactionRouter = (0, express_1.Router)();
transactionRouter.post('/create', auth_middleware_1.accessTokenVerification, expenses_controller_1.default.createTransaction);
transactionRouter.put('/change-amount', auth_middleware_1.accessTokenVerification, expenses_controller_1.default.changeTransactionAmount);
transactionRouter.put('/change-date', auth_middleware_1.accessTokenVerification, expenses_controller_1.default.changeTransactionDate);
transactionRouter.put('/change-description', auth_middleware_1.accessTokenVerification, expenses_controller_1.default.changeTransactionDescription);
transactionRouter.delete('/delete-transaction', auth_middleware_1.accessTokenVerification, expenses_controller_1.default.deleteTransaction);
transactionRouter.get('/:refId/:catName/:busName', auth_middleware_1.accessTokenVerification, expenses_controller_1.default.getAllTransactions);
transactionRouter.get('/:refId/:catName/:busName/by-month', auth_middleware_1.accessTokenVerification, expenses_controller_1.default.getAllTransactionsByMonth);
exports.default = transactionRouter;
//# sourceMappingURL=expenses.transaction.router.js.map