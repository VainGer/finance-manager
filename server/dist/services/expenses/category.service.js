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
const AppErrors = __importStar(require("../../errors/AppError"));
const categories_model_1 = __importDefault(require("../../models/expenses/categories.model"));
const profile_model_1 = __importDefault(require("../../models/profile/profile.model"));
const admin_service_1 = __importDefault(require("../admin/admin.service"));
class CategoryService {
    static async createCategory(refId, name) {
        if (!refId || !name) {
            throw new AppErrors.ValidationError("Reference ID and category name are required.");
        }
        const existingCategories = await categories_model_1.default.getCategories(refId);
        if (!existingCategories) {
            throw new AppErrors.NotFoundError("Expenses document not found.");
        }
        if (existingCategories.categories.some((category) => category.name === name)) {
            throw new AppErrors.ConflictError(`Category '${name}' already exists.`);
        }
        const category = { name, budgets: [], Businesses: [] };
        const result = await categories_model_1.default.createCategory(refId, category);
        if (!result?.success) {
            throw new AppErrors.DatabaseError(`Failed to create category '${name}'.`);
        }
        admin_service_1.default.logAction({
            type: 'create',
            executeAccount: existingCategories.username,
            executeProfile: existingCategories.profileName,
            action: 'create_category',
            target: { refId, name }
        });
        return result;
    }
    static async getCategoriesNames(refId) {
        if (!refId) {
            throw new AppErrors.ValidationError("Reference ID is required.");
        }
        const categories = await categories_model_1.default.getCategories(refId);
        if (!categories) {
            throw new AppErrors.NotFoundError("Categories not found.");
        }
        const categoriesNames = categories.categories.map((category) => category.name);
        return { success: true, categoriesNames };
    }
    static async renameCategory(refId, oldName, newName) {
        if (!refId || !oldName || !newName) {
            throw new AppErrors.ValidationError("Reference ID, old name and new name are required.");
        }
        if (oldName === newName) {
            throw new AppErrors.ValidationError("Old name and new name cannot be the same.");
        }
        const existingCategories = await categories_model_1.default.getCategories(refId);
        if (!existingCategories) {
            throw new AppErrors.NotFoundError("Categories not found.");
        }
        if (existingCategories.categories.some((category) => category.name === newName)) {
            throw new AppErrors.ConflictError(`Category '${newName}' already exists.`);
        }
        const result = await categories_model_1.default.renameCategory(refId, oldName, newName);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to rename category from '${oldName}' to '${newName}'.`);
        }
        admin_service_1.default.logAction({
            type: 'update',
            executeAccount: existingCategories.username,
            executeProfile: existingCategories.profileName,
            action: 'rename_category',
            target: { refId, oldName, newName }
        });
        return result;
    }
    static async deleteCategory(refId, catName) {
        if (!refId || !catName) {
            throw new AppErrors.ValidationError("Reference ID and category name are required.");
        }
        const categoriesDoc = await categories_model_1.default.getCategories(refId);
        const username = categoriesDoc?.username;
        const profileName = categoriesDoc?.profileName;
        const result = await categories_model_1.default.deleteCategory(refId, catName);
        if (!result || !result.success) {
            throw new AppErrors.DatabaseError(result?.message || `Failed to delete category '${catName}'.`);
        }
        admin_service_1.default.logAction({
            type: 'delete',
            executeAccount: username,
            executeProfile: profileName,
            action: 'delete_category',
            target: { refId, catName }
        });
        return result;
    }
    static async getProfileExpenses(refId) {
        if (!refId)
            throw new AppErrors.ValidationError("Reference ID is required.");
        const categories = await categories_model_1.default.getCategories(refId);
        if (!categories)
            throw new AppErrors.NotFoundError("Categories not found.");
        return categories.categories;
    }
    static async getChildProfileExpenses(username, childId) {
        if (!username || !childId) {
            throw new AppErrors.ValidationError("Username and child ID are required.");
        }
        const profile = await profile_model_1.default.findProfileById(username, childId);
        if (!profile) {
            throw new AppErrors.NotFoundError(`Child profile not found for ${username}:${childId}`);
        }
        const categories = await categories_model_1.default.getCategories(profile.expenses);
        if (!categories)
            throw new AppErrors.NotFoundError("Categories not found.");
        return categories.categories;
    }
}
exports.default = CategoryService;
//# sourceMappingURL=category.service.js.map