import db from "../../server";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import path from 'path';
import { AdminAccount, AdminAccountsDoc, Action, HistoryDoc, GroupedProfiles } from "../../types/admin.types";
dotenv.config({ path: path.join(__dirname, '../../dotenv/.env') });


export default class AdminModel {

    private static adminCollection: string = "admin";
    private static profilesCollection: string = "profiles";
    private static SALT_ROUNDS = 10;

    static async createAdmin(username: string, password: string, secret: string) {
        try {
            if (process.env.ADMIN_REG_SECRET !== secret) {
                return { success: false, message: "Invalid admin registration secret" };
            }

            const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

            const newAdmin: AdminAccount = {
                username,
                password: hashedPassword,
                isAdmin: true,
            };

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

                await db.AddDocument(this.adminCollection, {
                    type: "logs",
                    operations: [],
                } as HistoryDoc);

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
            const result = await db.GetDocument(
                this.adminCollection,
                { type: "accounts" }
            );
            return result as AdminAccountsDoc | null;
        } catch (error) {
            console.error("Error in AdminModel.getAdminsDoc:", error);
            throw new Error("Internal server error while getting admins document");
        }
    }

    static async validateAdmin(username: string, password: string): Promise<boolean> {
        try {
            const adminDoc = await this.getAdminsDoc();
            if (!adminDoc) {
                return false;
            }
            const admin = adminDoc.accounts.find((admin) => admin.username === username);
            if (!admin) {
                return false;
            }
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            return isPasswordValid;
        } catch (error) {
            console.error("Error in AdminModel.validateAdmin:", error);
            throw new Error("Internal server error while validating admin");
        }
    }

    static async addAction(action: Action) {
        try {
            const logEntry = {
                ...action,
                date: new Date().toISOString()
            }
            const result = await db.UpdateDocument(
                this.adminCollection,
                { type: "logs" },
                { $push: { operations: logEntry } }
            );
            if (!result?.modifiedCount) {
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error in AdminModel.addAction:", error);
            throw new Error("Internal server error while adding action");
        }
    }

    static async getRecentActions(limit: number = 50): Promise<Action[]> {
        try {
            const doc = await db.GetDocument(this.adminCollection, { type: "logs" });
            if (!doc || !doc.operations) return [];
            return doc.operations
                .sort((a: Action, b: Action) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, limit);
        } catch (error) {
            console.error("Error in AdminModel.getRecentActions:", error);
            throw new Error("Internal server error while fetching recent actions");
        }
    }

    static async getActionsByDateRange(start: Date, end: Date): Promise<Action[]> {
        try {
            const doc = await db.GetDocument(this.adminCollection, { type: "logs" });
            if (!doc || !doc.operations) return [];

            const startTime = start.getTime();
            const endTime = end.getTime();

            return doc.operations.filter((action: Action) => {
                const actionTime = new Date(action.date).getTime();
                return actionTime >= startTime && actionTime <= endTime;
            });
        } catch (error) {
            console.error("Error in AdminModel.getActionsByDateRange:", error);
            throw new Error("Internal server error while fetching actions by date range");
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