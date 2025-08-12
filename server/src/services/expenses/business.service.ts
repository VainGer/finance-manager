import BusinessModel from "../../models/expenses/business.model";
import CategoriesModel from "../../models/expenses/categories.model";
import * as AppErrors from "../../errors/AppError";
import { Business, Category } from "../../types/expenses.types";
import { ObjectId } from "mongodb";


export default class BusinessService {


    static async createBusiness(refId: string, categoryName: string, businessName: string) {
        if (!refId || !categoryName || !businessName) {
            throw new AppErrors.BadRequestError("Reference ID, category name and business data are required");
        }
        const existingCategories = await CategoriesModel.getCategories(refId);
        if (!existingCategories) {
            throw new AppErrors.NotFoundError("Expenses document not found");
        }
        if (!existingCategories.categories.some((cat: Category) => cat.name === categoryName)) {
            throw new AppErrors.NotFoundError("Category not found");
        }
        const existingBusinesses = await this.getBusinessNamesByCategory(refId, categoryName);
        if (existingBusinesses.includes(businessName)) {
            throw new AppErrors.ConflictError("Business already exists");
        }
        const newBusiness: Business = { name: businessName, bankName: "-", transactions: [] };
        const result = await BusinessModel.createBusiness(refId, categoryName, newBusiness);
        if (!result?.success) {
            throw new AppErrors.AppError("Failed to create business", 500);
        }
        return result;
    }

    static async renameBusiness(refId: string, categoryName: string, oldName: string, newName: string) {
        if (!refId || !categoryName || !oldName || !newName) {
            throw new AppErrors.BadRequestError("Reference ID, category name, old name and new name are required");
        }
        if (oldName === newName) {
            throw new AppErrors.BadRequestError("Old name and new name cannot be the same");
        }
        const businesses = await this.getBusinessNamesByCategory(refId, categoryName);
        if (businesses.includes(newName)) {
            throw new AppErrors.ConflictError("Business with the new name already exists");
        } else if (!businesses.includes(oldName)) {
            throw new AppErrors.NotFoundError("Business with the old name not found");
        }
        const result = await BusinessModel.renameBusiness(refId, categoryName, oldName, newName);
        if (!result?.success) {
            throw new AppErrors.AppError(result?.message || "Failed to rename business", 500);
        }
        return result;
    }

    static async deleteBusiness(refId: string, categoryName: string, businessName: string) {
        if (!refId || !categoryName || !businessName) {
            throw new AppErrors.BadRequestError("Reference ID, category name and business name are required");
        }
        const businessToDelete = await this.getBusinessNamesByCategory(refId, categoryName);
        if (!businessToDelete.includes(businessName)) {
            throw new AppErrors.NotFoundError("Business not found");
        }
        const result = await BusinessModel.deleteBusiness(refId, categoryName, businessName);
        if (!result?.success) {
            throw new AppErrors.AppError(result?.message || "Failed to delete business", 500);
        }
        return result;
    }

    static async updateBusinessBankName(refId: string, categoryName: string, businessName: string, bankName: string) {
        if (!refId || !categoryName || !businessName || !bankName) {
            throw new AppErrors.BadRequestError("Reference ID, category name, business name and bank name are required");
        }
        const result = await BusinessModel.updateBusinessBankName(refId, categoryName, businessName, bankName);
        if (!result?.success) {
            throw new AppErrors.AppError(result?.message || "Failed to update business bank name", 500);
        }
        return result;
    }

    static async getBusinessNamesByCategory(refId: string, catName: string) {
        if (!refId || !catName) {
            throw new AppErrors.BadRequestError("Reference ID and category name are required");
        }
        const categories = await CategoriesModel.getCategories(refId);
        if (!categories) {
            throw new AppErrors.NotFoundError("Categories not found");
        }
        const category = categories.categories.find((cat: Category) => cat.name === catName);
        if (!category) {
            throw new AppErrors.NotFoundError("Category not found");
        }
        const businesses = category.Businesses.map((business: Business) => business.name);
        return businesses;
    }
}