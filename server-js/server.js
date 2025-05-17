import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router.js';
dotenv.config({ path: './dotenv/config.env' });

const PORT = process.env.PORT;
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.json({ extended: true, limit: "50mb" }));
server.use('/api', router);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});