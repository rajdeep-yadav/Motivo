import { IPriceBreakdown } from '../models/Booking';

export interface PricingOptions {
  dailyRate: number;
  pickupDateTime: Date;
  returnDateTime: Date;
  includeInsurance?: boolean; // Optional add-on: 350 INR / day
  discountPercentage?: number; // Optional promo: e.g. 10%
}

/**
 * Motivo Authoritative Server-Side Pricing Engine
 *
 * Rules:
 * - Charge 1 billable day for each rental period of up to 24 hours.
 * - Round any additional partial 24-hour period up to the next billable day.
 * - billableDays = ceiling(rentalDuration / 24 hours)
 * - baseCharge = dailyRate * billableDays
 * - total = baseCharge + additionalCharges - discounts + tax
 *
 * All money computed with integer paise or precise decimals avoiding floating errors.
 */
export class PricingService {
  public static calculateRentalDays(pickup: Date, returnDate: Date): number {
    const diffMs = returnDate.getTime() - pickup.getTime();
    if (diffMs <= 0) {
      throw new Error('Return date/time must be strictly after pickup date/time.');
    }
    const msInDay = 24 * 60 * 60 * 1000;
    const days = Math.ceil(diffMs / msInDay);
    return Math.max(1, days);
  }

  public static calculatePrice(options: PricingOptions): IPriceBreakdown {
    const { dailyRate, pickupDateTime, returnDateTime, includeInsurance = false, discountPercentage = 0 } = options;

    if (dailyRate < 0) {
      throw new Error('Daily rate cannot be negative.');
    }

    const billableDays = this.calculateRentalDays(new Date(pickupDateTime), new Date(returnDateTime));
    
    // Daily base calculation
    const baseCharge = Math.round(dailyRate * billableDays);

    // Optional add-ons: comprehensive zero-dep insurance
    const additionalCharges = includeInsurance ? Math.round(350 * billableDays) : 0;

    // Discount handling
    const discountAmount = Math.min(baseCharge, Math.round((baseCharge * (discountPercentage || 0)) / 100));

    // GST calculation: 18% on net services
    const taxableAmount = baseCharge + additionalCharges - discountAmount;
    const tax = Math.round(taxableAmount * 0.18);

    const totalAmount = taxableAmount + tax;

    return {
      billableDays,
      dailyRate,
      baseCharge,
      additionalCharges,
      discounts: discountAmount,
      tax,
      totalAmount
    };
  }
}
