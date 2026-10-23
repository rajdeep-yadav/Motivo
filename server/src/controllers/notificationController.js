"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getMyNotifications = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Notification_1 = require("../models/Notification");
const memoryStore_1 = require("../store/memoryStore");
const getMyNotifications = async (req, res) => {
    try {
        const customerId = req.user.id || req.user._id;
        if (mongoose_1.default.connection.readyState !== 1) {
            const list = memoryStore_1.memoryStore.notifications.filter((n) => n.recipient === customerId.toString());
            res.status(200).json({
                success: true,
                unreadCount: list.filter((n) => !n.isRead).length,
                data: list
            });
            return;
        }
        const notifications = await Notification_1.Notification.find({ recipient: customerId })
            .sort({ createdAt: -1 })
            .limit(30);
        const unreadCount = await Notification_1.Notification.countDocuments({
            recipient: customerId,
            isRead: false
        });
        res.status(200).json({
            success: true,
            unreadCount,
            data: notifications
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyNotifications = getMyNotifications;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification_1.Notification.findOne({
            _id: id,
            recipient: req.user._id
        });
        if (!notification) {
            res.status(404).json({ success: false, message: 'Notification not found.' });
            return;
        }
        notification.isRead = true;
        await notification.save();
        res.status(200).json({
            success: true,
            data: notification
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        await Notification_1.Notification.updateMany({ recipient: req.user._id, isRead: false }, { $set: { isRead: true } });
        res.status(200).json({
            success: true,
            message: 'All notifications marked as read.'
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.markAllAsRead = markAllAsRead;
