/**
 * OutboxLogger.gs
 *
 * Manages the OUTBOX sheet for logging all SMS messages sent.
 * Provides audit trail for reminders, confirmations, and test messages.
 */

const OutboxLogger = (function () {
  /**
   * Resolves and ensures the OUTBOX sheet exists with proper headers.
   *
   * @return {GoogleAppsScript.Spreadsheet.Sheet} The OUTBOX sheet
   */
  function resolveOutboxSheet() {
    const spreadsheet = SheetOperations.getSpreadsheet();
    let sheet = spreadsheet.getSheetByName(OUTBOX_SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(OUTBOX_SHEET_NAME);
    }
    ensureOutboxHeader(sheet);
    return sheet;
  }

  /**
   * Ensures the OUTBOX sheet has proper headers.
   *
   * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The OUTBOX sheet
   */
  function ensureOutboxHeader(sheet) {
    const lastRow = sheet.getLastRow();
    const lastColumn = Math.max(sheet.getLastColumn(), OUTBOX_HEADERS.length);

    if (lastRow < 1) {
      sheet.getRange(1, 1, 1, OUTBOX_HEADERS.length).setValues([OUTBOX_HEADERS]);
      return;
    }

    const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    const matches = OUTBOX_HEADERS.every((header, idx) => String(headers[idx] || '').trim() === header);
    if (!matches) {
      sheet.getRange(1, 1, 1, OUTBOX_HEADERS.length).setValues([OUTBOX_HEADERS]);
    }
  }

  /**
   * Logs an SMS entry to the OUTBOX sheet.
   *
   * @param {Object} options - Log entry options
   * @param {Date} options.timestamp - When the SMS was sent
   * @param {string} options.type - Type of SMS (REMINDER, CONFIRMATION, TEST)
   * @param {string} options.to - Recipient phone number
   * @param {string} options.body - SMS message body
   * @param {string} options.status - Status (SENT, FAILED, DRY_RUN)
   * @param {string} options.error - Error message if failed
   * @param {string} options.sid - Twilio message SID
   */
  function logEntry({ timestamp, type, to, body, status, error, sid }) {
    try {
      const sheet = resolveOutboxSheet();
      sheet.appendRow([
        timestamp || new Date(),
        type,
        to,
        body,
        status || '',
        error || '',
        sid || '',
      ]);
    } catch (err) {
      Logger.log('Failed to log OUTBOX entry: %s', err && err.message ? err.message : err);
    }
  }

  return {
    logEntry: logEntry,
  };
})();
