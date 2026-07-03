import { useState, useEffect } from 'react';
import fetchTransactions from '../api/fetchTransactions';
import logger from '../utils/logger';

const INITIAL_TRANSACTION_STATE = {
  data: null,
  loading: true,
  error: null,
};

/**
 * Custom hook for fetching transaction data asynchronously.
 */
const useFetchTransactions = () => {
  const [transactionState, setTransactionState] = useState(INITIAL_TRANSACTION_STATE);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        logger.info('useFetchTransactions: initiating data fetch');
        
        const data = await fetchTransactions();
        
        // Update state with success payload
        setTransactionState({
          data: data,
          loading: false,
          error: null,
        });
        
        logger.info('useFetchTransactions: data loaded successfully');
      } catch (err) {
        // Update state with error payload
        setTransactionState({
          data: null,
          loading: false,
          error: err?.message || 'An unexpected error occurred while fetching transactions.',
        });
        
        logger.error('useFetchTransactions: fetch failed', err?.message);
      }
    };

    loadTransactions();
  }, []); // Empty dependency array: fetch only on mount

  return transactionState;
};

export default useFetchTransactions;