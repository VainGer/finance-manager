"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_router_1 = __importDefault(require("./account/account.router"));
const profile_router_1 = __importDefault(require("./profile/profile.router"));
const expenses_router_1 = __importDefault(require("./expenses/expenses.router"));
const routerV1 = (0, express_1.default)();
routerV1.use('/account', account_router_1.default);
routerV1.use('/profile', profile_router_1.default);
routerV1.use('/expenses', expenses_router_1.default);
exports.default = routerV1;
//# sourceMappingURL=v1.js.map