import Express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import routerV1 from "./routes/v1";
import { v2 as cloudinary } from "cloudinary";
import DB from "./utils/DB";
dotenv.config({ path: path.join(__dirname, './dotenv/.env') });

const PORT = process.env.PORT;
const server = Express();
const db = new DB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

server.use(cors());
server.use(Express.json({ limit: '50mb' }));
server.use(Express.urlencoded({ limit: '50mb', extended: true }));

server.use('/api', routerV1);

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
        }
        process.on('SIGINT', closeDBConnection);
        process.on('SIGTERM', closeDBConnection);
    } catch (error) {
        console.error("Error starting server: ", error);
        process.exit(1);
    }
})();

export default db;