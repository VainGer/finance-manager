"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const server_1 = __importDefault(require("../../server"));
class AiModel {
    static aiCollection = "ai_history";
    static async getRecentHistory(profileId) {
        try {
            const pid = typeof profileId === "string" ? new mongodb_1.ObjectId(profileId) : profileId;
            const limit = 6;
            const result = await server_1.default.Aggregate(this.aiCollection, [
                { $match: { profileId: pid } },
                { $unwind: "$history" },
                { $sort: { "history.generatedAt": -1 } },
                { $limit: limit },
                { $replaceRoot: { newRoot: "$history" } }
            ]);
            return result || [];
        }
        catch (err) {
            console.error("Error in getRecentHistory:", err);
            throw err;
        }
    }
    static async createHistoryDoc(profileId) {
        try {
            const pid = typeof profileId === "string" ? new mongodb_1.ObjectId(profileId) : profileId;
            const newDoc = {
                profileId: pid,
                status: "idle",
                history: []
            };
            const result = await server_1.default.AddDocument(this.aiCollection, newDoc);
            if (!result || !result.insertedId) {
                throw new Error("Failed to create AI history document");
            }
            return true;
        }
        catch (err) {
            console.error("Error in createHistoryDoc:", err);
            throw err;
        }
    }
    static async saveToHistory(profileId, data) {
        try {
            const pid = typeof profileId === "string" ? new mongodb_1.ObjectId(profileId) : profileId;
            const result = await server_1.default.UpdateDocument(this.aiCollection, { profileId: pid }, { $push: { history: data }, $set: { status: "completed" } }, { upsert: true });
            if (!result || result.modifiedCount === 0) {
                throw new Error("Failed to save AI history entry");
            }
            return true;
        }
        catch (err) {
            console.error("Error in saveToHistory:", err);
            throw err;
        }
    }
    static async getHistoryStatus(profileId) {
        try {
            const pid = typeof profileId === "string" ? new mongodb_1.ObjectId(profileId) : profileId;
            const statusRes = await server_1.default.Aggregate(this.aiCollection, [
                { $match: { profileId: pid } },
                { $project: { status: 1, _id: 0 } }
            ]);
            if (!statusRes || statusRes.length === 0) {
                throw new Error("AI history document not found");
            }
            const status = statusRes[0].status;
            if (status === "completed") {
                await this.updateHistoryStatus(profileId, "idle");
            }
            return status;
        }
        catch (err) {
            console.error("Error in getHistoryStatus:", err);
            throw err;
        }
    }
    static async updateHistoryStatus(profileId, status) {
        try {
            const pid = typeof profileId === "string" ? new mongodb_1.ObjectId(profileId) : profileId;
            const result = await server_1.default.UpdateDocument(this.aiCollection, { profileId: pid }, { $set: { status } });
            if (!result || result.modifiedCount === 0) {
                throw new Error("Failed to update AI history status");
            }
            return true;
        }
        catch (err) {
            console.error("Error in updateHistoryStatus:", err);
            throw err;
        }
    }
    static async getAllHistory(profileId) {
        try {
            const pid = typeof profileId === "string" ? new mongodb_1.ObjectId(profileId) : profileId;
            const doc = await server_1.default.GetDocument(this.aiCollection, { profileId: pid });
            return doc;
        }
        catch (err) {
            console.error("Error in getAllHistory:", err);
            throw err;
        }
    }
}
exports.default = AiModel;
//# sourceMappingURL=ai.model.js.map