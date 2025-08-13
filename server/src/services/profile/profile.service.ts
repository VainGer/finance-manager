import { BadRequestError, ConflictError, AppError, NotFoundError } from "../../errors/AppError";
import ProfileModel from "../../models/profile/profile.model";
import AccountModel from "../../models/account/account.model";
import CategoryService from "../expenses/category.service";
import { ProfileCreationData, Profile, SafeProfile, ProfileBudget, BudgetCreationData, CategorizedFile, ChildProfile, ChildProfileCreationData } from "../../types/profile.types";
import { CategoryBudget, Transaction, TransactionWithoutId } from "../../types/expenses.types";
import { ObjectId } from "mongodb";
import LLM from "../../utils/LLM";
import BusinessModel from "../../models/expenses/business.model";
import TransactionService from "../expenses/transaction.service";

export default class ProfileService {

    static async createProfile(profileData: ProfileCreationData) {
        if (!profileData.username || !profileData.profileName || !profileData.pin) {
            throw new BadRequestError("Username, profile name and pin are required");
        }
        const profileExist = await ProfileModel.findProfile(profileData.username, profileData.profileName);
        if (profileExist) {
            throw new ConflictError("Profile already exists");
        }
        const expensesId = await ProfileModel.createExpensesDocument(profileData.username, profileData.profileName);
        if (!expensesId) {
            throw new AppError("Failed to create expenses for the profile", 500);
        }
        let avatarUrl = null;
        if (profileData.avatar) {
            avatarUrl = await ProfileModel.uploadAvatar(profileData.avatar);
            if (!avatarUrl) {
                throw new AppError("Failed to upload avatar", 500);
            }
        }
        let allProfiles = await ProfileModel.getAllProfiles(profileData.username);
        let childrenArr: { profileName: string; id: ObjectId }[] = [];
        if (allProfiles && allProfiles.length > 1) {
            allProfiles = allProfiles.filter(p => profileData.profileName !== p.profileName && !p.parentProfile);
            childrenArr = allProfiles.map(p => ({
                profileName: p.profileName,
                id: p._id
            }));
        }
        const profile: Profile = {
            username: profileData.username,
            profileName: profileData.profileName,
            pin: profileData.pin,
            avatar: avatarUrl,
            parentProfile: profileData.parentProfile,
            color: profileData.color,
            createdAt: new Date(),
            updatedAt: new Date(),
            budgets: [],
            expenses: expensesId,
            children: childrenArr
        }
        const result = await ProfileModel.create(profile);
        if (!result.insertedId || !result.success) {
            throw new AppError("Failed to create profile", 500);
        }
        return { success: true, profileId: result.insertedId, message: "Profile created successfully" };
    }

    static async createChildProfile(childProfileCreation: ChildProfileCreationData) {
        if (!childProfileCreation.username || !childProfileCreation.profileName || !childProfileCreation.pin) {
            throw new BadRequestError("Username, profile name and pin are required");
        }
        const profileExist = await ProfileModel.findProfile(childProfileCreation.username, childProfileCreation.profileName);
        if (profileExist) {
            throw new ConflictError("Profile already exists");
        }
        const expensesId = await ProfileModel.createExpensesDocument(childProfileCreation.username, childProfileCreation.profileName);
        if (!expensesId) {
            throw new AppError("Failed to create expenses for the profile", 500);
        }
        const profile: ChildProfile = {
            username: childProfileCreation.username,
            profileName: childProfileCreation.profileName,
            avatar: childProfileCreation.avatar,
            color: childProfileCreation.color,
            pin: childProfileCreation.pin,
            parentProfile: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            budgets: [],
            expenses: expensesId,
            newBudgets: []
        }

        const createdProfile = await ProfileModel.create(profile);
        if (!createdProfile.insertedId || !createdProfile.success) {
            throw new AppError("Failed to create child profile", 500);
        }
        const allProfiles = await ProfileModel.getAllProfiles(childProfileCreation.username);
        if (!allProfiles || allProfiles.length === 0) {
            throw new NotFoundError("No profiles found");
        }
        const promises = await Promise.all(allProfiles.map(async (profile) => {
            if (profile.parentProfile) {
                return ProfileModel.addChildToProfile(profile.username, profile.profileName, {
                    name: childProfileCreation.profileName,
                    id: createdProfile.insertedId
                });
            } else {
                return { success: true };
            }
        }));
        if (promises.some(result => !result.success)) {
            throw new AppError("Failed to add child to parent profiles", 500);
        }
        return { success: true, profileId: createdProfile.insertedId, message: "Child profile created successfully" };
    }

    static async addChildBudgets(childId: string, budget: { startDate: Date; endDate: Date; amount: number }) {
        if (!childId || !budget || !budget.startDate || !budget.endDate || !budget.amount) {
            throw new BadRequestError("Child ID and budget data are required");
        }
        const result = await ProfileModel.addBudgetToChild(childId, budget);
        if (!result || !result.success) {
            throw new AppError("Failed to add budget to child profile", 500);
        }
        return result;
    }


    static async getChildBudgets(username: string, profileName: string) {
        if (!username || !profileName) {
            throw new BadRequestError("Username and profile name are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const budgetsToDistribute = profile.newBudgets;
        return { success: true, budgets: budgetsToDistribute || [] };
    }

    static async validateProfile(username: string, profileName: string, pin: string) {
        if (!username || !profileName || !pin) {
            throw new BadRequestError("Username, profile name and pin are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const isValidPin = await ProfileModel.comparePin(profile.pin, pin);
        if (!isValidPin) {
            throw new BadRequestError("Invalid PIN");
        }
        const { pin: _, budgets: __, ...safeProfile } = profile;
        return { success: true, safeProfile, message: "Profile validated successfully" };
    }

    static async getAllProfiles(username: string) {
        if (!username) {
            throw new BadRequestError("Username is required");
        }
        const foundUser = AccountModel.findByUsername(username);
        if (!foundUser) {
            throw new NotFoundError("User not found");
        }
        const profilesDB = await ProfileModel.getAllProfiles(username);
        if (!profilesDB || profilesDB.length === 0) {
            return { success: true, profiles: [] };
        }
        const safeProfiles: SafeProfile[] = profilesDB.map(profile => ({
            profileName: profile.profileName,
            avatar: profile.avatar,
            color: profile.color,
            parentProfile: profile.parentProfile,
        }));
        return { success: true, safeProfiles };
    }

    static async renameProfile(username: string, oldProfileName: string, newProfileName: string) {
        if (!username || !oldProfileName || !newProfileName) {
            throw new BadRequestError("Username, old profile name and new profile name are required");
        }
        const profile = await ProfileModel.findProfile(username, oldProfileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const updatedProfile = await ProfileModel.renameProfile(username, oldProfileName, newProfileName);
        if (!updatedProfile) {
            throw new AppError("Failed to rename profile", 500);
        }
        if (!updatedProfile.success) {
            throw new ConflictError(updatedProfile.message);
        }
        return updatedProfile;
    }

    static async changeProfilePin(username: string, profileName: string, oldPin: string, newPin: string) {
        if (!username || !profileName || !oldPin || !newPin) {
            throw new BadRequestError("Username, profile name, old pin and new pin are required");
        }

        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
            throw new BadRequestError("PIN must be exactly 4 digits");
        }

        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const isValidOldPin = await ProfileModel.comparePin(profile.pin, oldPin);
        if (!isValidOldPin) {
            throw new BadRequestError("Invalid old PIN");
        }

        const updatedProfile = await ProfileModel.updateProfilePin(username, profileName, newPin);
        if (!updatedProfile) {
            throw new AppError("Failed to change profile PIN", 500);
        }
        if (!updatedProfile.success) {
            throw new ConflictError(updatedProfile.message);
        }
        return updatedProfile;
    }

    static async deleteProfile(username: string, profileName: string, pin: string) {
        if (!username || !profileName || !pin) {
            throw new BadRequestError("Username, profile name and pin are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const isValidPin = await ProfileModel.comparePin(profile.pin, pin);
        if (!isValidPin) {
            throw new BadRequestError("Invalid PIN");
        }
        await this.deleteAvatar(username, profileName);
        const result = await ProfileModel.deleteProfile(username, profileName);
        if (!result.success) {
            throw new AppError(result.message, 500);
        }
        return result;
    }

    static async setAvatar(username: string, profileName: string, avatar: string) {
        if (!username || !profileName || !avatar) {
            throw new BadRequestError("Username, profile name and avatar are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        if (profile.avatar !== null) {
            await ProfileModel.removeAvatar(username, profileName, profile.avatar);
        }
        const avatarUrl = await ProfileModel.uploadAvatar(avatar);
        if (!avatarUrl) {
            throw new AppError("Failed to upload avatar", 500);
        }
        const result = await ProfileModel.setAvatar(username, profileName, avatarUrl);
        if (!result.success) {
            throw new AppError(result.message, 500);
        }
        return { success: true, message: "Avatar set successfully" };
    }

    static async deleteAvatar(username: string, profileName: string) {
        if (!username || !profileName) {
            throw new BadRequestError("Username and profile name are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const result = await ProfileModel.removeAvatar(username, profileName, profile.avatar);
        if (!result.success) {
            throw new AppError("Failed to delete avatar", 500);
        }
        return result;
    }

    static async setColor(username: string, profileName: string, color: string) {
        if (!username || !profileName || !color) {
            throw new BadRequestError("Username, profile name and color are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const result = await ProfileModel.setColor(username, profileName, color);
        if (!result.success) {
            throw new AppError(result.message, 500);
        }
        return { success: true, message: "Profile color set successfully" };
    }

    static async uploadTransactions(username: string, profileName: string, refId: string, transactionsToUpload: CategorizedFile[]) {
        if (!username || !profileName || !refId || !transactionsToUpload) {
            throw new BadRequestError("Username, profile name, refId and transactionsToUpload are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        await this.updateBankNames(refId, transactionsToUpload);
        for (const item of transactionsToUpload) {
            const transaction: TransactionWithoutId = {
                amount: item.amount,
                date: new Date(item.date),
                description: item.description
            }
            const result = await TransactionService.create(refId, item.category, item.business, transaction);
            if (!result || !result.success) {
                throw new AppError(result?.message || "Failed to create transaction", 500);
            }
        }
        return { success: true, message: "Transactions uploaded successfully" };
    }

    static async createBudget(budgetData: BudgetCreationData) {
        const { username, profileName, profileBudget, categoriesBudgets } = budgetData;
        if (!username || !profileName || !profileBudget || !categoriesBudgets) {
            throw new BadRequestError("Username, profile name, profileBudget and categoriesBudgets are required");
        }

        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const refId = profile.expenses;

        const newSpent = await this.transactionsSumInDateRange(
            refId,
            new Date(profileBudget.startDate),
            new Date(profileBudget.endDate)
        );
        const id = new ObjectId();
        const newProfileBudget: ProfileBudget = {
            _id: id,
            startDate: new Date(profileBudget.startDate),
            endDate: new Date(profileBudget.endDate),
            amount: profileBudget.amount,
            spent: newSpent
        };

        const categoriesBudgetsCreated = await this.createCategoryBudgets(
            refId,
            categoriesBudgets,
            id,
            new Date(profileBudget.startDate),
            new Date(profileBudget.endDate)
        );

        if (!categoriesBudgetsCreated || !categoriesBudgetsCreated.success) {
            throw new AppError(categoriesBudgetsCreated?.message || "Failed to create categories budgets", 500);
        }

        const profileBudgetCreated = await ProfileModel.createBudget(username, profileName, newProfileBudget);

        if (!profileBudgetCreated || !profileBudgetCreated.success) {
            throw new AppError(profileBudgetCreated?.message || "Failed to create budget", 500);
        }

        if (!profile.parentProfile) {
            const clearResult = await ProfileModel.clearChildBudget(username, profileName);
            if (!clearResult || !clearResult.success) {
                throw new AppError(clearResult?.message || "Failed to clear child budget", 500);
            }
        }
        return { success: true, message: "Budget created successfully" };
    }

    static async getBudgets(username: string, profileName: string) {
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const budgets = profile.budgets;
        if (!budgets) {
            throw new NotFoundError("No budgets found for this profile");
        }
        return { success: true, budgets };
    }

    static async validateBudgetDates(username: string, profileName: string, startDate: Date, endDate: Date) {
        if (!username || !profileName || !startDate || !endDate) {
            throw new BadRequestError("Username, profile name, start date and end date are required");
        }
        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const budgets = profile.budgets || [];
        if (budgets.length === 0) {
            return { success: true, message: "No budgets found for validation" };
        }

        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);

        const overlapingDates = budgets.some((budget: ProfileBudget) => {
            const budgetStart = new Date(budget.startDate);
            const budgetEnd = new Date(budget.endDate);

            return (
                (newStart >= budgetStart && newStart <= budgetEnd) ||

                (newEnd >= budgetStart && newEnd <= budgetEnd) ||

                (newStart <= budgetStart && newEnd >= budgetEnd) ||

                (newStart >= budgetStart && newEnd <= budgetEnd)
            );
        });
        if (overlapingDates) {
            throw new ConflictError("Budget dates overlap with existing budgets");
        }
        return { success: true, message: "Budget dates are valid" };
    }

    static async categorizeTransactions(refId: string, transactionsData: string) {
        if (!refId || !transactionsData) {
            throw new BadRequestError("Reference ID and transactions data are required");
        }
        const categories = await CategoryService.getProfileExpenses(refId);
        const categoriesAndBusinesses = categories.categories.map((category: any) => {
            return {
                categoryName: category.name,
                businesses: category.Businesses.map((business: any) => ({ name: business.name, bankNames: business.bankNames }))
            };
        });
        const categorizedData = await LLM.categorizeTransactions(JSON.stringify(categoriesAndBusinesses), transactionsData);
        return categorizedData;
    }

    private static async updateBankNames(refId: string, transactionFile: CategorizedFile[]) {
        const uniqueSet = new Set<{ business: string; bank: string; category: string }>();
        transactionFile.forEach(transaction => {
            uniqueSet.add({ business: transaction.business, bank: transaction.bank, category: transaction.category });
        });
        const uniqueToArr = Array.from(uniqueSet);
        const results = await Promise.all(uniqueToArr.map(async (item) => {
            return await BusinessModel.updateBusinessBankName(refId, item.category, item.business, item.bank);
        }));
        if (results.some(result => !result.success)) {
            throw new AppError("Failed to update some business bank names", 500);
        }
        return true;
    }

    private static async transactionsSumInDateRange(refId: string, startDate: Date, endDate: Date) {
        try {
            const expenses = await CategoryService.getProfileExpenses(refId);
            const categories = expenses.categories || [];
            let totalSum = 0;
            for (const category of categories) {
                for (const business of category.Businesses) {
                    for (const transaction of business.transactions) {
                        const transactionDate = new Date(transaction.date);
                        if (transactionDate >= startDate && transactionDate <= endDate) {
                            totalSum += parseFloat(transaction.amount.toString());
                        }
                    }
                }
            }
            return totalSum;
        } catch (error) {
            console.error("Error calculating transactions sum:", error);
            throw new AppError("Failed to calculate transactions sum", 500);
        }
    }

    private static async createCategoryBudgets
        (refId: string, categeriesBudgets: { categoryName: string; amount: number }[], budgetId: ObjectId, startDate: Date, endDate: Date) {
        if (!refId || !categeriesBudgets || !budgetId || !startDate || !endDate) {
            throw new BadRequestError("Reference ID, categories budgets, budget ID, start date and end date are required");
        }
        const categories = await CategoryService.getCategoriesNames(refId);
        for (const category of categeriesBudgets) {
            if (!categories.categoriesNames.includes(category.categoryName)) {
                throw new BadRequestError(`Category '${category.categoryName}' does not exist`);
            }
        }
        for (const categoryBudget of categeriesBudgets) {
            if (!categoryBudget.categoryName || !categoryBudget.amount) {
                throw new BadRequestError("Category name and amount are required for each category budget");
            }
            const budget: CategoryBudget = {
                _id: budgetId,
                startDate: startDate,
                endDate: endDate,
                amount: categoryBudget.amount,
                spent: 0
            };
            const result = await CategoryService.createCategoryBudget(refId, budget, categoryBudget.categoryName);
            if (!result || !result.success) {
                throw new AppError(result?.message || "Failed to create category budget", 500);
            }
        }
        return { success: true, message: "Category budgets created successfully" };
    }
}

