import React from 'react';
import useFetchTransactions from '../../hooks/useFetchTransactions';
import {
  aggregateMonthlyRewards,
  aggregateTotalRewards,
  enrichTransactionsWithRewards,
} from '../../utils/aggregateRewards';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MonthlyRewardsTable from '../MonthlyRewardsTable/MonthlyRewardsTable';
import TotalRewardsTable from '../TotalRewardsTable/TotalRewardsTable';
import TransactionsTable from '../TransactionsTable/TransactionsTable';
import styles from './App.module.css';

/**
 * App - Main application shell for the Customer Rewards Program.
 *
 * Fetches transaction data via a custom hook and derives all display data
 * (monthly rewards, total rewards, enriched transactions) using pure functions.
 * Derived data is computed during rendering, NOT stored in state.
 *
 * State flow:
 * 1. Mount -> useFetchTransactions initiates async API call -> loading state
 * 2. API resolves -> transactions arrive -> derived data computed -> tables render
 * 3. API rejects -> error state -> error message displayed
 */
const App = () => {
  const { data: transactions, loading, error } = useFetchTransactions();

  const renderHeader = () => (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>Customer Rewards Program</h1>
      <p className={styles.headerSubtitle}>Track and manage customer loyalty points</p>
   </header>
  );
  
  /* Show loading spinner while data is being fetched */
  if (loading) {
    return (
      <div className={styles.app}>
        {renderHeader()}
        <main className={styles.main}>
          <LoadingSpinner message="Fetching transaction data..." />
        </main>
      </div>
    );
  }

  /* Show error message if API call failed */
  if (error) {
    return (
      <div className={styles.app}>
        {renderHeader()}
        <main className={styles.main}>
          <ErrorMessage message={error} />
        </main>
      </div>
    );
  }

  /*
   * Compute derived data from transactions using pure functions.
   * Sorting happens inside the utility functions, not in component state.
   */
  const monthlyRewards = aggregateMonthlyRewards(transactions);
  const totalRewards = aggregateTotalRewards(transactions);
  const enrichedTransactions = enrichTransactionsWithRewards(transactions);

  return (
    <div className={styles.app}>
      {renderHeader()}
      <main className={styles.main}>
        <section className={styles.section}>
          <MonthlyRewardsTable rewards={monthlyRewards} />
        </section>
        <section className={styles.section}>
          <TotalRewardsTable rewards={totalRewards} />
        </section>
        <section className={styles.section}>
          <TransactionsTable transactions={enrichedTransactions} />
        </section>
      </main>
      <footer className={styles.footer}>
        <p>
          Points calculation: 2 pts/$ over $100 + 1 pt/$ between $50-$100 per transaction.
          Fractional dollars are floored.
        </p>
      </footer>
    </div>
  );
};

export default App;
