"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../dotenv/.env") });
class AdminModel {
    static adminCollection = "admin";
    static logsCollection = "admin_logs";
    static profilesCollection = "profiles";
    static SALT_ROUNDS = 10;
    static async createAdmin(username, password, secret) {
        try {
            if (process.env.ADMIN_REG_SECRET !== secret) {
                return { success: false, message: "Invalid admin registration secret" };
            }
            const hashedPassword = await bcrypt_1.default.hash(password, this.SALT_ROUNDS);
            const newAdmin = { username, password: hashedPassword, isAdmin: true };
            const existingDoc = await server_1.default.GetDocument(this.adminCollection, { type: "accounts" });
            if (!existingDoc) {
                const result = await server_1.default.AddDocument(this.adminCollection, {
                    type: "accounts",
                    accounts: [newAdmin],
                });
                if (!result?.insertedId) {
                    return { success: false, message: "Failed to create admin document" };
                }
                return { success: true, message: "Admin created successfully (first admin)" };
            }
            const updateResult = await server_1.default.UpdateDocument(this.adminCollection, { type: "accounts" }, { $push: { accounts: newAdmin } });
            if (!updateResult?.modifiedCount) {
                return { success: false, message: "Failed to add admin account" };
            }
            return { success: true, message: "Admin created successfully" };
        }
        catch (error) {
            console.error("Error in AdminModel.createAdmin:", error);
            return { success: false, message: "Internal server error while creating admin" };
        }
    }
    static async getAdminsDoc() {
        try {
            return await server_1.default.GetDocument(this.adminCollection, { type: "accounts" });
        }
        catch (error) {
            console.error("Error in AdminModel.getAdminsDoc:", error);
            throw new Error("Internal server error while getting admins document");
        }
    }
    static async validateAdmin(username, password) {
        try {
            const adminDoc = await this.getAdminsDoc();
            if (!adminDoc)
                return false;
            const admin = adminDoc.accounts.find((a) => a.username === username);
            if (!admin)
                return false;
            return await bcrypt_1.default.compare(password, admin.password);
        }
        catch (error) {
            console.error("Error in AdminModel.validateAdmin:", error);
            throw new Error("Internal server error while validating admin");
        }
    }
    static async addAction(action) {
        try {
            const logEntry = {
                ...action,
                date: new Date().toISOString()
            };
            const result = await server_1.default.AddDocument(this.logsCollection, logEntry);
            return !!result?.insertedId;
        }
        catch (error) {
            console.error("Error in AdminModel.addAction:", error);
            throw new Error("Internal server error while adding action");
        }
    }
    static async getRecentActions(limit = 50) {
        try {
            const result = await server_1.default.Find(this.logsCollection, {}, { sort: { date: -1 }, limit });
            return result;
        }
        catch (error) {
            console.error("Error in AdminModel.getRecentActions:", error);
            throw new Error("Internal server error while fetching recent actions");
        }
    }
    static async getActionsByFilters(filters) {
        try {
            const query = {};
            if (filters.start || filters.end) {
                query.date = {};
                if (filters.start)
                    query.date.$gte = new Date(filters.start).toISOString();
                if (filters.end)
                    query.date.$lte = new Date(filters.end).toISOString();
            }
            if (filters.executeAccount)
                query.executeAccount = filters.executeAccount;
            if (filters.executeProfile)
                query.executeProfile = filters.executeProfile;
            if (filters.action)
                query.action = filters.action;
            if (filters.type)
                query.type = filters.type;
            const options = { sort: { date: -1 } };
            if (filters.limit && !isNaN(filters.limit) && filters.limit > 0) {
                options.limit = filters.limit;
            }
            const result = await server_1.default.Find(this.logsCollection, query, options);
            return result;
        }
        catch (error) {
            console.error("Error in AdminModel.getActionsByFilters:", error);
            throw new Error("Internal server error while filtering actions");
        }
    }
    static async getGroupedProfiles() {
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
            const result = await server_1.default.Aggregate(this.profilesCollection, pipeline);
            return result;
        }
        catch (error) {
            console.error("Error in AdminModel.getGroupedProfiles:", error);
            throw new Error("Failed to aggregate grouped profiles");
        }
    }
}
exports.default = AdminModel;
//# sourceMappingURL=admin.model.js.map