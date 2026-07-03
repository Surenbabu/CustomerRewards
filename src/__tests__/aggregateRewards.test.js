import {
  aggregateMonthlyRewards,
  aggregateTotalRewards,
  enrichTransactionsWithRewards,
} from '../utils/aggregateRewards';

/**
 * Test suite for aggregateRewards utility functions.
 */

/* Sample transactions for testing */
const sampleTransactions = [
  {
    transactionId: 'T1',
    customerId: 'C1',
    firstName: 'Alice',
    lastName: 'Anderson',
    date: '2026-05-05',
    product: 'Item A',
    amount: 120.0,
  },
  {
    transactionId: 'T2',
    customerId: 'C1',
    firstName: 'Alice',
    lastName: 'Anderson',
    date: '2026-05-20',
    product: 'Item B',
    amount: 30.0,
  },
  {
    transactionId: 'T3',
    customerId: 'C2',
    firstName: 'Bob',
    lastName: 'Brown',
    date: '2026-05-10',
    product: 'Item C',
    amount: 75.0,
  },
  {
    transactionId: 'T4',
    customerId: 'C1',
    firstName: 'Alice',
    lastName: 'Anderson',
    date: '2026-06-05',
    product: 'Item D',
    amount: 150.0,
  },
  {
    transactionId: 'T5',
    customerId: 'C2',
    firstName: 'Bob',
    lastName: 'Brown',
    date: '2026-06-12',
    product: 'Item E',
    amount: 200.0,
  },
];

describe('aggregateRewards', () => {
  /* === aggregateMonthlyRewards Tests === */
  describe('aggregateMonthlyRewards', () => {
    test('groups transactions by customer, month, and year', () => {
      const result = aggregateMonthlyRewards(sampleTransactions);

      const aliceMay = result.find(
        (r) => r.customerId === 'C1' && r.month === 4 && r.year === 2026
      );
      /* $120 = 90 points, $30 = 0 points -> total 90 */
      expect(aliceMay.rewardPoints).toBe(90);

      const aliceJune = result.find(
        (r) => r.customerId === 'C1' && r.month === 5 && r.year === 2026
      );
      /* $150 = 150 points */
      expect(aliceJune.rewardPoints).toBe(150);
    });

    test('handles cross-year data correctly (May 2026 + June 2026)', () => {
      const result = aggregateMonthlyRewards(sampleTransactions);

      const may2026Entries = result.filter((r) => r.month === 4 && r.year === 2026);
      const june2026Entries = result.filter((r) => r.month === 5 && r.year === 2026);

      expect(may2026Entries.length).toBeGreaterThan(0);
      expect(june2026Entries.length).toBeGreaterThan(0);
    });

    test('sorts results by year -> month -> customer name', () => {
      const result = aggregateMonthlyRewards(sampleTransactions);

      /* Newer month entries should come before older ones */
      const firstEntry = result[0];
      const lastEntry = result[result.length - 1];

      expect(firstEntry.year).toBeGreaterThanOrEqual(lastEntry.year);
    });

    test('includes monthName in results', () => {
      const result = aggregateMonthlyRewards(sampleTransactions);

      const mayEntry = result.find((r) => r.month === 4);
      expect(mayEntry.monthName).toBe('May');
    });

    test('returns empty array for empty input', () => {
      expect(aggregateMonthlyRewards([])).toEqual([]);
    });

    test('returns empty array for null input', () => {
      expect(aggregateMonthlyRewards(null)).toEqual([]);
    });

    test('handles single transaction correctly', () => {
      const single = [sampleTransactions[0]];
      const result = aggregateMonthlyRewards(single);

      expect(result.length).toBe(1);
      expect(result[0].rewardPoints).toBe(90); /* $120 = 90 points */
    });
  });

  /* === aggregateTotalRewards Tests === */
  describe('aggregateTotalRewards', () => {
    test('sums reward points across all months per customer', () => {
      const result = aggregateTotalRewards(sampleTransactions);

      const alice = result.find((r) => r.customerId === 'C1');
      /* Alice: $120(90) + $30(0) + $150(150) = 240 total */
      expect(alice.rewardPoints).toBe(240);

      const bob = result.find((r) => r.customerId === 'C2');
      /* Bob: $75(25) + $200(250) = 275 total */
      expect(bob.rewardPoints).toBe(275);
    });

    test('sorts results alphabetically by customer name', () => {
      const result = aggregateTotalRewards(sampleTransactions);

      expect(result[0].customerName).toBe('Alice Anderson');
      expect(result[1].customerName).toBe('Bob Brown');
    });

    test('returns empty array for empty input', () => {
      expect(aggregateTotalRewards([])).toEqual([]);
    });

    test('returns empty array for undefined input', () => {
      expect(aggregateTotalRewards(undefined)).toEqual([]);
    });
  });

  /* === enrichTransactionsWithRewards Tests === */
  describe('enrichTransactionsWithRewards', () => {
    test('adds rewardPoints to each transaction', () => {
      const result = enrichTransactionsWithRewards(sampleTransactions);

      result.forEach((transaction) => {
        expect(transaction).toHaveProperty('rewardPoints');
        expect(typeof transaction.rewardPoints).toBe('number');
      });
    });

    test('calculates correct points for each transaction', () => {
      const result = enrichTransactionsWithRewards(sampleTransactions);

      const t1 = result.find((t) => t.transactionId === 'T1');
      expect(t1.rewardPoints).toBe(90); /* $120 */

      const t2 = result.find((t) => t.transactionId === 'T2');
      expect(t2.rewardPoints).toBe(0); /* $30 */

      const t3 = result.find((t) => t.transactionId === 'T3');
      expect(t3.rewardPoints).toBe(25); /* $75 */
    });

    test('sorts enriched transactions by date descending', () => {
      const result = enrichTransactionsWithRewards(sampleTransactions);

      for (let i = 1; i < result.length; i++) {
        const prevDate = new Date(result[i - 1].date);
        const currDate = new Date(result[i].date);
        expect(prevDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
      }
    });

    test('does not mutate original transactions', () => {
      const original = [...sampleTransactions];
      enrichTransactionsWithRewards(sampleTransactions);

      expect(sampleTransactions).toEqual(original);
      expect(sampleTransactions[0]).not.toHaveProperty('rewardPoints');
    });

    test('returns empty array for empty input', () => {
      expect(enrichTransactionsWithRewards([])).toEqual([]);
    });
  });
});
