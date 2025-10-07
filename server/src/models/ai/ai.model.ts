import { ObjectId } from "mongodb";
import db from "../../server";
import { AIHistoryEntry, HistoryDoc } from "../../types/ai.types";
export default class AiModel {

    private static aiCollection = "ai_history";

    public static async getRecentHistory(profileId: string | ObjectId) {
        try {
            const pid = typeof profileId === "string" ? new ObjectId(profileId) : profileId;
            const limit = 6;

            const result = await db.Aggregate(this.aiCollection, [
                { $match: { profileId: pid } },
                { $unwind: "$history" },
                { $sort: { "history.generatedAt": -1 } },
                { $limit: limit },
                { $replaceRoot: { newRoot: "$history" } }
            ]);

            return result || [];
        } catch (err) {
            console.error("Error in getRecentHistory:", err);
            throw err;
        }
    }

    public static async createHistoryDoc(profileId: string | ObjectId) {
        try {
            const pid = typeof profileId === "string" ? new ObjectId(profileId) : profileId;
            const newDoc: HistoryDoc = {
                profileId: pid,
                status: "idle",
                history: []
            };
            const result = await db.AddDocument(this.aiCollection, newDoc);
            if (!result || !result.insertedId) {
                throw new Error("Failed to create AI history document");
            }
            return true;
        } catch (err) {
            console.error("Error in createHistoryDoc:", err);
            throw err;
        }
    }

    public static async saveToHistory(profileId: string | ObjectId, data: AIHistoryEntry) {
        try {
            const pid = typeof profileId === "string" ? new ObjectId(profileId) : profileId;
            const result = await db.UpdateDocument(
                this.aiCollection,
                { profileId: pid },
                { $push: { history: data }, $set: { status: "completed" } },
                { upsert: true }
            );

            if (!result || result.modifiedCount === 0) {
                throw new Error("Failed to save AI history entry");
            }

            return true;
        } catch (err) {
            console.error("Error in saveToHistory:", err);
            throw err;
        }
    }

    public static async getHistoryStatus(profileId: string | ObjectId) {
        try {
            const pid = typeof profileId === "string" ? new ObjectId(profileId) : profileId;

            const statusRes = await db.Aggregate(this.aiCollection, [
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
        } catch (err) {
            console.error("Error in getHistoryStatus:", err);
            throw err;
        }
    }

    public static async updateHistoryStatus(profileId: string | ObjectId, status: "idle" | "processing" | "error" | "completed") {
        try {
            const pid = typeof profileId === "string" ? new ObjectId(profileId) : profileId;
            const result = await db.UpdateDocument(this.aiCollection, { profileId: pid }, { $set: { status } });
            if (!result || result.modifiedCount === 0) {
                throw new Error("Failed to update AI history status");
            }
            return true;
        } catch (err) {
            console.error("Error in updateHistoryStatus:", err);
            throw err;
        }
    }

    public static async getAllHistory(profileId: string | ObjectId) {
        try {
            const pid = typeof profileId === "string" ? new ObjectId(profileId) : profileId;
            const doc = await db.GetDocument(this.aiCollection, { profileId: pid }) as HistoryDoc | null;
            return doc;
        } catch (err) {
            console.error("Error in getAllHistory:", err);
            throw err;
        }
    }
}