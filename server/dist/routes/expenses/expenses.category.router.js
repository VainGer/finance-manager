"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenses_controller_1 = __importDefault(require("../../controllers/expenses.controller"));
const categoryRouter = (0, express_1.Router)();
categoryRouter.post('/create', expenses_controller_1.default.createCategory);
categoryRouter.get('/get-names/:refId', expenses_controller_1.default.getCategoriesNames);
categoryRouter.put('/rename', expenses_controller_1.default.renameCategory);
categoryRouter.delete('/delete/:refId/:catName', expenses_controller_1.default.deleteCategory);
categoryRouter.post('/create-budget', expenses_controller_1.default.createCategoryBudget);
exports.default = categoryRouter;
//# sourceMappingURL=expenses.category.router.js.map