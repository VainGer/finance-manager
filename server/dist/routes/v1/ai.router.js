"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = __importDefault(require("../../controllers/ai.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const aiRouter = (0, express_1.Router)();
aiRouter.get("/history/:profileId", auth_middleware_1.accessTokenVerification, ai_controller_1.default.getHistory);
aiRouter.get("/history/status/:profileId", auth_middleware_1.accessTokenVerification, ai_controller_1.default.checkHistoryStatus);
exports.default = aiRouter;
//# sourceMappingURL=ai.router.js.map