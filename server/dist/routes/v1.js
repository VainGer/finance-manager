"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_router_1 = __importDefault(require("./v1/account.router"));
const profile_router_1 = __importDefault(require("./v1/profile.router"));
const expenses_router_1 = __importDefault(require("./v1/expenses/expenses.router"));
const budgets_router_1 = __importDefault(require("./v1/budgets.router"));
const ai_router_1 = __importDefault(require("./v1/ai.router"));
const admin_router_1 = __importDefault(require("./v1/admin.router"));
const routerV1 = (0, express_1.default)();
routerV1.use('/account', account_router_1.default);
routerV1.use('/profile', profile_router_1.default);
routerV1.use('/expenses', expenses_router_1.default);
routerV1.use('/budgets', budgets_router_1.default);
routerV1.use('/ai', ai_router_1.default);
routerV1.use('/admin', admin_router_1.default);
exports.default = routerV1;
//# sourceMappingURL=v1.js.map