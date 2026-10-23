"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const memoryStore_1 = require("../store/memoryStore");
const authenticate = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication required. No token provided.'
            });
            return;
        }
        const secret = process.env.JWT_SECRET || 'motivo_super_secure_academic_key_2026';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        let user = null;
        if (mongoose_1.default.connection.readyState === 1) {
            user = await User_1.User.findById(decoded.id);
        }
        else {
            const memUser = memoryStore_1.memoryStore.users.find((u) => u.id === decoded.id);
            if (memUser) {
                user = {
                    _id: memUser.id,
                    id: memUser.id,
                    name: memUser.name,
                    email: memUser.email,
                    role: memUser.role,
                    phone: memUser.phone,
                    drivingLicense: memUser.drivingLicense
                };
            }
        }
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User belonging to this token no longer exists.'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token.'
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Forbidden. You do not have permission to access this resource.'
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
