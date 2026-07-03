/**
 * Reward tiers configuration.
 * Each tier defines a spending threshold and the points earned per dollar above that threshold.
 *
 * Calculation logic:
 * - 2 points per dollar spent over $100
 * - 1 point per dollar spent between $50 and $100
 * - 0 points for purchases $50 or below
 *
 * Example: $120 purchase = 2 * ($120 - $100) + 1 * ($100 - $50) = 40 + 50 = 90 points
 */
export const REWARD_TIERS = [
  { threshold: 100, pointsPerDollar: 2 },
  { threshold: 50, pointsPerDollar: 1 },
];

/**
 * Minimum spending amount required to earn any reward points.
 * Derived from the lowest tier threshold.
 */
export const MIN_SPENDING_FOR_REWARDS = Math.min(
  ...REWARD_TIERS.map((tier) => tier.threshold)
);
