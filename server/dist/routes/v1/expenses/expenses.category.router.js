"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenses_controller_1 = __importDefault(require("../../../controllers/expenses.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const categoryRouter = (0, express_1.Router)();
categoryRouter.post('/create', auth_middleware_1.accessTokenVerification, expenses_controller_1.default.createCategory);
categoryRouter.get('/get-names/:refId', auth_middleware_1.accessTokenVerification, expenses_controller_1.default.getCategoriesNames);
categoryRouter.put('/rename', auth_middleware_1.accessTokenVerification, expenses_controller_1.default.renameCategory);
categoryRouter.delete('/delete/:refId/:catName', auth_middleware_1.accessTokenVerification, expenses_controller_1.default.deleteCategory);
exports.default = categoryRouter;
//# sourceMappingURL=expenses.category.router.js.map