import log from 'loglevel';

/**
 * Application-wide logger instance.
 * Uses loglevel for structured, configurable logging.
 */
const logger = log.getLogger('customer-rewards');

/* Set default log level based on environment */
const LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'warn' : 'info';
logger.setLevel(LOG_LEVEL);

export default logger;
