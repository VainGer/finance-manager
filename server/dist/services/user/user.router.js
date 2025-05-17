"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("./user.model"));
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
userRouter.post("/register", user_model_1.default.createUser);
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map