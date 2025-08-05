"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_controller_1 = __importDefault(require("../../controllers/account.controller"));
const express_1 = require("express");
const accountRouter = (0, express_1.Router)();
accountRouter.post("/register", account_controller_1.default.createAccount);
accountRouter.post("/validate", account_controller_1.default.validateAccount);
exports.default = accountRouter;
//# sourceMappingURL=account.router.js.map