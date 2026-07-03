import calculateRewardPoints from './calculateRewardPoints';
import { getMonthYear, getYearMonthSortKey, sortByDate } from './dateUtils';
import logger from './logger';

/**
 * Aggregates reward points by customer, month, and year.
 */
export const aggregateMonthlyRewards = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    logger.info('No transactions to aggregate for monthly rewards');
    return [];
  }

  /* Group transactions by customerId + month + year using reduce */
  const grouped = transactions.reduce((acc, transaction) => {
    const { month, year, monthName } = getMonthYear(transaction.date);
    const key = `${transaction.customerId}-${year}-${month}`;
    const points = calculateRewardPoints(transaction.amount);

    if (!acc[key]) {
      acc[key] = {
        customerId: transaction.customerId,
        customerName: transaction.firstName.concat(' ', transaction.lastName),
        month,
        year,
        monthName,
        rewardPoints: 0,
      };
    }

    acc[key] = {
      ...acc[key],
      rewardPoints: acc[key].rewardPoints + points,
    };

    return acc;
  }, {});

  /* Convert to array and sort by year -> month -> customer name */
  const result = Object.values(grouped).sort((a, b) => {
    const sortKeyA = getYearMonthSortKey(a.year, a.month);
    const sortKeyB = getYearMonthSortKey(b.year, b.month);

    if (sortKeyA !== sortKeyB) {
      return sortKeyB - sortKeyA;
    }
    return a.customerName.localeCompare(b.customerName);
  });

  logger.debug(`Aggregated monthly rewards for ${result.length} entries`);
  return result;
};

/**
 * Aggregates total reward points per customer across all transactions.
 */
export const aggregateTotalRewards = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    logger.info('No transactions to aggregate for total rewards');
    return [];
  }

  /* Group by customerId and sum all reward points */
  const grouped = transactions.reduce((acc, transaction) => {
    const key = transaction.customerId;
    const points = calculateRewardPoints(transaction.amount);

    if (!acc[key]) {
      acc[key] = {
        customerId: transaction.customerId,
        customerName: transaction.firstName.concat(' ', transaction.lastName),
        rewardPoints: 0,
      };
    }

    acc[key] = {
      ...acc[key],
      rewardPoints: acc[key].rewardPoints + points,
    };

    return acc;
  }, {});

  /* Convert to array and sort alphabetically by customer name */
  const result = Object.values(grouped).sort((a, b) =>
    a.customerName.localeCompare(b.customerName)
  );

  logger.debug(`Aggregated total rewards for ${result.length} customers`);
  return result;
};

/**
 * Enriches each transaction with its calculated reward points.
 */
export const enrichTransactionsWithRewards = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    logger.info('No transactions to enrich with rewards');
    return [];
  }

  /* Map to new objects with reward points, then sort by date */
  const enriched = transactions
    .map((transaction) => ({
      ...transaction,
      rewardPoints: calculateRewardPoints(transaction.amount),
    }))
    .sort(sortByDate);

  logger.debug(`Enriched ${enriched.length} transactions with reward points`);
  return enriched;
};
