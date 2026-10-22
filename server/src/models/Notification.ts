import mongoose, { Document, Schema, Types } from 'mongoose';

export type NotificationType =
  | 'BOOKING_SUBMITTED'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_REJECTED'
  | 'BOOKING_CANCELLED'
  | 'PICKUP_RECORDED'
  | 'RETURN_RECORDED'
  | 'PAYMENT_SUCCESSFUL'
  | 'PAYMENT_FAILED'
  | 'SYSTEM_ALERT';

export interface INotification extends Document {
  recipient: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityId?: Types.ObjectId;
  entityType?: 'Booking' | 'Payment' | 'Vehicle';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    relatedEntityId: {
      type: Schema.Types.ObjectId
    },
    entityType: {
      type: String,
      enum: ['Booking', 'Payment', 'Vehicle']
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
