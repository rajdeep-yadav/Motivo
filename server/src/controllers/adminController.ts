import { Response } from 'express';
import mongoose from 'mongoose';
import { Vehicle } from '../models/Vehicle';
import { Booking } from '../models/Booking';
import { User } from '../models/User';
import { Payment } from '../models/Payment';
import { AuthenticatedRequest } from '../middleware/auth';
import { memoryStore } from '../store/memoryStore';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const totalVehicles = memoryStore.vehicles.length;
      const availableVehicles = memoryStore.vehicles.filter((v) => v.operationalStatus === 'Available').length;
      const activeRentals = memoryStore.bookings.filter((b) => b.status === 'Active').length;
      const pendingBookings = memoryStore.bookings.filter((b) => b.status === 'Pending').length;
      const totalCustomers = memoryStore.users.filter((u) => u.role === 'customer').length;
      const totalRevenue = memoryStore.payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

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
        recentBookings: memoryStore.bookings.slice(0, 5)
      });
      return;
    }
    const [
      totalVehicles,
      availableVehicles,
      activeRentals,
      pendingBookings,
      totalCustomers,
      successfulPayments
    ] = await Promise.all([
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ operationalStatus: 'Available' }),
      Booking.countDocuments({ status: 'Active' }),
      Booking.countDocuments({ status: 'Pending' }),
      User.countDocuments({ role: 'customer' }),
      Payment.find({ status: 'Successful' }).select('amount')
    ]);

    const totalRevenue = successfulPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // Fleet distribution by category
    const categoryStats = await Vehicle.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Booking status distribution
    const bookingStatusStats = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent 5 Bookings
    const recentBookings = await Booking.find()
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    const query: any = { role: 'customer' };

    if (search && typeof search === 'string') {
      const reg = new RegExp(search.trim(), 'i');
      query.$or = [{ name: reg }, { email: reg }, { phone: reg }];
    }

    const customers = await User.find(query).select('-passwordHash').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReports = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // 7-day revenue and booking count trend
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const payments = await Payment.find({
      status: 'Successful',
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: 1 });

    // Aggregate by day
    const trendMap: Record<string, { date: string; revenue: number; bookings: number }> = {};
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
