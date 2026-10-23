"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app");
const db_1 = require("./config/db");
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await (0, db_1.connectDB)();
    const app = (0, app_1.createApp)();
    app.listen(PORT, () => {
        console.log(`🚀 Motivo API Server is running on port ${PORT}`);
        console.log(`🔗 Health check available at: http://localhost:${PORT}/api/health`);
    });
};
startServer();
