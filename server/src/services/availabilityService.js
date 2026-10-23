"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityService = void 0;
const Booking_1 = require("../models/Booking");
const Vehicle_1 = require("../models/Vehicle");
/**
 * Concurrency-Safe Vehicle Availability Service
 *
 * Conflict Condition:
 * existingPickup < requestedReturn AND existingReturn > requestedPickup
 *
 * Excluded from conflict: 'Cancelled' and 'Rejected' bookings.
 * Included in conflict: 'Pending', 'Confirmed', 'Active'.
 */
class AvailabilityService {
    /**
     * Checks if a vehicle is available for the given timeframe.
     * Also verifies that the vehicle is in 'Available' operational status.
     */
    static async isVehicleAvailable(vehicleId, pickupDateTime, returnDateTime, excludeBookingId) {
        const pickup = new Date(pickupDateTime);
        const returnDate = new Date(returnDateTime);
        if (returnDate.getTime() <= pickup.getTime()) {
            return { available: false, reason: 'Return date/time must be after pickup date/time.' };
        }
        // 1. Verify Vehicle Operational Status
        const vehicle = await Vehicle_1.Vehicle.findById(vehicleId);
        if (!vehicle) {
            return { available: false, reason: 'Vehicle does not exist.' };
        }
        if (vehicle.operationalStatus !== 'Available') {
            return {
                available: false,
                reason: `Vehicle is currently in ${vehicle.operationalStatus} status and cannot be reserved.`
            };
        }
        // 2. Query for conflicting bookings
        const conflictQuery = {
            vehicle: vehicleId,
            status: { $in: ['Pending', 'Confirmed', 'Active'] },
            pickupDateTime: { $lt: returnDate },
            returnDateTime: { $gt: pickup }
        };
        if (excludeBookingId) {
            conflictQuery._id = { $ne: excludeBookingId };
        }
        const conflictingBooking = await Booking_1.Booking.findOne(conflictQuery).lean();
        if (conflictingBooking) {
            return {
                available: false,
                reason: `Vehicle is already booked or reserved between ${new Date(conflictingBooking.pickupDateTime).toLocaleDateString()} and ${new Date(conflictingBooking.returnDateTime).toLocaleDateString()}.`
            };
        }
        return { available: true };
    }
    /**
     * Find all vehicles available between pickup and return dates
     */
    static async getUnavailableVehicleIds(pickupDateTime, returnDateTime) {
        const pickup = new Date(pickupDateTime);
        const returnDate = new Date(returnDateTime);
        const conflictingBookings = await Booking_1.Booking.find({
            status: { $in: ['Pending', 'Confirmed', 'Active'] },
            pickupDateTime: { $lt: returnDate },
            returnDateTime: { $gt: pickup }
        }).select('vehicle').lean();
        return conflictingBookings.map((b) => b.vehicle);
    }
}
exports.AvailabilityService = AvailabilityService;
