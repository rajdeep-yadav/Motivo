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
exports.Booking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BookingSchema = new mongoose_1.Schema({
    bookingReference: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    vehicle: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true
});
// High-performance compound index for collision/overlap checks:
// Condition: vehicle match + active statuses + overlap
BookingSchema.index({ vehicle: 1, status: 1, pickupDateTime: 1, returnDateTime: 1 });
exports.Booking = mongoose_1.default.model('Booking', BookingSchema);
