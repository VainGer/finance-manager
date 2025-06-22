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
}
exports.default = DB;
//# sourceMappingURL=DB.js.map