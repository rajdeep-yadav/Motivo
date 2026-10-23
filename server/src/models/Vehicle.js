"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const VehicleSchema = new mongoose_1.Schema({
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
        enum: ['Sedan', 'SUV', 'Luxury', 'Sports', 'Hatchback', 'Electric', 'Bike'],
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
}, {
    timestamps: true
});
// Compound index for common vehicle searches
VehicleSchema.index({ operationalStatus: 1, category: 1, dailyRate: 1 });
VehicleSchema.index({ make: 'text', model: 'text', description: 'text' });
exports.Vehicle = mongoose_1.default.model('Vehicle', VehicleSchema);
