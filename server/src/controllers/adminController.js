"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReports = exports.getCustomers = exports.getDashboardStats = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Vehicle_1 = require("../models/Vehicle");
const Booking_1 = require("../models/Booking");
const User_1 = require("../models/User");
const Payment_1 = require("../models/Payment");
const memoryStore_1 = require("../store/memoryStore");
const getDashboardStats = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState !== 1) {
            const totalVehicles = memoryStore_1.memoryStore.vehicles.length;
            const availableVehicles = memoryStore_1.memoryStore.vehicles.filter((v) => v.operationalStatus === 'Available').length;
            const activeRentals = memoryStore_1.memoryStore.bookings.filter((b) => b.status === 'Active').length;
            const pendingBookings = memoryStore_1.memoryStore.bookings.filter((b) => b.status === 'Pending').length;
            const totalCustomers = memoryStore_1.memoryStore.users.filter((u) => u.role === 'customer').length;
            const totalRevenue = memoryStore_1.memoryStore.payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
            res.status(200).json({
                success: true,
                stats: {
                    totalVehicles,
                    availableVehicles,
                    activeRentals,
                    pendingBookings,
                    totalCustomers,
                    totalRevenue
                },
                categoryStats: [
                    { category: 'Sedan', count: 1 },
                    { category: 'SUV', count: 2 },
                    { category: 'Electric', count: 1 },
                    { category: 'Sports', count: 1 },
                    { category: 'Luxury', count: 1 }
                ],
                bookingStatusStats: [
                    { status: 'Confirmed', count: 1 },
                    { status: 'Active', count: 1 }
                ],
                recentBookings: memoryStore_1.memoryStore.bookings.slice(0, 5)
            });
            return;
        }
        const [totalVehicles, availableVehicles, activeRentals, pendingBookings, totalCustomers, successfulPayments] = await Promise.all([
            Vehicle_1.Vehicle.countDocuments(),
            Vehicle_1.Vehicle.countDocuments({ operationalStatus: 'Available' }),
            Booking_1.Booking.countDocuments({ status: 'Active' }),
            Booking_1.Booking.countDocuments({ status: 'Pending' }),
            User_1.User.countDocuments({ role: 'customer' }),
            Payment_1.Payment.find({ status: 'Successful' }).select('amount')
        ]);
        const totalRevenue = successfulPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        // Fleet distribution by category
        const categoryStats = await Vehicle_1.Vehicle.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        // Booking status distribution
        const bookingStatusStats = await Booking_1.Booking.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        // Recent 5 Bookings
        const recentBookings = await Booking_1.Booking.find()
            .populate('vehicle', 'make model')
            .populate('customer', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);
        res.status(200).json({
            success: true,
            stats: {
                totalVehicles,
                availableVehicles,
                activeRentals,
                pendingBookings,
                totalCustomers,
                totalRevenue
            },
            categoryStats: categoryStats.map((c) => ({ category: c._id, count: c.count })),
            bookingStatusStats: bookingStatusStats.map((b) => ({ status: b._id, count: b.count })),
            recentBookings
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
const getCustomers = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState !== 1) {
            const customers = memoryStore_1.memoryStore.users.map((u) => ({
                id: u.id,
                _id: u.id,
                name: u.name,
                email: u.email,
                phone: u.phone,
                drivingLicense: u.drivingLicense,
                role: u.role
            }));
            res.status(200).json({ success: true, data: customers });
            return;
        }
        const { search } = req.query;
        const query = { role: 'customer' };
        if (search && typeof search === 'string') {
            const reg = new RegExp(search.trim(), 'i');
            query.$or = [{ name: reg }, { email: reg }, { phone: reg }];
        }
        const customers = await User_1.User.find(query).select('-passwordHash').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: customers
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCustomers = getCustomers;
const getReports = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState !== 1) {
            const sampleReport = [
                { date: '17 Oct', revenue: 14000, bookings: 2 },
                { date: '18 Oct', revenue: 19500, bookings: 2 },
                { date: '19 Oct', revenue: 8500, bookings: 1 },
                { date: '20 Oct', revenue: 24249, bookings: 3 },
                { date: '21 Oct', revenue: 33630, bookings: 4 },
                { date: '22 Oct', revenue: 42000, bookings: 5 },
                { date: '23 Oct', revenue: 57879, bookings: 6 }
            ];
            res.status(200).json({ success: true, data: sampleReport });
            return;
        }
        // 7-day revenue and booking count trend
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const payments = await Payment_1.Payment.find({
            status: 'Successful',
            createdAt: { $gte: sevenDaysAgo }
        }).sort({ createdAt: 1 });
        // Aggregate by day
        const trendMap = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            trendMap[key] = { date: key, revenue: 0, bookings: 0 };
        }
        payments.forEach((p) => {
            const key = p.createdAt.toISOString().split('T')[0];
            if (trendMap[key]) {
                trendMap[key].revenue += p.amount;
                trendMap[key].bookings += 1;
            }
        });
        res.status(200).json({
            success: true,
            data: Object.values(trendMap)
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getReports = getReports;
