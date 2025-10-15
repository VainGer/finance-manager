"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenses_category_router_1 = __importDefault(require("./expenses.category.router"));
const expenses_business_router_1 = __importDefault(require("./expenses.business.router"));
const expenses_transaction_router_1 = __importDefault(require("./expenses.transaction.router"));
const expenses_controller_1 = __importDefault(require("../../../controllers/expenses.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const expensesRouter = (0, express_1.Router)();
expensesRouter.use('/category', expenses_category_router_1.default);
expensesRouter.use('/business', expenses_business_router_1.default);
expensesRouter.use('/transaction', expenses_transaction_router_1.default);
expensesRouter.get('/profile-expenses/:refId', auth_middleware_1.accessTokenVerification, expenses_controller_1.default.getProfileExpensesByRef);
expensesRouter.get('/profile-expenses/child/:username/:childId', auth_middleware_1.accessTokenVerification, expenses_controller_1.default.getProfileExpensesByChild);
exports.default = expensesRouter;
//# sourceMappingURL=expenses.router.js.map