import AdminModel from "../../models/admin/admin.model";
import { Action, ActionType } from '../../types/admin.types';
import * as AppErrors from '../../errors/AppError';
import ProfileModel from "../../models/profile/profile.model";
import ProfileService from "../profile/profile.service";

export default class AdminService {


    static async createAdmin(username: string, password: string, secret: string) {
        if (!username || !password || !secret) {
            throw new AppErrors.BadRequestError("username, password and secret are required");
        }

        const accs = await AdminModel.getAdminsDoc();
        const usernameExists = accs?.accounts.some(admin => admin.username === username);
        if (usernameExists) throw new AppErrors.ConflictError("username already exists");

        const result = await AdminModel.createAdmin(username, password, secret);

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


    static async getGroupedProfiles(username: string) {
        const groupedProfiles = await AdminModel.getGroupedProfiles();
        this.logAction({
            type: "export",
            executeAccount: username,
            action: "get_grouped_profiles",
            target: "allProfiles"
        });
        return groupedProfiles;
    }

    static async getActionsWithFilters(
        filters: {
            limit?: number;
            start?: Date;
            end?: Date;
            executeAccount?: string;
            executeProfile?: string;
            action?: string;
            type?: string;
        },
        adminUsername: string
    ): Promise<Action[]> {
        const actions = await AdminModel.getActionsByFilters(filters);
        this.logAction({
            type: "export",
            executeAccount: adminUsername,
            action: "get_actions_with_filters",
            target: filters
        });
        return actions;
    }

    static async validateAdmin(username: string, password: string) {
        if (!username || !password) {
            throw new AppErrors.BadRequestError("username and password are required");
        }
        const isValid = await AdminModel.validateAdmin(username, password);
        if (!isValid) throw new AppErrors.CredentialError();

        this.logAction({
            type: "login",
            executeAccount: username,
            action: "admin_login",
            target: { username }
        });

        return { success: true, message: "Admin validated successfully" };
    }

    static async deleteProfile(username: string, profileName: string, adminUsername: string) {
        if (!username || !profileName) {
            throw new AppErrors.BadRequestError("Username and profile name are required");
        }

        const profile = await ProfileModel.findProfile(username, profileName);
        if (!profile) throw new AppErrors.NotFoundError("Profile not found");

        if (profile.avatar) {
            const delAvatar = await ProfileService.deleteAvatar(username, profileName);
            if (!delAvatar?.success) {
                throw new AppErrors.AppError(delAvatar?.message || "Failed to delete avatar", 500);
            }
        }

        if (!profile.parentProfile) {
            const allProfiles = await ProfileModel.getAllProfiles(username);
            const parents = allProfiles.filter(p => p.parentProfile);
            for (const parent of parents) {
                await ProfileModel.removeChildFromProfile(
                    parent.username,
                    parent.profileName,
                    profileName
                );
            }
        }

        const result = await ProfileModel.deleteProfile(username, profileName, profile.expenses);
        if (!result.success) throw new AppErrors.AppError(result.message, 500);

        this.logAction({
            type: "delete",
            executeAccount: adminUsername,
            action: "admin_delete_profile",
            target: { username, profileName }
        });

        return { success: true, message: "Profile deleted successfully" };
    }

    static async updateProfile(username: string, profileName: string,
        updates: {
            newProfileName?: string;
            newPin?: string;
            color?: string;
            avatar?: string | null;
        },
        adminUsername: string
    ) {
        if (!username || !profileName) {
            throw new AppErrors.BadRequestError("Username and profile name are required");
        }

        const current = await ProfileModel.findProfile(username, profileName);
        if (!current) {
            throw new AppErrors.NotFoundError(`Profile '${profileName}' not found`);
        }

        let effectiveProfileName = profileName;

        if (updates.newProfileName) {
            effectiveProfileName = await this.handleRename(
                username,
                profileName,
                updates.newProfileName,
                current.expenses,
                current.parentProfile
            );
        }

        if (updates.newPin) await this.handlePinChange(username, effectiveProfileName, updates.newPin);
        if (updates.color) await this.handleColorChange(username, effectiveProfileName, updates.color);
        if (updates.avatar !== undefined) {
            await this.handleAvatarChange(username, effectiveProfileName, updates.avatar);
        }

        const refreshed = await ProfileService.updateProfile(username, effectiveProfileName);

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

    static async logAction(params: {
        type: ActionType;
        executeAccount: string;
        executeProfile?: string;
        action: string;
        target?: any;
    }) {
        try {
            const action: Action = {
                date: new Date().toISOString(),
                type: params.type,
                executeAccount: params.executeAccount,
                executeProfile: params.executeProfile,
                action: params.action,
                target: params.target ? JSON.stringify(params.target) : undefined
            };
            await AdminModel.addAction(action);
        } catch (e) {
            console.error("[AdminService.logAction] Failed to log action:", e);
        }
    }

    private static async handleRename(
        username: string,
        oldName: string,
        newName: string,
        expensesId: string,
        parentProfile: boolean
    ): Promise<string> {
        if (newName === oldName) return oldName;
        const exists = await ProfileModel.findProfile(username, newName);
        if (exists) throw new AppErrors.ConflictError("New profile name already exists");

        const renameRes = await ProfileModel.renameProfile(
            username,
            oldName,
            newName,
            expensesId,
            parentProfile
        );
        if (!renameRes?.success) {
            throw new AppErrors.AppError(renameRes?.message || "Failed to rename profile", 500);
        }
        return newName;
    }

    private static async handlePinChange(username: string, profileName: string, newPin: string) {
        if (!/^\d{4}$/.test(newPin)) {
            throw new AppErrors.BadRequestError("PIN must be exactly 4 digits");
        }
        const pinRes = await ProfileModel.updateProfilePin(username, profileName, newPin);
        if (!pinRes?.success) {
            throw new AppErrors.AppError(pinRes?.message || "Failed to change PIN", 500);
        }
    }

    private static async handleColorChange(username: string, profileName: string, color: string) {
        const colorRes = await ProfileModel.setColor(username, profileName, color);
        if (!colorRes?.success) {
            throw new AppErrors.AppError(colorRes?.message || "Failed to set color", 500);
        }
    }

    private static async handleAvatarChange(username: string, profileName: string, avatar: string | null) {
        if (avatar === null) {
            const delRes = await ProfileService.deleteAvatar(username, profileName);
            if (!delRes?.success) {
                throw new AppErrors.AppError(delRes?.message || "Failed to remove avatar", 500);
            }
        } else {
            const setRes = await ProfileService.setAvatar(username, profileName, avatar);
            if (!setRes?.success) {
                throw new AppErrors.AppError(setRes?.message || "Failed to set avatar", 500);
            }
        }
    }
}
