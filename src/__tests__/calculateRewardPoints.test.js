import calculateRewardPoints from '../utils/calculateRewardPoints';

/**
 * Test suite for calculateRewardPoints utility function.
 *
 * Covers all scenarios:
 * - Purchases below, at, and above $50 and $100 thresholds
 * - Decimal amounts and floor behavior
 * - The specific example from requirements ($120 = 90 points)
 */
describe('calculateRewardPoints', () => {
  /* === Below Threshold Tests === */
  describe('purchases below $50 threshold (0 points)', () => {
    test('returns 0 points for $0 purchase', () => {
      expect(calculateRewardPoints(0)).toBe(0);
    });

    test('returns 0 points for $25 purchase', () => {
      expect(calculateRewardPoints(25)).toBe(0);
    });

    test('returns 0 points for $49.99 purchase', () => {
      expect(calculateRewardPoints(49.99)).toBe(0);
    });
  });

  /* === At $50 Boundary Tests === */
  describe('purchases at $50 boundary', () => {
    test('returns 0 points for exactly $50 (at boundary, not over)', () => {
      expect(calculateRewardPoints(50)).toBe(0);
    });

    test('returns 0 points for $50.99 (floors to $50, still at boundary)', () => {
      expect(calculateRewardPoints(50.99)).toBe(0);
    });

    test('returns 1 point for $51 (1 dollar over $50)', () => {
      expect(calculateRewardPoints(51)).toBe(1);
    });
  });

  /* === Between $50 and $100 Tests === */
  describe('purchases between $50 and $100 (1 pt/$ over $50)', () => {
    test('returns 25 points for $75 purchase', () => {
      expect(calculateRewardPoints(75)).toBe(25);
    });

    test('returns 25 points for $75.99 (floors to $75)', () => {
      expect(calculateRewardPoints(75.99)).toBe(25);
    });

    test('returns 35 points for $85.99 (floors to $85)', () => {
      expect(calculateRewardPoints(85.99)).toBe(35);
    });

    test('returns 49 points for $99 purchase', () => {
      expect(calculateRewardPoints(99)).toBe(49);
    });
  });

  /* === At $100 Boundary Tests === */
  describe('purchases at $100 boundary', () => {
    test('returns 50 points for exactly $100', () => {
      expect(calculateRewardPoints(100)).toBe(50);
    });

    test('returns 50 points for $100.20 (floors to $100) - decimal handling', () => {
      expect(calculateRewardPoints(100.2)).toBe(50);
    });

    test('returns 50 points for $100.49 (floors to $100) - decimal handling', () => {
      expect(calculateRewardPoints(100.49)).toBe(50);
    });
  });

  /* === Above $100 Tests === */
  describe('purchases above $100 (2 pts/$ over $100 + 1 pt/$ for $50-$100)', () => {
    test('returns 52 points for $101 (2*1 + 1*50)', () => {
      expect(calculateRewardPoints(101)).toBe(52);
    });

    test('returns 90 points for $120 (2*20 + 1*50) - requirements example', () => {
      expect(calculateRewardPoints(120)).toBe(90);
    });

    test('returns 150 points for $150 (2*50 + 1*50)', () => {
      expect(calculateRewardPoints(150)).toBe(150);
    });

    test('returns 200 points for $175 (2*75 + 1*50)', () => {
      expect(calculateRewardPoints(175)).toBe(200);
    });

    test('returns 250 points for $200 (2*100 + 1*50)', () => {
      expect(calculateRewardPoints(200)).toBe(250);
    });

    test('returns 350 points for $250 (2*150 + 1*50)', () => {
      expect(calculateRewardPoints(250)).toBe(350);
    });
  });

  /* === Invalid Input Tests === */
  describe('invalid inputs (guard clauses)', () => {
    test('returns 0 points for negative amount', () => {
      expect(calculateRewardPoints(-50)).toBe(0);
    });

    test('returns 0 points for NaN', () => {
      expect(calculateRewardPoints(NaN)).toBe(0);
    });

    test('returns 0 points for undefined', () => {
      expect(calculateRewardPoints(undefined)).toBe(0);
    });

    test('returns 0 points for null', () => {
      expect(calculateRewardPoints(null)).toBe(0);
    });

    test('returns 0 points for string input', () => {
      expect(calculateRewardPoints('120')).toBe(0);
    });

    test('returns 0 points for zero', () => {
      expect(calculateRewardPoints(0)).toBe(0);
    });
  });
});
