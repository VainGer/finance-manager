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
const admin_service_1 = __importDefault(require("../admin/admin.service"));
class BusinessService {
    static async createBusiness(refId, categoryName, businessName) {
        if (!refId || !categoryName || !businessName) {
            throw new AppErrors.ValidationError("Reference ID, category name and business name are required.");
        }
        const existingCategories = await categories_model_1.default.getCategories(refId);
        if (!existingCategories) {
            throw new AppErrors.NotFoundError("Expenses document not found.");
        }
        if (!existingCategories.categories.some((cat) => cat.name === categoryName)) {
            throw new AppErrors.NotFoundError(`Category '${categoryName}' not found.`);
        }
        const existingBusinesses = await this.getBusinessNamesByCategory(refId, categoryName);
        if (existingBusinesses.includes(businessName)) {
            throw new AppErrors.ConflictError(`Business '${businessName}' already exists in category '${categoryName}'.`);
        }
        const newBusiness = { name: businessName, bankNames: [], transactionsArray: [] };
        const result = await business_model_1.default.createBusiness(refId, categoryName, newBusiness);
        if (!result?.success) {
            throw new AppErrors.DatabaseError(`Failed to create business '${businessName}'.`);
        }
        admin_service_1.default.logAction({
            type: 'create',
            executeAccount: existingCategories.username,
            executeProfile: existingCategories.profileName,
            action: 'create_business',
            target: { refId, categoryName, businessName }
        });
        return result;
    }
    static async renameBusiness(refId, categoryName, oldName, newName) {
        if (!refId || !categoryName || !oldName || !newName) {
            throw new AppErrors.ValidationError("Reference ID, category name, old name and new name are required.");
        }
        if (oldName === newName) {
            throw new AppErrors.ValidationError("Old name and new name cannot be the same.");
        }
        const categoriesDoc = await categories_model_1.default.getCategories(refId);
        let username = categoriesDoc?.username;
        let profileName = categoriesDoc?.profileName;
        const businesses = await this.getBusinessNamesByCategory(refId, categoryName);
        if (businesses.includes(newName)) {
            throw new AppErrors.ConflictError(`Business '${newName}' already exists in category '${categoryName}'.`);
        }
        else if (!businesses.includes(oldName)) {
            throw new AppErrors.NotFoundError(`Business '${oldName}' not found in category '${categoryName}'.`);
        }
        const result = await business_model_1.default.renameBusiness(refId, categoryName, oldName, newName);
        if (!result?.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to rename business from '${oldName}' to '${newName}'.`);
        }
        admin_service_1.default.logAction({
            type: 'update',
            executeAccount: username,
            executeProfile: profileName,
            action: 'rename_business',
            target: { refId, categoryName, oldName, newName }
        });
        return result;
    }
    static async deleteBusiness(refId, categoryName, businessName) {
        if (!refId || !categoryName || !businessName) {
            throw new AppErrors.ValidationError("Reference ID, category name and business name are required.");
        }
        const categoriesDoc = await categories_model_1.default.getCategories(refId);
        const username = categoriesDoc?.username;
        const profileName = categoriesDoc?.profileName;
        const businessToDelete = await this.getBusinessNamesByCategory(refId, categoryName);
        if (!businessToDelete.includes(businessName)) {
            throw new AppErrors.NotFoundError(`Business '${businessName}' not found in category '${categoryName}'.`);
        }
        const result = await business_model_1.default.deleteBusiness(refId, categoryName, businessName);
        if (!result?.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to delete business '${businessName}'.`);
        }
        admin_service_1.default.logAction({
            type: 'delete',
            executeAccount: username,
            executeProfile: profileName,
            action: 'delete_business',
            target: { refId, categoryName, businessName }
        });
        return result;
    }
    static async updateBusinessBankName(refId, categoryName, businessName, bankName) {
        if (!refId || !categoryName || !businessName || !bankName) {
            throw new AppErrors.ValidationError("Reference ID, category name, business name and bank name are required.");
        }
        const categoriesDoc = await categories_model_1.default.getCategories(refId);
        const username = categoriesDoc?.username;
        const profileName = categoriesDoc?.profileName;
        const result = await business_model_1.default.updateBusinessBankName(refId, categoryName, businessName, bankName);
        if (!result?.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to update bank name for business '${businessName}'.`);
        }
        admin_service_1.default.logAction({
            type: 'update',
            executeAccount: username,
            executeProfile: profileName,
            action: 'update_business_bank_name',
            target: { refId, categoryName, businessName, bankName }
        });
        return result;
    }
    static async getBusinessNamesByCategory(refId, catName) {
        if (!refId || !catName) {
            throw new AppErrors.ValidationError("Reference ID and category name are required.");
        }
        const categories = await categories_model_1.default.getCategories(refId);
        if (!categories) {
            throw new AppErrors.NotFoundError("Categories document not found.");
        }
        const category = categories.categories.find((cat) => cat.name === catName);
        if (!category) {
            throw new AppErrors.NotFoundError(`Category '${catName}' not found.`);
        }
        const businesses = category.Businesses.map((business) => business.name);
        return businesses;
    }
}
exports.default = BusinessService;
//# sourceMappingURL=business.service.js.map