"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../../utils/DB"));
class UserModel {
    static async createUser(req, res) {
        const db = new DB_1.default();
        try {
            const user = req.body;
            if (!user || !user.username || !user.password) {
                const errorMsg = !user ? "User data is required" :
                    !user.username ? "Username is required" : "Password is required";
                res.status(400).json({ message: errorMsg });
            }
            await this.db.connect();
            const registeredUser = false;
            if (!registeredUser) {
                res.status(400).json({ message: "User already exists" });
            }
            else {
                res.status(201).json({
                    message: "User registered successfully",
                    user: registeredUser
                });
            }
            await this.db.disconnect();
        }
        catch (error) {
            console.log("Error creating user: ", error);
            res.status(500).json({ error: "Internal server error" });
            throw error;
        }
    }
}
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map