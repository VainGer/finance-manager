"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const v1_1 = __importDefault(require("./routes/v1"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, './dotenv/.env') });
const PORT = process.env.PORT;
const server = (0, express_1.default)();
server.use((0, cors_1.default)());
server.use(express_1.default.json());
server.use(express_1.default.json({ limit: '50mb' }));
server.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
server.use('/api', v1_1.default);
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map