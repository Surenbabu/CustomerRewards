import logger from '../utils/logger';

/**
 * Simulates an asynchronous API call to fetch transaction data.
 */
const fetchTransactions = async () => {
  logger.info('Fetching transactions from API...');

  try {
    const response = await fetch('/data/transactions.json');
    if (!response.ok) {
      throw new Error(`Failed to load data. HTTP status: ${response.status}`);
    }
    const transactionsData = await response.json();

    //  Validate that data exists and is an array
    if (!Array.isArray(transactionsData)) {
      throw new Error('Invalid data format received from API');
    }

    logger.info(`Successfully fetched ${transactionsData.length} transactions`);
    return transactionsData;

  } catch (error) {
    logger.error('Failed to fetch transactions:', error.message);
    throw error; 
  }
};

export default fetchTransactions;