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
const appErrors = __importStar(require("../../errors/AppError"));
const transaction_model_1 = __importDefault(require("../../models/expenses/transaction.model"));
const mongodb_1 = require("mongodb");
const categories_model_1 = __importDefault(require("../../models/expenses/categories.model"));
class TransactionService {
    static async createTransaction(refId, catName, busName, transactionData) {
        if (!refId || !catName || !busName || !transactionData) {
            throw new appErrors.BadRequestError("Reference ID, category name, business name and transaction data are required");
        }
        const transaction = { ...transactionData, _id: new mongodb_1.ObjectId() };
        const result = await transaction_model_1.default.createTransaction(refId, catName, busName, transaction);
        if (!result?.success) {
            throw new appErrors.AppError(result?.message || "Failed to create transaction", 500);
        }
        return result;
    }
    static async changeTransactionAmount(refId, catName, busName, transactionId, newAmount) {
        if (!refId || !catName || !busName || !transactionId || newAmount === undefined) {
            throw new appErrors.BadRequestError("Reference ID, category name, business name, transaction ID and new amount are required");
        }
        const result = await transaction_model_1.default.changeTransactionAmount(refId, catName, busName, transactionId, newAmount);
        if (!result?.success) {
            throw new appErrors.AppError(result?.message || "Failed to change transaction amount", 500);
        }
        return result;
    }
    static async deleteTransaction(refId, catName, busName, transactionId) {
        if (!refId || !catName || !busName || !transactionId) {
            throw new appErrors.BadRequestError("Reference ID, category name, business name and transaction ID are required");
        }
        const result = await transaction_model_1.default.deleteTransaction(refId, catName, busName, transactionId);
        if (!result?.success) {
            throw new appErrors.AppError(result?.message || "Failed to delete transaction", 500);
        }
        return result;
    }
    static async getTransactionById(refId, catName, busName, transactionId) {
        if (!refId || !catName || !busName || !transactionId) {
            throw new appErrors.BadRequestError("Reference ID, category name, business name and transaction ID are required");
        }
        const categories = await categories_model_1.default.getCategories(refId);
        if (!categories) {
            throw new appErrors.AppError("Failed to retrieve categories", 500);
        }
        const transaction = categories.categories.find((cat) => cat.name === catName && cat.Businesses.some(biz => biz.name === busName &&
            biz.transactions.some(trans => trans._id === new mongodb_1.ObjectId(transactionId))));
        if (!transaction) {
            throw new appErrors.NotFoundError("Transaction not found");
        }
        return transaction;
    }
}
exports.default = TransactionService;
//# sourceMappingURL=transaction.service.js.map