import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../dotenv/.env') });

export default class DB {
    private client: MongoClient | null = null;
    private dbName: string = process.env.DB_NAME as string;

    public async connect() {
        const uri = process.env.MONGO_URI;
        this.client = new MongoClient(uri as string);
        try {
            await this.client.connect();
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB: ", error);
            throw error;
        }
    }

    public async disconnect() {
        if (this.client) {
            try {
                await this.client.close();
                console.log("Disconnected from MongoDB");
            } catch (error) {
                console.error("Error disconnecting from MongoDB: ", error);
                throw error;
            }
        }
    }

    async AddDocument(collection: string, document: any) {
        try {
            const res = await this.client?.db(this.dbName).collection(collection).insertOne(document);
            return res;
        } catch (error) {
            console.error("Error adding document: ", error);
            throw error;
        }
    }

    async GetCollection(collection: string) {
        try {
            const res = await this.client?.db(this.dbName).collection(collection).find().toArray();
            return res;
        } catch (error) {
            console.error("Error getting document: ", error);
            throw error;
        }
    }

    async GetDocument(collection: string, query: any, options?: any) {
        try {
            const document = await this.client?.db(this.dbName).collection(collection).findOne(query, options);
            return document;
        } catch (error) {
            console.error("Error getting document: ", error);
            throw error;
        }
    }

    async GetDocuments(collection: string, query: any) {
        try {
            const documents = await this.client?.db(this.dbName).collection(collection).find(query).toArray();
            return documents;
        } catch (error) {
            console.error("Error getting documents: ", error);
            throw error;
        }
    }

    async UpdateDocument(collection: string, query: any, update: any, options?: any) {
        try {
            const res = await this.client?.db(this.dbName).collection(collection).updateOne(query, update, options);
            return res;
        } catch (error) {
            console.error("Error updating document: ", error);
            throw error;
        }
    }

    async DeleteDocument(collection: string, query: any) {
        try {
            const res = await this.client?.db(this.dbName).collection(collection).deleteOne(query);
            return res;
        } catch (error) {
            console.error("Error deleting document: ", error);
            throw error;
        }
    }
}

