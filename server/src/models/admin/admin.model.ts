import db from "../../server";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import {
    AdminAccount,
    AdminAccountsDoc,
    Action,
    GroupedProfiles,
} from "../../types/admin.types";

dotenv.config({ path: path.join(__dirname, "../../dotenv/.env") });

export default class AdminModel {
    private static adminCollection = "admin";
    private static logsCollection = "admin_logs";
    private static profilesCollection = "profiles";
    private static SALT_ROUNDS = 10;

    static async createAdmin(username: string, password: string, secret: string) {
        try {
            if (process.env.ADMIN_REG_SECRET !== secret) {
                return { success: false, message: "Invalid admin registration secret" };
            }

            const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
            const newAdmin: AdminAccount = { username, password: hashedPassword, isAdmin: true };

            const existingDoc = await db.GetDocument(
                this.adminCollection,
                { type: "accounts" }
            ) as AdminAccountsDoc | null;

            if (!existingDoc) {
                const result = await db.AddDocument(this.adminCollection, {
                    type: "accounts",
                    accounts: [newAdmin],
                } as AdminAccountsDoc);

                if (!result?.insertedId) {
                    return { success: false, message: "Failed to create admin document" };
                }

                return { success: true, message: "Admin created successfully (first admin)" };
            }

            const updateResult = await db.UpdateDocument(
                this.adminCollection,
                { type: "accounts" },
                { $push: { accounts: newAdmin } }
            );

            if (!updateResult?.modifiedCount) {
                return { success: false, message: "Failed to add admin account" };
            }

            return { success: true, message: "Admin created successfully" };
        } catch (error) {
            console.error("Error in AdminModel.createAdmin:", error);
            return { success: false, message: "Internal server error while creating admin" };
        }
    }

    static async getAdminsDoc(): Promise<AdminAccountsDoc | null> {
        try {
            return await db.GetDocument(this.adminCollection, { type: "accounts" }) as AdminAccountsDoc | null;
        } catch (error) {
            console.error("Error in AdminModel.getAdminsDoc:", error);
            throw new Error("Internal server error while getting admins document");
        }
    }

    static async validateAdmin(username: string, password: string): Promise<boolean> {
        try {
            const adminDoc = await this.getAdminsDoc();
            if (!adminDoc) return false;

            const admin = adminDoc.accounts.find((a) => a.username === username);
            if (!admin) return false;

            return await bcrypt.compare(password, admin.password);
        } catch (error) {
            console.error("Error in AdminModel.validateAdmin:", error);
            throw new Error("Internal server error while validating admin");
        }
    }

    static async addAction(action: Action): Promise<boolean> {
        try {
            const logEntry: Action = {
                ...action,
                date: new Date().toISOString()
            };
            const result = await db.AddDocument(this.logsCollection, logEntry);
            return !!result?.insertedId;
        } catch (error) {
            console.error("Error in AdminModel.addAction:", error);
            throw new Error("Internal server error while adding action");
        }
    }

    static async getRecentActions(limit: number = 50): Promise<Action[]> {
        try {
            const result = await db.Find(this.logsCollection,
                {},
                { sort: { date: -1 }, limit }
            );
            return result as Action[];
        } catch (error) {
            console.error("Error in AdminModel.getRecentActions:", error);
            throw new Error("Internal server error while fetching recent actions");
        }
    }

    static async getActionsByFilters(filters: {
        start?: Date;
        end?: Date;
        executeAccount?: string;
        executeProfile?: string;
        action?: string;
        type?: string;
        limit?: number;
    }): Promise<Action[]> {
        try {
            const query: any = {};

            if (filters.start || filters.end) {
                query.date = {};
                if (filters.start) query.date.$gte = new Date(filters.start).toISOString();
                if (filters.end) query.date.$lte = new Date(filters.end).toISOString();
            }
            if (filters.executeAccount) query.executeAccount = filters.executeAccount;
            if (filters.executeProfile) query.executeProfile = filters.executeProfile;
            if (filters.action) query.action = filters.action;
            if (filters.type) query.type = filters.type;

            const options: any = { sort: { date: -1 } };
            if (filters.limit && !isNaN(filters.limit) && filters.limit > 0) {
                options.limit = filters.limit;
            }

            const result = await db.Find(this.logsCollection, query, options);
            return result as Action[];
        } catch (error) {
            console.error("Error in AdminModel.getActionsByFilters:", error);
            throw new Error("Internal server error while filtering actions");
        }
    }

    static async getGroupedProfiles(): Promise<GroupedProfiles[]> {
        try {
            const pipeline = [
                {
                    $group: {
                        _id: "$username",
                        profiles: {
                            $push: {
                                profileName: "$profileName",
                                expenses: "$expenses"
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        account: "$_id",
                        profiles: 1
                    }
                }
            ];

            const result = await db.Aggregate(this.profilesCollection, pipeline);
            return result as GroupedProfiles[];
        } catch (error) {
            console.error("Error in AdminModel.getGroupedProfiles:", error);
            throw new Error("Failed to aggregate grouped profiles");
        }
    }
}
