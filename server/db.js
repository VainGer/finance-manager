import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "./dotenv/config.env" });
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function connectDB() {
    try {
        await client.connect();
        const db = client.db('FinanceManager');
        await db.command({ ping: 1 });
        console.log('Connected to MongoDB');
        return db;
    } catch (error) {
        console.log('Could not connect to MongoDB, error: ', error);
        throw error;
    }
}

export async function getDB() {
    const db = await connectDB();
    if (!db) {
        throw new Error('Database connection failed');
    }
    return db;
}