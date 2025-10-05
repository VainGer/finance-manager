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

    public static async saveToHistory(profileId: string | ObjectId, data: AIHistoryEntry) {
        try {
            const pid = typeof profileId === "string" ? new ObjectId(profileId) : profileId;
            const result = await db.UpdateDocument(
                this.aiCollection,
                { profileId: pid },
                { $push: { history: data } },
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

    public static async getAllHistory(profileId: string | ObjectId) {
        try {
            const pid = typeof profileId === "string" ? new ObjectId(profileId) : profileId;
            const doc = await db.GetDocument(this.aiCollection, { profileId: pid }) as HistoryDoc | null;
            return doc ? doc.history : [];
        } catch (err) {
            console.error("Error in getAllHistory:", err);
            throw err;
        }
    }
}