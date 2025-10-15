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
const admin_model_1 = __importDefault(require("../../models/admin/admin.model"));
const AppErrors = __importStar(require("../../errors/AppError"));
const profile_model_1 = __importDefault(require("../../models/profile/profile.model"));
const profile_service_1 = __importDefault(require("../profile/profile.service"));
class AdminService {
    static async createAdmin(username, password, secret) {
        if (!username || !password || !secret) {
            throw new AppErrors.BadRequestError("username, password and secret are required");
        }
        const accs = await admin_model_1.default.getAdminsDoc();
        const usernameExists = accs?.accounts.some(admin => admin.username === username);
        if (usernameExists)
            throw new AppErrors.ConflictError("username already exists");
        const result = await admin_model_1.default.createAdmin(username, password, secret);
        if (!result.success && result.message.includes("secret")) {
            throw new AppErrors.CredentialError(result.message);
        }
        this.logAction({
            type: "create",
            executeAccount: username,
            action: "create_admin",
            target: { username }
        });
        return {
            success: true,
            message: "Admin created successfully",
            admin: result
        };
    }
    static async getGroupedProfiles(username) {
        const groupedProfiles = await admin_model_1.default.getGroupedProfiles();
        this.logAction({
            type: "export",
            executeAccount: username,
            action: "get_grouped_profiles",
            target: "allProfiles"
        });
        return groupedProfiles;
    }
    static async getActionsWithFilters(filters, adminUsername) {
        const actions = await admin_model_1.default.getActionsByFilters(filters);
        this.logAction({
            type: "export",
            executeAccount: adminUsername,
            action: "get_actions_with_filters",
            target: filters
        });
        return actions;
    }
    static async validateAdmin(username, password) {
        if (!username || !password) {
            throw new AppErrors.BadRequestError("username and password are required");
        }
        const isValid = await admin_model_1.default.validateAdmin(username, password);
        if (!isValid)
            throw new AppErrors.CredentialError();
        this.logAction({
            type: "login",
            executeAccount: username,
            action: "admin_login",
            target: { username }
        });
        return { success: true, message: "Admin validated successfully" };
    }
    static async deleteProfile(username, profileName, adminUsername) {
        if (!username || !profileName) {
            throw new AppErrors.BadRequestError("Username and profile name are required");
        }
        const profile = await profile_model_1.default.findProfile(username, profileName);
        if (!profile)
            throw new AppErrors.NotFoundError("Profile not found");
        if (profile.avatar) {
            const delAvatar = await profile_service_1.default.deleteAvatar(username, profileName);
            if (!delAvatar?.success) {
                throw new AppErrors.AppError(delAvatar?.message || "Failed to delete avatar", 500);
            }
        }
        if (!profile.parentProfile) {
            const allProfiles = await profile_model_1.default.getAllProfiles(username);
            const parents = allProfiles.filter(p => p.parentProfile);
            for (const parent of parents) {
                await profile_model_1.default.removeChildFromProfile(parent.username, parent.profileName, profileName);
            }
        }
        const result = await profile_model_1.default.deleteProfile(username, profileName, profile.expenses);
        if (!result.success)
            throw new AppErrors.AppError(result.message, 500);
        this.logAction({
            type: "delete",
            executeAccount: adminUsername,
            action: "admin_delete_profile",
            target: { username, profileName }
        });
        return { success: true, message: "Profile deleted successfully" };
    }
    static async updateProfile(username, profileName, updates, adminUsername) {
        if (!username || !profileName) {
            throw new AppErrors.BadRequestError("Username and profile name are required");
        }
        const current = await profile_model_1.default.findProfile(username, profileName);
        if (!current) {
            throw new AppErrors.NotFoundError(`Profile '${profileName}' not found`);
        }
        let effectiveProfileName = profileName;
        if (updates.newProfileName) {
            effectiveProfileName = await this.handleRename(username, profileName, updates.newProfileName, current.expenses, current.parentProfile);
        }
        if (updates.newPin)
            await this.handlePinChange(username, effectiveProfileName, updates.newPin);
        if (updates.color)
            await this.handleColorChange(username, effectiveProfileName, updates.color);
        if (updates.avatar !== undefined) {
            await this.handleAvatarChange(username, effectiveProfileName, updates.avatar);
        }
        const refreshed = await profile_service_1.default.updateProfile(username, effectiveProfileName);
        this.logAction({
            type: "update",
            executeAccount: adminUsername,
            executeProfile: effectiveProfileName,
            action: "admin_update_profile",
            target: { username, profileName, updates }
        });
        return {
            success: true,
            message: "Profile updated successfully by admin",
            profile: refreshed.profile
        };
    }
    static async logAction(params) {
        try {
            const action = {
                date: new Date().toISOString(),
                type: params.type,
                executeAccount: params.executeAccount,
                executeProfile: params.executeProfile,
                action: params.action,
                target: params.target ? JSON.stringify(params.target) : undefined
            };
            await admin_model_1.default.addAction(action);
        }
        catch (e) {
            console.error("[AdminService.logAction] Failed to log action:", e);
        }
    }
    static async handleRename(username, oldName, newName, expensesId, parentProfile) {
        if (newName === oldName)
            return oldName;
        const exists = await profile_model_1.default.findProfile(username, newName);
        if (exists)
            throw new AppErrors.ConflictError("New profile name already exists");
        const renameRes = await profile_model_1.default.renameProfile(username, oldName, newName, expensesId, parentProfile);
        if (!renameRes?.success) {
            throw new AppErrors.AppError(renameRes?.message || "Failed to rename profile", 500);
        }
        return newName;
    }
    static async handlePinChange(username, profileName, newPin) {
        if (!/^\d{4}$/.test(newPin)) {
            throw new AppErrors.BadRequestError("PIN must be exactly 4 digits");
        }
        const pinRes = await profile_model_1.default.updateProfilePin(username, profileName, newPin);
        if (!pinRes?.success) {
            throw new AppErrors.AppError(pinRes?.message || "Failed to change PIN", 500);
        }
    }
    static async handleColorChange(username, profileName, color) {
        const colorRes = await profile_model_1.default.setColor(username, profileName, color);
        if (!colorRes?.success) {
            throw new AppErrors.AppError(colorRes?.message || "Failed to set color", 500);
        }
    }
    static async handleAvatarChange(username, profileName, avatar) {
        if (avatar === null) {
            const delRes = await profile_service_1.default.deleteAvatar(username, profileName);
            if (!delRes?.success) {
                throw new AppErrors.AppError(delRes?.message || "Failed to remove avatar", 500);
            }
        }
        else {
            const setRes = await profile_service_1.default.setAvatar(username, profileName, avatar);
            if (!setRes?.success) {
                throw new AppErrors.AppError(setRes?.message || "Failed to set avatar", 500);
            }
        }
    }
}
exports.default = AdminService;
//# sourceMappingURL=admin.service.js.map