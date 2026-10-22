import mongoose, { Document, Schema, Types } from 'mongoose';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled' | 'Rejected';
export type PaymentStatus = 'Unpaid' | 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface IPriceBreakdown {
  billableDays: number;
  dailyRate: number;
  baseCharge: number;
  additionalCharges: number; // e.g. insurance / roadside assistance
  discounts: number;
  tax: number; // e.g., GST 18%
  totalAmount: number; // Final rounded INR
}

export interface IBooking extends Document {
  bookingReference: string;
  customer: Types.ObjectId;
  vehicle: Types.ObjectId;
  pickupDateTime: Date;
  returnDateTime: Date;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  priceBreakdown: IPriceBreakdown;
  specialRequests?: string;
  cancellationReason?: string;
  rejectionReason?: string;
  pickupRecordedAt?: Date;
  returnRecordedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
      index: true
    },
    pickupDateTime: {
      type: Date,
      required: true,
      index: true
    },
    returnDateTime: {
      type: Date,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Pending',
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Unpaid',
      index: true
    },
    priceBreakdown: {
      billableDays: { type: Number, required: true },
      dailyRate: { type: Number, required: true },
      baseCharge: { type: Number, required: true },
      additionalCharges: { type: Number, default: 0 },
      discounts: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true }
    },
    specialRequests: { type: String, trim: true },
    cancellationReason: { type: String, trim: true },
    rejectionReason: { type: String, trim: true },
    pickupRecordedAt: { type: Date },
    returnRecordedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

// High-performance compound index for collision/overlap checks:
// Condition: vehicle match + active statuses + overlap
BookingSchema.index({ vehicle: 1, status: 1, pickupDateTime: 1, returnDateTime: 1 });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
