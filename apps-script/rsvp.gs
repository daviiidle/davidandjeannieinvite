/**
 * Google Apps Script webhook used by the RSVP form in the web client.
 * - Deduplicates rows by normalised (E.164) phone number
 * - Updates an existing row or appends a new row
 * - Keeps the sheet header flexible by resolving column indexes dynamically
 *
 * Copy this file into your Apps Script project, set the spreadsheet ID below,
 * then deploy the project as a web app that executes as you and is accessible
 * to anyone with the link.
 */

const SPREADSHEET_ID = '10JrN7JVnGNO3Za4TNpwX7yfEhkaLghv8o9m-_0WVtlo';
const SHEET_NAME = 'Sheet1';
const SOURCE_LABEL = 'WEBSITE';

const HEADER_CONFIG = [
  { key: 'timestamp', header: 'Timestamp' },
  { key: 'updatedAt', header: 'Updated At' },
  { key: 'source', header: 'Source' },
  { key: 'householdName', header: 'Household Name' },
  { key: 'firstName', header: 'First Name' },
  { key: 'lastName', header: 'Last Name' },
  { key: 'phone', header: 'Phone' },
  { key: 'phoneE164', header: 'Phone E164' },
  { key: 'email', header: 'Email' },
  { key: 'language', header: 'Language' },
  { key: 'attendance', header: 'Attendance' },
  { key: 'partySize', header: 'Party Size' },
  { key: 'otherGuestNames', header: 'Other Guest Names' },
  { key: 'notes', header: 'Notes' },
  { key: 'inviteSide', header: 'Invite Side' },
  { key: 'priority', header: 'Priority' },
  { key: 'lastReminderAt', header: 'Last Reminder At' },
  { key: 'reminderCount', header: 'Reminder Count' },
  { key: 'smsOptOut', header: 'SMS Opt Out' },
];

const CANONICAL_HEADERS = HEADER_CONFIG.map((cfg) => cfg.header);

const COLUMN_ALIASES = HEADER_CONFIG.reduce((acc, cfg) => {
  acc[cfg.header.toLowerCase()] = cfg.key;
  return acc;
}, {});

const KEY_TO_HEADER = HEADER_CONFIG.reduce((acc, cfg) => {
  acc[cfg.key] = cfg.header;
  return acc;
}, {});

const REQUIRED_COLUMN_KEYS = HEADER_CONFIG.map((cfg) => cfg.key);

function doPost(e) {
  let lock;
  let locked = false;
  try {
    const payload = parsePayload_(e);
    Logger.log('Payload received: %s', JSON.stringify(payload));
    if (payload.honeypot) {
      Logger.log('Honeypot triggered, ignoring submission.');
      return jsonResponse_(200, { ok: true });
    }
    const sheet = resolveSheet_();
    lock = LockService.getScriptLock();
    lock.waitLock(30 * 1000);
    locked = true;

    const { rows, indexMap, columnCount } = readSheet_(sheet);
    const duplicateRowIndex = rows.findIndex((row) => {
      return (row[indexMap.phoneE164] || '').toString().trim() === payload.phoneE164;
    });

    const newRowValues = buildRowValues_({
      payload,
      indexMap,
      existingRow: duplicateRowIndex >= 0 ? rows[duplicateRowIndex] : null,
      columnCount,
    });

    if (duplicateRowIndex >= 0) {
      sheet.getRange(duplicateRowIndex + 2, 1, 1, newRowValues.length).setValues([newRowValues]);
      Logger.log('Updated existing row %s for %s', duplicateRowIndex + 2, payload.phoneE164);
    } else {
      sheet.appendRow(newRowValues);
      Logger.log('Appended new row for %s', payload.phoneE164);
    }

    return jsonResponse_(200, { ok: true });
  } catch (err) {
    const status = err?.statusCode || 500;
    Logger.log('Error: %s', err && err.stack ? err.stack : err);
    return jsonResponse_(status, {
      ok: false,
      error: err?.message || String(err),
    });
  } finally {
    if (lock && locked) {
      lock.releaseLock();
    }
  }
}

function doGet() {
  return jsonResponse_(200, {
    ok: true,
    message: 'RSVP webhook is running',
  });
}

function parsePayload_(e) {
  if (!e?.postData?.contents) {
    throw httpError_(400, 'Missing JSON body');
  }

  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    throw httpError_(400, 'Request body must be valid JSON');
  }

  const firstName = sanitizeString_(body.firstName);
  const lastName = sanitizeString_(body.lastName);
  const householdName = sanitizeString_(body.householdName);
  const phoneRaw = sanitizeString_(body.phone);
  const email = sanitizeString_(body.email);
  const language = sanitizeString_(body.language || 'EN').toUpperCase();
  const attendance = sanitizeString_(body.attendance).toUpperCase();
  const otherGuestNames = sanitizeString_(body.otherGuestNames);
  const notes = sanitizeString_(body.notes);
  const honeypot = sanitizeString_(body.honeypot);

  if (!firstName || !phoneRaw || !attendance) {
    throw httpError_(400, 'Missing required fields: firstName, phone, attendance');
  }

  if (attendance !== 'YES' && attendance !== 'NO') {
    throw httpError_(400, 'Attendance must be YES or NO');
  }

  const partySize = attendance === 'YES' ? Number(body.partySize ?? 0) : 0;
  if (attendance === 'YES' && (!Number.isFinite(partySize) || partySize < 0)) {
    throw httpError_(400, 'Party size must be a positive number');
  }

  const phoneE164 = toE164AU_(phoneRaw);
  if (!phoneE164) {
    throw httpError_(400, 'Invalid phone number');
  }

  return {
    firstName,
    lastName,
    householdName,
    phoneRaw,
    phoneE164,
    email,
    language,
    attendance,
    partySize,
    otherGuestNames,
    notes,
    honeypot,
  };
}

function resolveSheet_() {
  const spreadsheet = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw httpError_(500, 'Unable to locate spreadsheet. Set SPREADSHEET_ID.');
  }

  let sheet = SHEET_NAME ? spreadsheet.getSheetByName(SHEET_NAME) : spreadsheet.getSheets()[0];
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  ensureHeaderRow_(sheet);

  return sheet;
}

function readSheet_(sheet) {
  ensureHeaderRow_(sheet);

  let data = sheet.getDataRange().getValues();
  if (data.length === 0) {
    return { rows: [], indexMap: createIndexMap_(CANONICAL_HEADERS), columnCount: sheet.getLastColumn() };
  }

  let headers = data[0];
  let indexMap = createIndexMap_(headers);
  let missing = REQUIRED_COLUMN_KEYS.filter((key) => typeof indexMap[key] !== 'number');

  if (missing.length) {
    addMissingColumns_(sheet, missing);
    data = sheet.getDataRange().getValues();
    headers = data[0];
    indexMap = createIndexMap_(headers);
    missing = REQUIRED_COLUMN_KEYS.filter((key) => typeof indexMap[key] !== 'number');

    if (missing.length) {
      throw httpError_(500, 'Sheet is missing required columns: ' + missing.join(', '));
    }
  }

  return {
    rows: data.slice(1),
    indexMap,
    columnCount: sheet.getLastColumn(),
  };
}

function ensureHeaderRow_(sheet) {
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

function addMissingColumns_(sheet, missingKeys) {
  if (!missingKeys.length) return;

  const startCol = sheet.getLastColumn() + 1;
  const headers = missingKeys.map((key) => KEY_TO_HEADER[key] || key);
  sheet.getRange(1, startCol, 1, headers.length).setValues([headers]);
}

function buildRowValues_({ payload, indexMap, existingRow, columnCount }) {
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

function createIndexMap_(headers) {
  return headers.reduce((acc, header, index) => {
    const key = COLUMN_ALIASES[String(header || '').trim().toLowerCase()];
    if (key) {
      acc[key] = index;
    }
    return acc;
  }, {});
}

function sanitizeString_(value) {
  return value ? value.toString().trim() : '';
}

function httpError_(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function toE164AU_(raw) {
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

function jsonResponse_(status, obj) {
  const output = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  if (typeof output.setStatusCode === 'function') {
    output.setStatusCode(status);
  }
  if (typeof output.setHeader === 'function') {
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  return output;
}
