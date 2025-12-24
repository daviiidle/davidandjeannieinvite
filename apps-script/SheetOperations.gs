/**
 * SheetOperations.gs
 *
 * Handles all Google Sheets operations including:
 * - Reading and writing spreadsheet data
 * - Header row management
 * - Column index mapping
 * - Row updates and appends
 */

const SheetOperations = (function () {
  /**
   * Gets the spreadsheet instance.
   *
   * @return {GoogleAppsScript.Spreadsheet.Spreadsheet} The spreadsheet
   * @throws {Error} If spreadsheet cannot be found
   */
  function getSpreadsheet() {
    const spreadsheet = SPREADSHEET_ID
      ? SpreadsheetApp.openById(SPREADSHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();

    if (!spreadsheet) {
      throw HttpUtils.createError(500, 'Unable to locate spreadsheet. Set SPREADSHEET_ID.');
    }

    return spreadsheet;
  }

  /**
   * Resolves and prepares the main RSVP sheet.
   *
   * @return {GoogleAppsScript.Spreadsheet.Sheet} The RSVP sheet
   */
  function resolveSheet() {
    const spreadsheet = getSpreadsheet();
    let sheet = SHEET_NAME ? spreadsheet.getSheetByName(SHEET_NAME) : spreadsheet.getSheets()[0];
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    ensureHeaderRow(sheet);

    return sheet;
  }

  /**
   * Ensures the sheet has a header row with all required columns.
   *
   * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to check
   */
  function ensureHeaderRow(sheet) {
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();

    if (lastRow >= 1 && lastColumn >= 1) {
      const existing = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
      const hasAnyHeader = existing.some((cell) => String(cell || '').trim().length > 0);
      if (hasAnyHeader) {
        return;
      }
    }

    sheet.getRange(1, 1, 1, CANONICAL_HEADERS.length).setValues([CANONICAL_HEADERS]);
  }

  /**
   * Reads all data from the sheet and returns rows with column mapping.
   *
   * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to read
   * @return {Object} Object containing rows, indexMap, and columnCount
   */
  function readSheet(sheet) {
    ensureHeaderRow(sheet);

    let data = sheet.getDataRange().getValues();
    if (data.length === 0) {
      return { rows: [], indexMap: createIndexMap(CANONICAL_HEADERS), columnCount: sheet.getLastColumn() };
    }

    let headers = data[0];
    let indexMap = createIndexMap(headers);
    let missing = REQUIRED_COLUMN_KEYS.filter((key) => typeof indexMap[key] !== 'number');

    if (missing.length) {
      addMissingColumns(sheet, missing);
      data = sheet.getDataRange().getValues();
      headers = data[0];
      indexMap = createIndexMap(headers);
      missing = REQUIRED_COLUMN_KEYS.filter((key) => typeof indexMap[key] !== 'number');

      if (missing.length) {
        throw HttpUtils.createError(500, 'Sheet is missing required columns: ' + missing.join(', '));
      }
    }

    return {
      rows: data.slice(1),
      indexMap: indexMap,
      columnCount: sheet.getLastColumn(),
    };
  }

  /**
   * Adds missing columns to the sheet header.
   *
   * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to modify
   * @param {Array<string>} missingKeys - Array of missing column keys
   */
  function addMissingColumns(sheet, missingKeys) {
    if (!missingKeys.length) return;

    const startCol = sheet.getLastColumn() + 1;
    const headers = missingKeys.map((key) => KEY_TO_HEADER[key] || key);
    sheet.getRange(1, startCol, 1, headers.length).setValues([headers]);
  }

  /**
   * Creates a mapping from column keys to column indexes.
   *
   * @param {Array<string>} headers - Array of header strings
   * @return {Object} Map of column keys to indexes
   */
  function createIndexMap(headers) {
    return headers.reduce((acc, header, index) => {
      const key = COLUMN_ALIASES[String(header || '').trim().toLowerCase()];
      if (key) {
        acc[key] = index;
      }
      return acc;
    }, {});
  }

  /**
   * Builds a complete row of values from payload and existing row data.
   *
   * @param {Object} options - Options object
   * @param {Object} options.payload - The RSVP payload
   * @param {Object} options.indexMap - Column index mapping
   * @param {Array} options.existingRow - Existing row values (or null)
   * @param {number} options.columnCount - Total column count
   * @return {Array} Complete row values
   */
  function buildRowValues({ payload, indexMap, existingRow, columnCount }) {
    const maxIndex = Object.values(indexMap).reduce((max, idx) => Math.max(max, idx), -1);
    const totalColumns = Math.max(columnCount || 0, maxIndex + 1);
    const row = new Array(totalColumns).fill('');
    if (existingRow) {
      existingRow.forEach((value, column) => {
        row[column] = value;
      });
    }

    const now = new Date();
    if (!existingRow) {
      row[indexMap.timestamp] = now;
    } else if (!row[indexMap.timestamp]) {
      row[indexMap.timestamp] = now;
    }

    row[indexMap.updatedAt] = now;
    row[indexMap.source] = SOURCE_LABEL;
    row[indexMap.householdName] = payload.householdName;
    row[indexMap.firstName] = payload.firstName;
    row[indexMap.lastName] = payload.lastName;
    row[indexMap.phone] = payload.phoneRaw;
    row[indexMap.phoneE164] = payload.phoneE164;
    row[indexMap.email] = payload.email;
    row[indexMap.language] = payload.language;
    row[indexMap.attendance] = payload.attendance;
    row[indexMap.partySize] = payload.partySize;
    row[indexMap.otherGuestNames] = payload.otherGuestNames;
    row[indexMap.notes] = payload.notes;

    if (typeof indexMap.inviteSide === 'number' && !row[indexMap.inviteSide]) {
      row[indexMap.inviteSide] = '';
    }

    if (typeof indexMap.priority === 'number') {
      row[indexMap.priority] = existingRow ? row[indexMap.priority] || 'NORMAL' : 'NORMAL';
    }

    if (typeof indexMap.lastReminderAt === 'number' && !row[indexMap.lastReminderAt]) {
      row[indexMap.lastReminderAt] = '';
    }

    if (typeof indexMap.reminderCount === 'number') {
      row[indexMap.reminderCount] = existingRow ? row[indexMap.reminderCount] || 0 : 0;
    }

    if (typeof indexMap.smsOptOut === 'number') {
      row[indexMap.smsOptOut] = existingRow ? row[indexMap.smsOptOut] || false : false;
    }

    return row;
  }

  /**
   * Finds an existing row by phone number (E.164).
   *
   * @param {Array<Array>} rows - All data rows
   * @param {Object} indexMap - Column index mapping
   * @param {string} phoneE164 - E.164 phone number to search for
   * @return {Object} Object with duplicateRowIndex and existingRow
   */
  function findDuplicateByPhone(rows, indexMap, phoneE164) {
    const duplicateRowIndex = rows.findIndex((row) => {
      const existingPhone = PhoneUtils.getCanonicalPhoneFromRow(row, indexMap);
      return existingPhone && existingPhone === phoneE164;
    });
    const existingRow = duplicateRowIndex >= 0 ? rows[duplicateRowIndex] : null;
    return { duplicateRowIndex, existingRow };
  }

  /**
   * Updates an existing row or appends a new row to the sheet.
   *
   * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to modify
   * @param {number} duplicateRowIndex - Index of duplicate row (-1 if none)
   * @param {Array} newRowValues - Complete row values to write
   * @return {number} The row number that was written to
   */
  function upsertRow(sheet, duplicateRowIndex, newRowValues) {
    let targetRowNumber;
    if (duplicateRowIndex >= 0) {
      targetRowNumber = duplicateRowIndex + 2;
      sheet.getRange(targetRowNumber, 1, 1, newRowValues.length).setValues([newRowValues]);
      Logger.log('Updated existing row %s', targetRowNumber);
    } else {
      sheet.appendRow(newRowValues);
      targetRowNumber = sheet.getLastRow();
      Logger.log('Appended new row %s', targetRowNumber);
    }
    return targetRowNumber;
  }

  return {
    getSpreadsheet: getSpreadsheet,
    resolveSheet: resolveSheet,
    readSheet: readSheet,
    buildRowValues: buildRowValues,
    findDuplicateByPhone: findDuplicateByPhone,
    upsertRow: upsertRow,
  };
})();
