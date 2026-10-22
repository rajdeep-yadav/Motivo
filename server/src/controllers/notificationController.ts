import { Response } from 'express';
import mongoose from 'mongoose';
import { Notification } from '../models/Notification';
import { AuthenticatedRequest } from '../middleware/auth';
import { memoryStore } from '../store/memoryStore';

export const getMyNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = (req.user as any).id || req.user!._id;
    if (mongoose.connection.readyState !== 1) {
      const list = memoryStore.notifications.filter((n) => n.recipient === customerId.toString());
      res.status(200).json({
        success: true,
        unreadCount: list.filter((n) => !n.isRead).length,
        data: list
      });
      return;
    }
    const notifications = await Notification.find({ recipient: customerId })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: customerId,
      isRead: false
    });

    res.status(200).json({
      success: true,
      unreadCount,
      data: notifications
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({
      _id: id,
      recipient: req.user!._id
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await Notification.updateMany(
      { recipient: req.user!._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
