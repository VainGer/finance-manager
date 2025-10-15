"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../dotenv/.env') });
class DB {
    client = null;
    dbName = process.env.DB_NAME;
    async connect() {
        const uri = process.env.MONGO_URI;
        this.client = new mongodb_1.MongoClient(uri);
        try {
            await this.client.connect();
            console.log("Connected to MongoDB");
        }
        catch (error) {
            console.error("Error connecting to MongoDB: ", error);
            throw error;
        }
    }
    async disconnect() {
        if (this.client) {
            try {
                await this.client.close();
                console.log("Disconnected from MongoDB");
            }
            catch (error) {
                console.error("Error disconnecting from MongoDB: ", error);
                throw error;
            }
        }
    }
    getClient() {
        if (!this.client) {
            throw new Error("MongoDB client is not connected");
        }
        return this.client;
    }
    async AddDocument(collection, document) {
        try {
            const res = await this.client?.db(this.dbName).collection(collection).insertOne(document);
            return res;
        }
        catch (error) {
            console.error("Error adding document: ", error);
            throw error;
        }
    }
    async GetCollection(collection) {
        try {
            const res = await this.client?.db(this.dbName).collection(collection).find().toArray();
            return res;
        }
        catch (error) {
            console.error("Error getting document: ", error);
            throw error;
        }
    }
    async GetDocument(collection, query, options) {
        try {
            const document = await this.client?.db(this.dbName).collection(collection).findOne(query, options);
            return document;
        }
        catch (error) {
            console.error("Error getting document: ", error);
            throw error;
        }
    }
    async GetDocuments(collection, query) {
        try {
            const documents = await this.client?.db(this.dbName).collection(collection).find(query).toArray();
            return documents;
        }
        catch (error) {
            console.error("Error getting documents: ", error);
            throw error;
        }
    }
    async UpdateDocument(collection, query, update, options) {
        try {
            const res = await this.client?.db(this.dbName).collection(collection).updateOne(query, update, options);
            return res;
        }
        catch (error) {
            console.error("Error updating document: ", error);
            throw error;
        }
    }
    async DeleteDocument(collection, query) {
        try {
            const res = await this.client?.db(this.dbName).collection(collection).deleteOne(query);
            return res;
        }
        catch (error) {
            console.error("Error deleting document: ", error);
            throw error;
        }
    }
    async Aggregate(collection, pipeline) {
        try {
            const results = await this.client?.db(this.dbName).collection(collection).aggregate(pipeline).toArray();
            return results;
        }
        catch (error) {
            console.error("Error aggregating documents: ", error);
            throw error;
        }
    }
    async TransactionUpdateMany(operations) {
        const session = this.client?.startSession();
        if (!session)
            throw new Error("No Mongo client available");
        try {
            session.startTransaction();
            for (const op of operations) {
                await this.client
                    ?.db(this.dbName)
                    .collection(op.collection)
                    .updateMany(op.query, op.update, { session, ...(op.options || {}) });
            }
            await session.commitTransaction();
            return { success: true, message: "Transaction committed successfully" };
        }
        catch (error) {
            console.error("Error in Transaction:", error);
            await session.abortTransaction();
            return { success: false, message: "Transaction aborted due to error" };
        }
        finally {
            await session.endSession();
        }
    }
    async Find(collection, query = {}, options) {
        try {
            let cursor = this.client?.db(this.dbName).collection(collection).find(query);
            if (options?.sort) {
                cursor = cursor?.sort(options.sort);
            }
            if (options?.limit) {
                cursor = cursor?.limit(options.limit);
            }
            const results = await cursor?.toArray();
            return results || [];
        }
        catch (error) {
            console.error("Error finding documents: ", error);
            throw error;
        }
    }
}
exports.default = DB;
//# sourceMappingURL=DB.js.map