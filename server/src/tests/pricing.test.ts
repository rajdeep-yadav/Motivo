import { PricingService } from '../services/pricingService';

describe('PricingService Unit Tests', () => {
  const dailyRate = 5000;

  it('charges exactly 1 billable day for a rental duration under 24 hours', () => {
    const pickup = new Date('2026-11-01T10:00:00Z');
    const returnDate = new Date('2026-11-01T18:00:00Z'); // 8 hours

    const result = PricingService.calculatePrice({
      dailyRate,
      pickupDateTime: pickup,
      returnDateTime: returnDate
    });

    expect(result.billableDays).toBe(1);
    expect(result.baseCharge).toBe(5000);
    expect(result.tax).toBe(Math.round(5000 * 0.18));
    expect(result.totalAmount).toBe(5000 + Math.round(5000 * 0.18));
  });

  it('rounds partial 24-hour periods up to the next billable day (e.g. 26 hours -> 2 days)', () => {
    const pickup = new Date('2026-11-01T10:00:00Z');
    const returnDate = new Date('2026-11-02T12:00:00Z'); // 26 hours

    const result = PricingService.calculatePrice({
      dailyRate,
      pickupDateTime: pickup,
      returnDateTime: returnDate
    });

    expect(result.billableDays).toBe(2);
    expect(result.baseCharge).toBe(10000);
  });

  it('charges exactly 2 billable days for exactly 48 hours', () => {
    const pickup = new Date('2026-11-01T10:00:00Z');
    const returnDate = new Date('2026-11-03T10:00:00Z'); // 48 hours

    const result = PricingService.calculatePrice({
      dailyRate,
      pickupDateTime: pickup,
      returnDateTime: returnDate
    });

    expect(result.billableDays).toBe(2);
    expect(result.baseCharge).toBe(10000);
  });

  it('accurately includes optional comprehensive insurance charges per day', () => {
    const pickup = new Date('2026-11-01T10:00:00Z');
    const returnDate = new Date('2026-11-04T10:00:00Z'); // 3 days

    const result = PricingService.calculatePrice({
      dailyRate,
      pickupDateTime: pickup,
      returnDateTime: returnDate,
      includeInsurance: true
    });

    expect(result.billableDays).toBe(3);
    expect(result.baseCharge).toBe(15000);
    expect(result.additionalCharges).toBe(350 * 3); // 1050
    const taxable = 15000 + 1050;
    expect(result.tax).toBe(Math.round(taxable * 0.18));
    expect(result.totalAmount).toBe(taxable + Math.round(taxable * 0.18));
  });

  it('throws an error if return date is earlier than or equal to pickup date', () => {
    const pickup = new Date('2026-11-05T10:00:00Z');
    const returnDate = new Date('2026-11-04T10:00:00Z');

    expect(() => {
      PricingService.calculatePrice({
        dailyRate,
        pickupDateTime: pickup,
        returnDateTime: returnDate
      });
    }).toThrow('Return date/time must be strictly after pickup date/time.');
  });
});
