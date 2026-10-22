import mongoose, { Schema, Types } from 'mongoose';

export type VehicleCategory = 'Sedan' | 'SUV' | 'Luxury' | 'Sports' | 'Hatchback' | 'Electric';
export type TransmissionType = 'Automatic' | 'Manual';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
export type OperationalStatus = 'Available' | 'Maintenance' | 'Retired';

export interface IVehicle {
  _id?: Types.ObjectId;
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
  dailyRate: number; // Stored in INR
  operationalStatus: OperationalStatus;
  features: string[];
  mileageLimitPerDay?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Year is required']
    },
    category: {
      type: String,
      enum: ['Sedan', 'SUV', 'Luxury', 'Sports', 'Hatchback', 'Electric'],
      required: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    images: {
      type: [String],
      default: []
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true
    },
    transmission: {
      type: String,
      enum: ['Automatic', 'Manual'],
      required: true,
      index: true
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
      required: true,
      index: true
    },
    seatingCapacity: {
      type: Number,
      required: true,
      min: 2,
      max: 12,
      index: true
    },
    dailyRate: {
      type: Number,
      required: [true, 'Daily rate is required'],
      min: [100, 'Daily rate must be at least 100 INR'],
      index: true
    },
    operationalStatus: {
      type: String,
      enum: ['Available', 'Maintenance', 'Retired'],
      default: 'Available',
      index: true
    },
    features: {
      type: [String],
      default: []
    },
    mileageLimitPerDay: {
      type: Number,
      default: 300 // km per day
    }
  },
  {
    timestamps: true
  }
);

// Compound index for common vehicle searches
VehicleSchema.index({ operationalStatus: 1, category: 1, dailyRate: 1 });
VehicleSchema.index({ make: 'text', model: 'text', description: 'text' });

export const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema);
