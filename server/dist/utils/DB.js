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
}
exports.default = DB;
//# sourceMappingURL=DB.js.map