"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const vehicleRoutes_1 = __importDefault(require("./routes/vehicleRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const createApp = () => {
    const app = (0, express_1.default)();
    // Security Middleware
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
        credentials: true
    }));
    // Rate Limiting for Auth
    const authLimiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 mins
        max: 100, // max 100 requests per 15 min per IP
        message: { success: false, message: 'Too many requests from this IP, please try again later.' }
    });
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    // Root health check endpoint
    app.get('/api/health', (req, res) => {
        res.status(200).json({
            status: 'UP',
            service: 'Motivo API Server',
            timestamp: new Date().toISOString()
        });
    });
    // Mount API Routes
    app.use('/api/auth', authLimiter, authRoutes_1.default);
    app.use('/api/vehicles', vehicleRoutes_1.default);
    app.use('/api/bookings', bookingRoutes_1.default);
    app.use('/api/payments', paymentRoutes_1.default);
    app.use('/api/notifications', notificationRoutes_1.default);
    app.use('/api/admin', adminRoutes_1.default);
    // 404 Handler
    app.use((req, res) => {
        res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
    });
    // Centralized Error Handling Middleware
    app.use((err, req, res, next) => {
        console.error('Unhandled Server Error:', err);
        const statusCode = err.statusCode || 500;
        const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
        res.status(statusCode).json({
            success: false,
            message
        });
    });
    return app;
};
exports.createApp = createApp;
