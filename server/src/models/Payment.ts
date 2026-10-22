import mongoose, { Document, Schema, Types } from 'mongoose';

export type PaymentMethod = 'Card (Simulated)' | 'UPI (Simulated)' | 'NetBanking (Simulated)';
export type TransactionStatus = 'Successful' | 'Failed' | 'Pending';

export interface IPayment extends Document {
  booking: Types.ObjectId;
  customer: Types.ObjectId;
  amount: number; // in INR
  currency: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  transactionReference: string;
  gatewayResponseSimulated?: string;
  invoiceNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    paymentMethod: {
      type: String,
      enum: ['Card (Simulated)', 'UPI (Simulated)', 'NetBanking (Simulated)'],
      default: 'Card (Simulated)'
    },
    status: {
      type: String,
      enum: ['Successful', 'Failed', 'Pending'],
      required: true,
      index: true
    },
    transactionReference: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    gatewayResponseSimulated: {
      type: String
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
