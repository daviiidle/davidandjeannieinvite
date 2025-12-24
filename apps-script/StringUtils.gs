/**
 * StringUtils.gs
 *
 * Utilities for string manipulation, sanitization, and truncation.
 * All string operations should be centralized here for consistency.
 */

const StringUtils = (function () {
  /**
   * Sanitizes a value by converting it to a trimmed string.
   * Returns empty string if value is null, undefined, or empty.
   *
   * @param {*} value - The value to sanitize
   * @return {string} Sanitized string
   */
  function sanitize(value) {
    return value ? value.toString().trim() : '';
  }

  /**
   * Truncates text to a maximum length, adding an ellipsis if truncated.
   *
   * @param {string} text - The text to truncate
   * @param {number} maxLength - Maximum length allowed
   * @return {string} Truncated text with ellipsis if needed
   */
  function truncate(text, maxLength) {
    const safe = sanitize(text);
    if (safe.length <= maxLength) {
      return safe;
    }
    return safe.substring(0, Math.max(0, maxLength - 1)) + '…';
  }

  /**
   * Checks if a value is considered truthy for SMS opt-out purposes.
   *
   * @param {*} value - The value to check
   * @return {boolean} True if opted out
   */
  function isSmsOptedOut(value) {
    if (value === true) return true;
    if (typeof value === 'number') {
      return value === 1;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      return normalized === 'true' || normalized === '1' || normalized === 'yes';
    }
    return false;
  }

  /**
   * Converts a value to a Date object.
   *
   * @param {*} value - The value to convert
   * @return {Date|null} Date object or null if invalid
   */
  function valueToDate(value) {
    if (value instanceof Date) {
      return value;
    }
    if (!value) {
      return null;
    }
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return {
    sanitize: sanitize,
    truncate: truncate,
    isSmsOptedOut: isSmsOptedOut,
    valueToDate: valueToDate,
  };
})();
