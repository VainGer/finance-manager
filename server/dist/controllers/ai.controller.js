"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ai_service_1 = __importDefault(require("../services/ai/ai.service"));
const AppErrors = __importStar(require("../errors/AppError"));
class AiController {
    static async getHistory(req, res) {
        try {
            const { profileId } = req.params;
            if (!profileId) {
                throw new AppErrors.BadRequestError("Profile ID is required");
            }
            const history = await ai_service_1.default.getHistory(profileId);
            res.status(200).json({
                success: true,
                message: "History retrieved successfully",
                history
            });
        }
        catch (error) {
            this.handleError(error, res);
        }
    }
    static async checkHistoryStatus(req, res) {
        try {
            const { profileId } = req.params;
            if (!profileId) {
                throw new AppErrors.BadRequestError("Profile ID is required");
            }
            const { analyzeStatus } = await ai_service_1.default.checkHistoryStatus(profileId);
            res.status(200).json({
                success: true,
                analyzeStatus,
                message: "History status retrieved successfully"
            });
        }
        catch (error) {
            this.handleError(error, res);
        }
    }
    static handleError(error, res) {
        if (error instanceof AppErrors.AppError) {
            console.error(`[AI Controller] AppError:`, error.message);
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error(`[AI Controller] Unexpected error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
exports.default = AiController;
//# sourceMappingURL=ai.controller.js.map