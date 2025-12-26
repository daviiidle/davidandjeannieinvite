/**
 * SaveTheDateService.gs
 *
 * Handles Save the Date submissions: sheet setup, deduplication,
 * and row creation/updating.
 */
const SaveTheDateService = (function () {
  const HEADERS = SAVE_THE_DATE_HEADERS;
  const HEADER_CONFIG = [
    { key: 'timestamp', header: 'Timestamp' },
    { key: 'updatedAt', header: 'Updated At' },
    { key: 'source', header: 'Source' },
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'mobileRaw', header: 'Mobile (Raw)' },
    { key: 'mobileE164', header: 'Mobile (E164)' },
    { key: 'likelyToAttend', header: 'Likely To Attend' },
    { key: 'notes', header: 'Notes' },
  ];

  const KEY_TO_HEADER = HEADER_CONFIG.reduce(function (acc, cfg) {
    acc[cfg.key] = cfg.header;
    return acc;
  }, {});

  const COLUMN_ALIASES = HEADER_CONFIG.reduce(function (acc, cfg) {
    acc[cfg.header.toLowerCase()] = cfg.key;
    return acc;
  }, {});

  const REQUIRED_KEYS = HEADER_CONFIG.map(function (cfg) {
    return cfg.key;
  });

  function upsert(payload) {
    const sheet = resolveSheet_();
    const sheetData = readSheet_(sheet);
    const match = findDuplicateByPhone_(sheetData.rows, sheetData.indexMap, payload.phoneE164);
    const rowValues = buildRowValues_({
      payload: payload,
      indexMap: sheetData.indexMap,
      existingRow: match.existingRow,
      columnCount: sheetData.columnCount,
    });
    const writeResult = writeRow_(sheet, match.rowIndex, rowValues);
    return {
      action: writeResult.action,
      rowNumber: writeResult.rowNumber,
    };
  }

  function resolveSheet_() {
    const spreadsheet = SheetOperations.getSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SAVE_THE_DATE_SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SAVE_THE_DATE_SHEET_NAME);
    }
    ensureHeaderRow_(sheet);
    return sheet;
  }

  function ensureHeaderRow_(sheet) {
    if (!sheet) return;
    if (sheet.getMaxColumns() < HEADERS.length) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), HEADERS.length - sheet.getMaxColumns());
    }
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    const existing = headerRange.getValues()[0];
    const matches = HEADERS.every(function (header, index) {
      return String(existing[index] || '').trim() === header;
    });
    if (!matches) {
      headerRange.setValues([HEADERS]);
    }
  }

  function readSheet_(sheet) {
    const columnCount = Math.max(sheet.getLastColumn(), HEADERS.length);
    const headers = sheet.getRange(1, 1, 1, columnCount).getValues()[0];
    let indexMap = createIndexMap_(headers);
    const missing = REQUIRED_KEYS.filter(function (key) {
      return typeof indexMap[key] !== 'number';
    });
    if (missing.length) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      const ensuredColumnCount = Math.max(sheet.getLastColumn(), HEADERS.length);
      const ensuredHeaders = sheet.getRange(1, 1, 1, ensuredColumnCount).getValues()[0];
      indexMap = createIndexMap_(ensuredHeaders);
      return {
        rows:
          sheet.getLastRow() > 1
            ? sheet.getRange(2, 1, sheet.getLastRow() - 1, ensuredColumnCount).getValues()
            : [],
        indexMap: indexMap,
        columnCount: ensuredColumnCount,
      };
    }

    const rows =
      sheet.getLastRow() > 1
        ? sheet.getRange(2, 1, sheet.getLastRow() - 1, columnCount).getValues()
        : [];

    return {
      rows: rows,
      indexMap: indexMap,
      columnCount: columnCount,
    };
  }

  function createIndexMap_(headers) {
    return headers.reduce(function (acc, header, index) {
      const key = COLUMN_ALIASES[String(header || '').trim().toLowerCase()];
      if (key) {
        acc[key] = index;
      }
      return acc;
    }, {});
  }

  function findDuplicateByPhone_(rows, indexMap, phoneE164) {
    if (!phoneE164) {
      return { rowIndex: -1, existingRow: null };
    }
    const rowIndex = rows.findIndex(function (row) {
      const phoneValue =
        (typeof indexMap.mobileE164 === 'number' && row[indexMap.mobileE164]) ||
        (typeof indexMap.mobileRaw === 'number' ? row[indexMap.mobileRaw] : '');
      const normalized = PhoneUtils.canonicalizePhoneValue(phoneValue);
      return normalized && normalized === phoneE164;
    });
    return {
      rowIndex: rowIndex,
      existingRow: rowIndex >= 0 ? rows[rowIndex] : null,
    };
  }

  function buildRowValues_({ payload, indexMap, existingRow, columnCount }) {
    const row = new Array(columnCount).fill('');
    if (existingRow) {
      existingRow.forEach(function (value, column) {
        row[column] = value;
      });
    }

    const now = new Date();
    if (!existingRow || !row[indexMap.timestamp]) {
      row[indexMap.timestamp] = now;
    }
    row[indexMap.updatedAt] = now;
    row[indexMap.source] = SAVE_THE_DATE_SOURCE_LABEL;
    row[indexMap.firstName] = payload.firstName;
    row[indexMap.lastName] = payload.lastName;
    row[indexMap.mobileRaw] = payload.phoneRaw;
    row[indexMap.mobileE164] = payload.phoneE164;
    row[indexMap.likelyToAttend] = payload.likelyToAttend || '';

    if (typeof indexMap.notes === 'number' && !row[indexMap.notes]) {
      row[indexMap.notes] = '';
    }

    return row;
  }

  function writeRow_(sheet, existingRowIndex, rowValues) {
    if (existingRowIndex >= 0) {
      const rowNumber = existingRowIndex + 2;
      sheet.getRange(rowNumber, 1, 1, rowValues.length).setValues([rowValues]);
      return { action: 'updated', rowNumber: rowNumber };
    }
    sheet.appendRow(rowValues);
    return { action: 'created', rowNumber: sheet.getLastRow() };
  }

  return {
    upsert: upsert,
  };
})();
