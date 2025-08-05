"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenses_controller_1 = __importDefault(require("../../controllers/expenses.controller"));
const transactionRouter = (0, express_1.Router)();
transactionRouter.post('/create', expenses_controller_1.default.createTransaction);
transactionRouter.put('/change-amount', expenses_controller_1.default.changeTransactionAmount);
transactionRouter.get('/transaction/:refId/:catName/:busName/:transactionId', expenses_controller_1.default.getTransactionById);
transactionRouter.delete('/delete-transaction', expenses_controller_1.default.deleteTransaction);
exports.default = transactionRouter;
//# sourceMappingURL=expenses.transaction.router.js.map