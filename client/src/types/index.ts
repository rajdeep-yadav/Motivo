export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  drivingLicense?: string;
}

export type VehicleCategory = 'Sedan' | 'SUV' | 'Luxury' | 'Sports' | 'Hatchback' | 'Electric';
export type TransmissionType = 'Automatic' | 'Manual';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
export type OperationalStatus = 'Available' | 'Maintenance' | 'Retired';

export interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  category: VehicleCategory;
  description: string;
  images: string[];
  registrationNumber: string;
  transmission: TransmissionType;
  fuelType: FuelType;
  seatingCapacity: number;
  dailyRate: number;
  operationalStatus: OperationalStatus;
  features: string[];
  mileageLimitPerDay?: number;
  createdAt: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled' | 'Rejected';
export type PaymentStatus = 'Unpaid' | 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface PriceBreakdown {
  billableDays: number;
  dailyRate: number;
  baseCharge: number;
  additionalCharges: number;
  discounts: number;
  tax: number;
  totalAmount: number;
}

export interface Booking {
  _id: string;
  bookingReference: string;
  customer: User | string;
  vehicle: Vehicle;
  pickupDateTime: string;
  returnDateTime: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  priceBreakdown: PriceBreakdown;
  specialRequests?: string;
  cancellationReason?: string;
  rejectionReason?: string;
  pickupRecordedAt?: string;
  returnRecordedAt?: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  booking: Booking | string;
  customer: User | string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'Successful' | 'Failed' | 'Pending';
  transactionReference: string;
  invoiceNumber: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
