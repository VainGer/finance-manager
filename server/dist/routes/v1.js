"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_1 = __importDefault(require("../services/user/user.router"));
const routerV1 = (0, express_1.default)();
routerV1.use('/user', user_router_1.default);
exports.default = routerV1;
//# sourceMappingURL=v1.js.map