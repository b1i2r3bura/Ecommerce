/**
 * helpers.js — Utility Functions
 */

/**
 * Format a number as USD currency string.
 * @param {number} amount
 * @returns {string} e.g. "$49.99"
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format a date string into a human-readable format.
 * @param {string|Date} dateString
 * @returns {string} e.g. "September 5, 2026"
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Get CSS class for an order status badge.
 * @param {string} status
 * @returns {string} CSS class name
 */
export const getStatusClass = (status) => {
  const map = {
    pending:    'status-pending',
    processing: 'status-processing',
    shipped:    'status-shipped',
    delivered:  'status-delivered',
    cancelled:  'status-cancelled',
  };
  return `badge ${map[status] || 'badge-muted'}`;
};

/**
 * Truncate a string to a maximum length with ellipsis.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (str, maxLength = 80) => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Extract an error message from an Axios error response.
 * @param {Error} error - Axios error object
 * @returns {string}
 */
export const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred'
  );
};
