import { Response } from 'express';
import mongoose from 'mongoose';
import { Payment } from '../models/Payment';
import { Booking } from '../models/Booking';
import { Notification } from '../models/Notification';
import { AuthenticatedRequest } from '../middleware/auth';
import { memoryStore } from '../store/memoryStore';

const generateInvoiceNumber = (): string => {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `INV-MOT-${rand}`;
};

export const createSimulatedPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user!._id;
    const { bookingId, paymentMethod = 'Card (Simulated)', outcome = 'Successful' } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const b = memoryStore.bookings.find((bk) => bk._id === bookingId);
      if (!b) {
        res.status(404).json({ success: false, message: 'Booking not found.' });
        return;
      }
      const isSuccess = outcome === 'Successful';
      const paymentStatus = isSuccess ? 'Successful' : outcome === 'Pending' ? 'Pending' : 'Failed';
      const txRef = `SIM-TX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const invoiceNumber = generateInvoiceNumber();

      const payment = {
        _id: 'pay_' + Date.now(),
        booking: b._id,
        customer: (req.user as any).id || req.user!._id,
        amount: b.priceBreakdown.totalAmount,
        currency: 'INR',
        paymentMethod,
        status: paymentStatus,
        transactionReference: txRef,
        invoiceNumber,
        createdAt: new Date().toISOString()
      };

      memoryStore.payments.unshift(payment);

      if (isSuccess) {
        b.paymentStatus = 'Paid';
        if (b.status === 'Pending') b.status = 'Confirmed';
        memoryStore.notifications.unshift({
          _id: 'notif_' + Date.now(),
          recipient: (req.user as any).id || req.user!._id,
          type: 'PAYMENT_SUCCESSFUL',
          title: 'Payment Successful (Simulated)',
          message: `Your payment of ₹${b.priceBreakdown.totalAmount.toLocaleString('en-IN')} for ${b.bookingReference} has been verified. Invoice: ${invoiceNumber}`,
          isRead: false,
          createdAt: new Date().toISOString()
        });
      } else {
        b.paymentStatus = 'Failed';
        memoryStore.notifications.unshift({
          _id: 'notif_' + Date.now(),
          recipient: (req.user as any).id || req.user!._id,
          type: 'PAYMENT_FAILED',
          title: 'Payment Failed (Simulated)',
          message: `Your simulated payment transaction ${txRef} could not be settled.`,
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }

      res.status(200).json({
        success: isSuccess,
        message: isSuccess ? 'Simulated payment succeeded.' : 'Simulated payment failed as requested.',
        data: payment
      });
      return;
    }

    // Customer ownership check
    if (
      req.user!.role !== 'admin' &&
      booking.customer.toString() !== customerId.toString()
    ) {
      res.status(403).json({ success: false, message: 'Forbidden. Unauthorized payment attempt.' });
      return;
    }

    if (booking.paymentStatus === 'Paid') {
      res.status(400).json({ success: false, message: 'This booking has already been paid for.' });
      return;
    }

    const txRef = `SIM-TX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const invoiceNumber = generateInvoiceNumber();

    const isSuccess = outcome === 'Successful';
    const paymentStatus = isSuccess ? 'Successful' : outcome === 'Pending' ? 'Pending' : 'Failed';

    const payment = await Payment.create({
      booking: booking._id,
      customer: customerId,
      amount: booking.priceBreakdown.totalAmount,
      currency: 'INR',
      paymentMethod,
      status: paymentStatus,
      transactionReference: txRef,
      gatewayResponseSimulated: isSuccess ? 'Simulated payment completed successfully.' : 'Payment declined or simulation failure.',
      invoiceNumber
    });

    if (isSuccess) {
      booking.paymentStatus = 'Paid';
      // Auto confirm if currently pending
      if (booking.status === 'Pending') {
        booking.status = 'Confirmed';
      }
      await booking.save();

      await Notification.create({
        recipient: customerId,
        type: 'PAYMENT_SUCCESSFUL',
        title: 'Payment Successful (Simulated)',
        message: `Your payment of ₹${booking.priceBreakdown.totalAmount} for ${booking.bookingReference} was processed successfully. Invoice: ${invoiceNumber}`,
        relatedEntityId: payment._id,
        entityType: 'Payment'
      });
    } else {
      booking.paymentStatus = 'Failed';
      await booking.save();

      await Notification.create({
        recipient: customerId,
        type: 'PAYMENT_FAILED',
        title: 'Payment Failed (Simulated)',
        message: `Your simulated payment transaction ${txRef} could not be processed.`,
        relatedEntityId: payment._id,
        entityType: 'Payment'
      });
    }

    res.status(200).json({
      success: isSuccess,
      message: isSuccess ? 'Simulated payment succeeded.' : 'Simulated payment failed as requested.',
      data: payment
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentReceipt = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId)
      .populate({
        path: 'booking',
        populate: { path: 'vehicle' }
      })
      .populate('customer', 'name email phone');

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment record not found.' });
      return;
    }

    if (
      req.user!.role !== 'admin' &&
      payment.customer._id.toString() !== req.user!._id.toString()
    ) {
      res.status(403).json({ success: false, message: 'Forbidden.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
