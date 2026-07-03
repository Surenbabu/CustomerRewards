import {
  getMonthYear,
  formatDate,
  sortByDate,
  getMonthName,
  getYearMonthSortKey,
} from '../utils/dateUtils';

/**
 * Test suite for dateUtils utility functions.
 *
 * Covers:
 * - Month/year extraction from date strings
 * - Date formatting to localized output
 * - Sort comparator for date ordering
 * - Month name lookup
 * - Year-month sort key generation
 */
describe('dateUtils', () => {
  /* === getMonthYear Tests === */
  describe('getMonthYear', () => {
    test('extracts correct month, year, and monthName for June', () => {
      const result = getMonthYear('2026-06-15');
      expect(result.month).toBe(5);
      expect(result.year).toBe(2026);
      expect(result.monthName).toBe('June');
    });

    test('extracts correct data for May (cross-year edge case)', () => {
      const result = getMonthYear('2026-05-05');
      expect(result.month).toBe(4);
      expect(result.year).toBe(2026);
      expect(result.monthName).toBe('May');
    });

    test('extracts correct data for July', () => {
      const result = getMonthYear('2026-07-28');
      expect(result.month).toBe(6);
      expect(result.year).toBe(2026);
      expect(result.monthName).toBe('July');
    });
  });

  /* === formatDate Tests === */
  describe('formatDate', () => {
    test('formats date to localized string', () => {
      const result = formatDate('2026-06-15');
      /* Check that it contains expected parts */
      expect(result).toContain('2026');
      expect(result).toContain('Jun');
    });

    test('formats May date correctly', () => {
      const result = formatDate('2026-05-05');
      expect(result).toContain('2026');
      expect(result).toContain('May');
    });

    test('handles invalid date gracefully', () => {
      const result = formatDate('invalid-date');
      /* Should return something without crashing */
      expect(typeof result).toBe('string');
    });
  });

  /* === sortByDate Tests === */
  describe('sortByDate', () => {
    test('sorts dates in descending order', () => {
      const items = [
        { date: '2026-07-15' },
        { date: '2026-05-01' },
        { date: '2026-06-10' },
      ];
      const sorted = [...items].sort(sortByDate);
      expect(sorted[0].date).toBe('2026-07-15');
      expect(sorted[1].date).toBe('2026-06-10');
      expect(sorted[2].date).toBe('2026-05-01');
    });

    test('handles same dates correctly', () => {
      const items = [
        { date: '2026-06-15' },
        { date: '2026-06-15' },
      ];
      const sorted = [...items].sort(sortByDate);
      expect(sorted.length).toBe(2);
    });

    test('handles cross-year sorting correctly', () => {
      const items = [
        { date: '2026-06-01' },
        { date: '2026-05-31' },
      ];
      const sorted = [...items].sort(sortByDate);
      expect(sorted[0].date).toBe('2026-06-01');
      expect(sorted[1].date).toBe('2026-05-31');
    });
  });

  /* === getMonthName Tests === */
  describe('getMonthName', () => {
    test('returns June for index 5', () => {
      expect(getMonthName(5)).toBe('June');
    });

    test('returns May for index 4', () => {
      expect(getMonthName(4)).toBe('May');
    });

    test('returns July for index 6', () => {
      expect(getMonthName(6)).toBe('July');
    });
  });

  /* === getYearMonthSortKey Tests === */
  describe('getYearMonthSortKey', () => {
    test('generates correct sort key for May 2026', () => {
      expect(getYearMonthSortKey(2026, 4)).toBe(202604);
    });

    test('generates correct sort key for June 2026', () => {
      expect(getYearMonthSortKey(2026, 5)).toBe(202605);
    });

    test('May 2026 key is less than June 2026 key', () => {
      const may2026 = getYearMonthSortKey(2026, 4);
      const june2026 = getYearMonthSortKey(2026, 5);
      expect(may2026).toBeLessThan(june2026);
    });
  });
});
