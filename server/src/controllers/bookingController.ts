import { Response } from 'express';
import mongoose from 'mongoose';
import { Booking, BookingStatus } from '../models/Booking';
import { Vehicle } from '../models/Vehicle';
import { Notification } from '../models/Notification';
import { AuthenticatedRequest } from '../middleware/auth';
import { PricingService } from '../services/pricingService';
import { AvailabilityService } from '../services/availabilityService';
import { memoryStore } from '../store/memoryStore';

// Reference Generator: MOTIVO-YYYYMMDD-XXXX
const generateBookingRef = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MOT-${dateStr}-${randomStr}`;
};

export const createBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user!._id;
    const { vehicleId, pickupDateTime, returnDateTime, specialRequests, includeInsurance } = req.body;

    if (!vehicleId || !pickupDateTime || !returnDateTime) {
      res.status(400).json({ success: false, message: 'Vehicle, pickup time, and return time are required.' });
      return;
    }

    const pickup = new Date(pickupDateTime);
    const returnDate = new Date(returnDateTime);

    if (returnDate <= pickup) {
      res.status(400).json({ success: false, message: 'Return date/time must be strictly after pickup date/time.' });
      return;
    }

    // If MongoDB is not connected, handle in memoryStore
    if (mongoose.connection.readyState !== 1) {
      const v = memoryStore.vehicles.find((veh) => veh._id === vehicleId);
      if (!v) {
        res.status(404).json({ success: false, message: 'Vehicle not found.' });
        return;
      }
      const priceBreakdown = PricingService.calculatePrice({
        dailyRate: v.dailyRate,
        pickupDateTime: pickup,
        returnDateTime: returnDate,
        includeInsurance: Boolean(includeInsurance)
      });
      const bookingReference = generateBookingRef();
      const newBk = {
        _id: 'bk_' + Date.now(),
        bookingReference,
        customer: (req.user as any).id || req.user!._id,
        vehicle: v,
        pickupDateTime: pickup.toISOString(),
        returnDateTime: returnDate.toISOString(),
        status: 'Pending',
        paymentStatus: 'Unpaid',
        priceBreakdown,
        specialRequests,
        createdAt: new Date().toISOString()
      };
      memoryStore.bookings.unshift(newBk);
      memoryStore.notifications.unshift({
        _id: 'notif_' + Date.now(),
        recipient: (req.user as any).id || req.user!._id,
        type: 'BOOKING_SUBMITTED',
        title: 'Booking Submitted',
        message: `Your booking for ${v.make} ${v.model} (${bookingReference}) has been received.`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
      res.status(201).json({ success: true, message: 'Booking created successfully.', data: newBk });
      return;
    }

    // Availability validation on backend
    const availability = await AvailabilityService.isVehicleAvailable(vehicleId, pickup, returnDate);
    if (!availability.available) {
      res.status(409).json({
        success: false,
        message: availability.reason || 'Vehicle is not available for the requested period.'
      });
      return;
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      res.status(404).json({ success: false, message: 'Vehicle not found.' });
      return;
    }

    // Server-side authoritative price calculation
    const priceBreakdown = PricingService.calculatePrice({
      dailyRate: vehicle.dailyRate,
      pickupDateTime: pickup,
      returnDateTime: returnDate,
      includeInsurance: Boolean(includeInsurance)
    });

    const bookingReference = generateBookingRef();

    const booking = await Booking.create({
      bookingReference,
      customer: customerId,
      vehicle: vehicle._id,
      pickupDateTime: pickup,
      returnDateTime: returnDate,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      priceBreakdown,
      specialRequests
    });

    // Create user notification
    await Notification.create({
      recipient: customerId,
      type: 'BOOKING_SUBMITTED',
      title: 'Booking Submitted',
      message: `Your booking reservation for ${vehicle.make} ${vehicle.model} (${bookingReference}) has been received and is pending confirmation.`,
      relatedEntityId: booking._id,
      entityType: 'Booking'
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully.',
      data: booking
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = (req.user as any).id || req.user!._id;
    if (mongoose.connection.readyState !== 1) {
      const bks = memoryStore.bookings.filter((b) => b.customer === customerId.toString());
      res.status(200).json({ success: true, data: bks });
      return;
    }

    const bookings = await Booking.find({ customer: customerId })
      .populate('vehicle')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate('vehicle').populate('customer', 'name email phone');

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    // Authorization check: User can only see their own booking unless they are an admin
    if (
      req.user!.role !== 'admin' &&
      booking.customer._id.toString() !== req.user!._id.toString()
    ) {
      res.status(403).json({ success: false, message: 'Forbidden. You cannot view this booking.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(id).populate('vehicle');
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    // Customer ownership or admin
    if (
      req.user!.role !== 'admin' &&
      booking.customer.toString() !== req.user!._id.toString()
    ) {
      res.status(403).json({ success: false, message: 'Forbidden.' });
      return;
    }

    // Allowed cancellation statuses: Pending and Confirmed (before pickup)
    if (!['Pending', 'Confirmed'].includes(booking.status)) {
      res.status(400).json({
        success: false,
        message: `Bookings with status '${booking.status}' cannot be cancelled.`
      });
      return;
    }

    booking.status = 'Cancelled';
    booking.cancellationReason = cancellationReason || 'Cancelled by user';
    await booking.save();

    await Notification.create({
      recipient: booking.customer,
      type: 'BOOKING_CANCELLED',
      title: 'Booking Cancelled',
      message: `Booking ${booking.bookingReference} has been cancelled.`,
      relatedEntityId: booking._id,
      entityType: 'Booking'
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: booking
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin booking actions
export const getAllBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(200).json({ success: true, data: memoryStore.bookings });
      return;
    }
    const { status, search } = req.query;
    const query: any = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && typeof search === 'string') {
      query.bookingReference = new RegExp(search.trim(), 'i');
    }

    const bookings = await Booking.find(query)
      .populate('vehicle')
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const b = memoryStore.bookings.find((bk) => bk._id === id);
      if (!b) {
        res.status(404).json({ success: false, message: 'Booking not found.' });
        return;
      }
      b.status = status;
      res.status(200).json({ success: true, message: `Booking status updated to ${status}.`, data: b });
      return;
    }

    const booking = await Booking.findById(id).populate('vehicle');
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    const currentStatus = booking.status;
    const targetStatus = status as BookingStatus;

    // Documented Valid State Transitions:
    // Pending -> Confirmed, Rejected, Cancelled
    // Confirmed -> Active (Pickup recorded), Cancelled
    // Active -> Completed (Return recorded)
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      Pending: ['Confirmed', 'Rejected', 'Cancelled'],
      Confirmed: ['Active', 'Cancelled'],
      Active: ['Completed'],
      Completed: [],
      Cancelled: [],
      Rejected: []
    };

    if (!validTransitions[currentStatus].includes(targetStatus)) {
      res.status(400).json({
        success: false,
        message: `Invalid state transition from '${currentStatus}' to '${targetStatus}'.`
      });
      return;
    }

    booking.status = targetStatus;

    if (targetStatus === 'Rejected') {
      booking.rejectionReason = rejectionReason || 'Rejected by fleet administrator.';
    }

    if (targetStatus === 'Active') {
      booking.pickupRecordedAt = new Date();
    }

    if (targetStatus === 'Completed') {
      booking.returnRecordedAt = new Date();
    }

    await booking.save();

    // Notify customer
    let notifType: any = 'SYSTEM_ALERT';
    let notifTitle = `Booking ${targetStatus}`;
    if (targetStatus === 'Confirmed') notifType = 'BOOKING_CONFIRMED';
    if (targetStatus === 'Rejected') notifType = 'BOOKING_REJECTED';
    if (targetStatus === 'Active') notifType = 'PICKUP_RECORDED';
    if (targetStatus === 'Completed') notifType = 'RETURN_RECORDED';

    await Notification.create({
      recipient: booking.customer,
      type: notifType,
      title: notifTitle,
      message: `Your booking for ${(booking.vehicle as any)?.make || 'vehicle'} (${booking.bookingReference}) is now ${targetStatus}.`,
      relatedEntityId: booking._id,
      entityType: 'Booking'
    });

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${targetStatus}.`,
      data: booking
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
