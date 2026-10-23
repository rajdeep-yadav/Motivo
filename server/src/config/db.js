"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.warn('⚠️ MONGODB_URI is not defined in environment variables. Database connection skipped or waiting for configuration.');
        return;
    }
    try {
        const conn = await mongoose_1.default.connect(mongoURI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Non-fatal during early dev/build so tests and scripts can run safely with mock or when env is missing
    }
};
exports.connectDB = connectDB;
