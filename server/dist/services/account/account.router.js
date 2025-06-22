"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_model_1 = __importDefault(require("./account.model"));
const express_1 = require("express");
const accountRouter = (0, express_1.Router)();
accountRouter.post("/register", account_model_1.default.createAccount);
accountRouter.post("/get-user-by-id", account_model_1.default.getAccountById);
accountRouter.post("/validate", account_model_1.default.ValidateAccount);
exports.default = accountRouter;
//# sourceMappingURL=account.router.js.map