// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

/**
 * Suppress logger output during tests to keep test output clean.
 * The loglevel logger is set to 'silent' in the test environment.
 */
import log from 'loglevel';
log.setLevel('silent');
