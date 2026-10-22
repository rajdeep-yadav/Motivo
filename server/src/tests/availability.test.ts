/**
 * Mathematical Verification for Availability Conflict Formula:
 * 
 * Condition:
 * existingPickup < requestedReturn AND existingReturn > requestedPickup
 */
describe('Availability Conflict Logic Mathematical Tests', () => {
  const isOverlap = (
    ePickup: number,
    eReturn: number,
    rPickup: number,
    rReturn: number
  ) => {
    return ePickup < rReturn && eReturn > rPickup;
  };

  it('detects standard overlapping periods', () => {
    // Existing: Day 2 to Day 5
    // Requested: Day 3 to Day 6
    expect(isOverlap(2, 5, 3, 6)).toBe(true);
  });

  it('detects completely enclosed requested period', () => {
    // Existing: Day 1 to Day 10
    // Requested: Day 3 to Day 4
    expect(isOverlap(1, 10, 3, 4)).toBe(true);
  });

  it('detects requested period that completely spans over existing period', () => {
    // Existing: Day 4 to Day 6
    // Requested: Day 2 to Day 8
    expect(isOverlap(4, 6, 2, 8)).toBe(true);
  });

  it('ALLOWS adjacent bookings where existing ends exactly when requested begins', () => {
    // Existing: Day 2 to Day 5 (ends at 10:00)
    // Requested: Day 5 to Day 8 (starts at 10:00)
    // existingReturn (5) > requestedPickup (5) is FALSE (5 > 5 is false) -> No overlap!
    expect(isOverlap(2, 5, 5, 8)).toBe(false);
  });

  it('ALLOWS adjacent bookings where requested ends exactly when existing begins', () => {
    // Requested: Day 1 to Day 3
    // Existing: Day 3 to Day 5
    // existingPickup (3) < requestedReturn (3) is FALSE (3 < 3 is false) -> No overlap!
    expect(isOverlap(3, 5, 1, 3)).toBe(false);
  });

  it('ALLOWS completely disjoint non-overlapping dates', () => {
    // Existing: Day 10 to Day 15
    // Requested: Day 1 to Day 5
    expect(isOverlap(10, 15, 1, 5)).toBe(false);
  });
});
