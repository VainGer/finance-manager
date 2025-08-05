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
const business_model_1 = __importDefault(require("../../models/expenses/business.model"));
const categories_model_1 = __importDefault(require("../../models/expenses/categories.model"));
const AppErrors = __importStar(require("../../errors/AppError"));
class BusinessService {
    static async createBusiness(refId, categoryName, businessName) {
        if (!refId || !categoryName || !businessName) {
            throw new AppErrors.BadRequestError("Reference ID, category name and business data are required");
        }
        const existingCategories = await categories_model_1.default.getCategories(refId);
        if (!existingCategories) {
            throw new AppErrors.NotFoundError("Expenses document not found");
        }
        if (!existingCategories.categories.some((cat) => cat.name === categoryName)) {
            throw new AppErrors.NotFoundError("Category not found");
        }
        const existingBusinesses = await this.getBusinessNamesByCategory(refId, categoryName);
        if (existingBusinesses.includes(businessName)) {
            throw new AppErrors.ConflictError("Business already exists");
        }
        const newBusiness = { name: businessName, transactions: [] };
        const result = await business_model_1.default.createBusiness(refId, categoryName, newBusiness);
        if (!result?.success) {
            throw new AppErrors.AppError("Failed to create business", 500);
        }
        return result;
    }
    static async renameBusiness(refId, categoryName, oldName, newName) {
        if (!refId || !categoryName || !oldName || !newName) {
            throw new AppErrors.BadRequestError("Reference ID, category name, old name and new name are required");
        }
        if (oldName === newName) {
            throw new AppErrors.BadRequestError("Old name and new name cannot be the same");
        }
        const businesses = await this.getBusinessNamesByCategory(refId, categoryName);
        if (businesses.includes(newName)) {
            throw new AppErrors.ConflictError("Business with the new name already exists");
        }
        else if (!businesses.includes(oldName)) {
            throw new AppErrors.NotFoundError("Business with the old name not found");
        }
        const result = await business_model_1.default.renameBusiness(refId, categoryName, oldName, newName);
        if (!result?.success) {
            throw new AppErrors.AppError(result?.message || "Failed to rename business", 500);
        }
        return result;
    }
    static async deleteBusiness(refId, categoryName, businessName) {
        if (!refId || !categoryName || !businessName) {
            throw new AppErrors.BadRequestError("Reference ID, category name and business name are required");
        }
        const businessToDelete = await this.getBusinessNamesByCategory(refId, categoryName);
        if (!businessToDelete.includes(businessName)) {
            throw new AppErrors.NotFoundError("Business not found");
        }
        const result = await business_model_1.default.deleteBusiness(refId, categoryName, businessName);
        if (!result?.success) {
            throw new AppErrors.AppError(result?.message || "Failed to delete business", 500);
        }
        return result;
    }
    static async getBusinessNamesByCategory(refId, catName) {
        if (!refId || !catName) {
            throw new AppErrors.BadRequestError("Reference ID and category name are required");
        }
        const categories = await categories_model_1.default.getCategories(refId);
        if (!categories) {
            throw new AppErrors.NotFoundError("Categories not found");
        }
        const category = categories.categories.find((cat) => cat.name === catName);
        if (!category) {
            throw new AppErrors.NotFoundError("Category not found");
        }
        const businesses = category.Businesses.map((business) => business.name);
        return businesses;
    }
}
exports.default = BusinessService;
//# sourceMappingURL=business.service.js.map