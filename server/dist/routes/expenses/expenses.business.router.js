"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenses_controller_1 = __importDefault(require("../../controllers/expenses.controller"));
const businessRouter = (0, express_1.Router)();
businessRouter.post('/add', expenses_controller_1.default.addBusinessToCategory);
businessRouter.put('/rename', expenses_controller_1.default.renameBusiness);
businessRouter.get('/get-businesses/:refId/:catName', expenses_controller_1.default.getBusinessNamesByCategory);
businessRouter.delete('/delete/:refId/:catName/:busName', expenses_controller_1.default.deleteBusiness);
exports.default = businessRouter;
//# sourceMappingURL=expenses.business.router.js.map