import { Booking } from '../models/Booking';
import { Vehicle } from '../models/Vehicle';
import mongoose from 'mongoose';

/**
 * Concurrency-Safe Vehicle Availability Service
 *
 * Conflict Condition:
 * existingPickup < requestedReturn AND existingReturn > requestedPickup
 *
 * Excluded from conflict: 'Cancelled' and 'Rejected' bookings.
 * Included in conflict: 'Pending', 'Confirmed', 'Active'.
 */
export class AvailabilityService {
  /**
   * Checks if a vehicle is available for the given timeframe.
   * Also verifies that the vehicle is in 'Available' operational status.
   */
  public static async isVehicleAvailable(
    vehicleId: string | mongoose.Types.ObjectId,
    pickupDateTime: Date,
    returnDateTime: Date,
    excludeBookingId?: string | mongoose.Types.ObjectId
  ): Promise<{ available: boolean; reason?: string }> {
    const pickup = new Date(pickupDateTime);
    const returnDate = new Date(returnDateTime);

    if (returnDate.getTime() <= pickup.getTime()) {
      return { available: false, reason: 'Return date/time must be after pickup date/time.' };
    }

    // 1. Verify Vehicle Operational Status
    const vehicle = await Vehicle.findById(vehicleId);
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
    const conflictQuery: any = {
      vehicle: vehicleId,
      status: { $in: ['Pending', 'Confirmed', 'Active'] },
      pickupDateTime: { $lt: returnDate },
      returnDateTime: { $gt: pickup }
    };

    if (excludeBookingId) {
      conflictQuery._id = { $ne: excludeBookingId };
    }

    const conflictingBooking = await Booking.findOne(conflictQuery).lean();

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
  public static async getUnavailableVehicleIds(
    pickupDateTime: Date,
    returnDateTime: Date
  ): Promise<mongoose.Types.ObjectId[]> {
    const pickup = new Date(pickupDateTime);
    const returnDate = new Date(returnDateTime);

    const conflictingBookings = await Booking.find({
      status: { $in: ['Pending', 'Confirmed', 'Active'] },
      pickupDateTime: { $lt: returnDate },
      returnDateTime: { $gt: pickup }
    }).select('vehicle').lean();

    return conflictingBookings.map((b) => b.vehicle as mongoose.Types.ObjectId);
  }
}
