"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const v1_1 = __importDefault(require("./routes/v1"));
const cloudinary_1 = require("cloudinary");
const DB_1 = __importDefault(require("./utils/DB"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, './dotenv/.env') });
const PORT = process.env.PORT;
const server = (0, express_1.default)();
const db = new DB_1.default();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
server.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://smart-finance-shenkar2025.netlify.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
server.use((0, cookie_parser_1.default)());
server.use(express_1.default.json({ limit: '50mb' }));
server.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
server.use('/api', v1_1.default);
(async () => {
    console.log("Starting server...");
    try {
        await db.connect();
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
        const closeDBConnection = async () => {
            await db.disconnect();
            process.exit(0);
        };
        process.on('SIGINT', closeDBConnection);
        process.on('SIGTERM', closeDBConnection);
    }
    catch (error) {
        console.error("Error starting server: ", error);
        process.exit(1);
    }
})();
exports.default = db;
//# sourceMappingURL=server.js.map