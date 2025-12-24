/**
 * PhoneUtils.gs
 *
 * Utilities for phone number formatting and canonicalization.
 * Handles conversion to E.164 format for Australian phone numbers.
 */

const PhoneUtils = (function () {
  /**
   * Converts an Australian phone number to E.164 format (+61...).
   *
   * Handles these formats:
   * - 04XXXXXXXX -> +614XXXXXXXX
   * - 614XXXXXXXX -> +614XXXXXXXX
   * - +614XXXXXXXX -> +614XXXXXXXX (unchanged)
   *
   * @param {string} raw - Raw phone number input
   * @return {string} E.164 formatted number or empty string if invalid
   */
  function toE164AU(raw) {
    if (!raw) return '';
    const digits = raw.toString().replace(/[^\d+]/g, '');

    if (digits.startsWith('+')) {
      return digits;
    }

    if (digits.startsWith('04') && digits.length === 10) {
      return '+61' + digits.slice(1);
    }

    if (digits.startsWith('61')) {
      return '+' + digits;
    }

    return '';
  }

  /**
   * Canonicalizes a phone number value by attempting E.164 conversion.
   * Falls back to basic normalization if E.164 conversion fails.
   *
   * @param {string} value - Phone number value
   * @return {string} Canonicalized phone number
   */
  function canonicalizePhoneValue(value) {
    const raw = StringUtils.sanitize(value);
    if (!raw) {
      return '';
    }
    const canonical = toE164AU(raw);
    if (canonical) {
      return canonical;
    }
    if (raw.startsWith('+')) {
      return raw;
    }
    const digitsOnly = raw.replace(/[^\d]/g, '');
    if (digitsOnly) {
      return digitsOnly.startsWith('61') ? '+' + digitsOnly : digitsOnly;
    }
    return raw;
  }

  /**
   * Extracts the canonical phone number from a spreadsheet row.
   * Prefers the phoneE164 column, falls back to phone column.
   *
   * @param {Array} row - Spreadsheet row values
   * @param {Object} indexMap - Column index mapping
   * @return {string} Canonical phone number or empty string
   */
  function getCanonicalPhoneFromRow(row, indexMap) {
    if (!row || !indexMap) return '';
    const e164Value = canonicalizePhoneValue(row[indexMap.phoneE164]);
    if (e164Value) {
      return e164Value;
    }
    return canonicalizePhoneValue(row[indexMap.phone]);
  }

  return {
    toE164AU: toE164AU,
    canonicalizePhoneValue: canonicalizePhoneValue,
    getCanonicalPhoneFromRow: getCanonicalPhoneFromRow,
  };
})();
