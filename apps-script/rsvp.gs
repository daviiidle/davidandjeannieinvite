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
  { key: 'confirmationSentAt', header: 'Confirmation Sent At' },
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

const OUTBOX_SHEET_NAME = 'OUTBOX';
const OUTBOX_HEADERS = ['Timestamp', 'Type', 'To', 'Body', 'Status', 'Error', 'TwilioSid'];
const DEFAULT_EVENT_DATE = new Date('2026-09-01T00:00:00');
const DEFAULT_REMINDER_SCHEDULE_DAYS = [21, 10, 2];
const TEST_EVENT_DATE_PROPERTY = 'TEST_REMINDER_EVENT_DATE';
const TEST_OFFSETS_PROPERTY = 'TEST_REMINDER_OFFSETS_SECONDS';
const REMINDER_TEST_EVENT_CACHE_KEY = 'REMINDER_TEST_EVENT_CACHE_KEY';
const REMINDER_TEST_OFFSETS_CACHE_KEY = 'REMINDER_TEST_OFFSETS_CACHE_KEY';
const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;
const SMS_MAX_CHAR_LENGTH = 160;
const TWILIO_TRIAL_PREFIX_LENGTH = 40;
const REMINDER_TEMPLATES = {
  EN: [
    (name, link) => 'Hi ' + name + ', we\'re finalising wedding RSVPs—could you reply when you have a moment? ' + link,
    (name, link) =>
      'Hi ' + name + ', we\'re still missing your RSVP. A quick response really helps with planning: ' + link,
    (name, link) =>
      name + ', final call for our wedding RSVP today so we can lock in numbers. Thank you! ' + link,
  ],
  VI: [
    (name, link) =>
      'Chào ' + name + ', bọn mình đang chốt danh sách khách mời—nhớ RSVP khi rảnh nhé: ' + link,
    (name, link) =>
      name + ', bọn mình vẫn chưa nhận được RSVP. Nhờ bạn phản hồi sớm giúp bọn mình chuẩn bị: ' + link,
    (name, link) =>
      name + ', nhắc lần cuối RSVP hôm nay để bọn mình chốt số lượng nha. Cảm ơn bạn! ' + link,
  ],
};
const CONFIRMATION_TEMPLATES = {
  EN: {
    YES: (name, partySize) =>
      'Thanks ' +
      name +
      '! RSVP received for ' +
      partySize +
      '. See you there. Please reuse this mobile number if you need to update.',
    NO: (name) =>
      'Thanks ' + name + '! RSVP received. We\'ll miss you. Please reuse this mobile number if you need to update.',
  },
  VI: {
    YES: (name, partySize) =>
      'Cảm ơn ' +
      name +
      '! Đã nhận RSVP cho ' +
      partySize +
      '. Hẹn gặp bạn. Nếu cần cập nhật vui lòng dùng lại số điện thoại này.',
    NO: (name) =>
      'Cảm ơn ' + name + '! Đã nhận RSVP. Hẹn gặp bạn dịp khác. Nếu cần cập nhật vui lòng dùng lại số này.',
  },
};
const CONFIRMATION_DETAIL_LABELS = {
  EN: {
    detailsPrefix: 'Details:',
    household: 'Household',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    email: 'Email',
    language: 'Language',
    attendance: 'Attendance',
    partySize: 'Party Size',
    otherGuests: 'Other Guests',
    notes: 'Notes',
    noneValue: 'n/a',
  },
  VI: {
    detailsPrefix: 'Chi tiết:',
    household: 'Gia đình',
    firstName: 'Tên',
    lastName: 'Họ',
    phone: 'Điện thoại',
    email: 'Email',
    language: 'Ngôn ngữ',
    attendance: 'Tham dự',
    partySize: 'Số khách',
    otherGuests: 'Khách khác',
    notes: 'Ghi chú',
    noneValue: 'không có',
  },
};

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
      const existingPhone = getCanonicalPhoneFromRow_(row, indexMap);
      return existingPhone && existingPhone === payload.phoneE164;
    });
    const existingRow = duplicateRowIndex >= 0 ? rows[duplicateRowIndex] : null;
    const isNewRow = duplicateRowIndex < 0;

    const newRowValues = buildRowValues_({
      payload,
      indexMap,
      existingRow,
      columnCount,
    });

    let targetRowNumber;
    if (duplicateRowIndex >= 0) {
      targetRowNumber = duplicateRowIndex + 2;
      sheet.getRange(targetRowNumber, 1, 1, newRowValues.length).setValues([newRowValues]);
      Logger.log('Updated existing row %s for %s', duplicateRowIndex + 2, payload.phoneE164);
    } else {
      sheet.appendRow(newRowValues);
      targetRowNumber = sheet.getLastRow();
      Logger.log('Appended new row for %s', payload.phoneE164);
    }

    maybeSendConfirmation_({
      sheet,
      rowNumber: targetRowNumber,
      rowValues: newRowValues,
      indexMap,
      payload,
      existingRow,
      isNewRow,
    });

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

function doOptions() {
  return jsonResponse_(204, {});
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
  const spreadsheet = getSpreadsheet_();
  let sheet = SHEET_NAME ? spreadsheet.getSheetByName(SHEET_NAME) : spreadsheet.getSheets()[0];
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  ensureHeaderRow_(sheet);

  return sheet;
}

function getSpreadsheet_() {
  const spreadsheet = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw httpError_(500, 'Unable to locate spreadsheet. Set SPREADSHEET_ID.');
  }

  return spreadsheet;
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

function sendReminders() {
  return sendRemindersWithConfig_();
}

function sendRemindersTest() {
  const overrideConfig = getOrCreateReminderTestConfig_();
  return sendRemindersWithConfig_(overrideConfig);
}

function sendRemindersWithConfig_(overrideConfig) {
  let lock;
  let locked = false;
  try {
    lock = LockService.getScriptLock();
    lock.waitLock(30 * 1000);
    locked = true;

    const sheet = resolveSheet_();
    const { rows, indexMap } = readSheet_(sheet);
    if (!rows.length) {
      Logger.log('sendReminders: no rows to inspect');
      return 0;
    }

    const props = getScriptProperties_();
    const rsvpLink = sanitizeString_(props.RSVP_LINK);
    if (!rsvpLink) {
      throw new Error('Missing RSVP_LINK script property.');
    }
    const reminderConfig = overrideConfig || getReminderConfig_(props);
    Logger.log(
      'Reminder config -> eventDate: %s, offsetsMs: %s',
      reminderConfig.eventDate,
      JSON.stringify(reminderConfig.offsetsMs)
    );
    const scheduleOffsets = reminderConfig.offsetsMs || [];

    let remindersSent = 0;
    rows.forEach((row, idx) => {
      const attendanceValue = sanitizeString_(row[indexMap.attendance]).toUpperCase();
      if (attendanceValue) {
        return;
      }
      const phone = getCanonicalPhoneFromRow_(row, indexMap);
      if (!phone) {
        return;
      }
      const smsOptOutValue = typeof indexMap.smsOptOut === 'number' ? row[indexMap.smsOptOut] : false;
      if (isSmsOptedOut_(smsOptOutValue)) {
        return;
      }
      let reminderCount = Number(row[indexMap.reminderCount]) || 0;
      const scheduleCount = scheduleOffsets.length;
      if (reminderCount >= scheduleCount) {
        return;
      }
      const now = new Date();
      if (!isReminderWindowOpen_(reminderCount, now, reminderConfig)) {
        return;
      }
      const displayName =
        sanitizeString_(row[indexMap.firstName]) ||
        sanitizeString_(row[indexMap.householdName]) ||
        'friend';
      const languageValue = getLanguageCode_(row[indexMap.language]);
      const body = buildReminderMessage_(reminderCount + 1, displayName, rsvpLink, languageValue);
      const result = sendSmsWithLogging_({
        type: 'REMINDER',
        to: phone,
        body,
        rethrowOnError: false,
      });
      if (result.status === 'FAILED' || result.status === 'DRY_RUN') {
        return;
      }
      reminderCount += 1;
      const rowNumber = idx + 2;
      sheet.getRange(rowNumber, indexMap.lastReminderAt + 1).setValue(result.attemptAt);
      sheet.getRange(rowNumber, indexMap.reminderCount + 1).setValue(reminderCount);
      remindersSent += 1;
    });

    Logger.log('sendReminders completed. Sent %s reminder(s).', remindersSent);
    return remindersSent;
  } finally {
    if (lock && locked) {
      lock.releaseLock();
    }
  }
}

function testSendSmsToMe() {
  const props = getScriptProperties_();
  const to = sanitizeString_(props.TWILIO_TEST_TO);
  if (!to) {
    throw new Error('Set TWILIO_TEST_TO script property before running testSendSmsToMe.');
  }

  const result = sendSmsWithLogging_({
    type: 'TEST',
    to,
    body: 'RSVP SMS test message.',
    rethrowOnError: true,
  });

  Logger.log('Test SMS dispatched at %s with status %s', result.attemptAt, result.status);
  return result;
}

function maybeSendConfirmation_({ sheet, rowNumber, rowValues, indexMap, payload, existingRow, isNewRow }) {
  if (typeof indexMap.confirmationSentAt !== 'number') {
    return;
  }

  const smsOptOutValue = typeof indexMap.smsOptOut === 'number' ? rowValues[indexMap.smsOptOut] : false;
  if (isSmsOptedOut_(smsOptOutValue)) {
    return;
  }

  if (!payload.phoneE164) {
    return;
  }

  const message = buildConfirmationMessage_(payload);
  const result = sendSmsWithLogging_({
    type: 'CONFIRMATION',
    to: payload.phoneE164,
    body: message,
    rethrowOnError: false,
  });

  sheet.getRange(rowNumber, indexMap.confirmationSentAt + 1).setValue(result.attemptAt);
}

function sendSmsWithLogging_({ type, to, body, rethrowOnError }) {
  const attemptAt = new Date();
  let status = 'SENT';
  let sid = '';
  let errorMessage = '';
  try {
    const result = sendSms_(to, body);
    status = result.dryRun ? 'DRY_RUN' : 'SENT';
    sid = result.sid || '';
    return { attemptAt, status, sid };
  } catch (err) {
    status = 'FAILED';
    errorMessage = err?.message || String(err);
    if (rethrowOnError) {
      throw err;
    }
    return { attemptAt, status, error: errorMessage };
  } finally {
    logOutboxEntry_({
      timestamp: attemptAt,
      type,
      to,
      body,
      status,
      error: errorMessage,
      sid,
    });
  }
}

function sendSms_(to, body) {
  const toNumber = sanitizeString_(to);
  if (!toNumber) {
    throw new Error('Missing SMS recipient.');
  }
  if (!body) {
    throw new Error('Missing SMS body.');
  }

  const props = getScriptProperties_();
  const mode = (props.SMS_MODE || 'DRY_RUN').toUpperCase();
  const isLive = mode === 'LIVE';

  if (!isLive) {
    Logger.log('DRY_RUN SMS -> %s: %s', toNumber, body);
    return { ok: true, dryRun: true };
  }

  const accountSid = sanitizeString_(props.TWILIO_ACCOUNT_SID);
  const authToken = sanitizeString_(props.TWILIO_AUTH_TOKEN);
  const fromNumber = sanitizeString_(props.TWILIO_FROM_NUMBER);

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Missing Twilio credentials. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER.');
  }

  const url = 'https://api.twilio.com/2010-04-01/Accounts/' + encodeURIComponent(accountSid) + '/Messages.json';
  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    muteHttpExceptions: true,
    payload: {
      To: toNumber,
      From: fromNumber,
      Body: body,
    },
    contentType: 'application/x-www-form-urlencoded',
    headers: {
      Authorization: 'Basic ' + Utilities.base64Encode(accountSid + ':' + authToken),
    },
  });

  const statusCode = response.getResponseCode();
  const responseBody = response.getContentText();
  Logger.log('Twilio response (%s): %s', statusCode, responseBody);

  if (statusCode < 200 || statusCode >= 300) {
    throw new Error('Twilio error (' + statusCode + '): ' + responseBody);
  }

  let sid = '';
  try {
    const parsed = JSON.parse(responseBody);
    sid = parsed.sid || '';
  } catch (err) {
    Logger.log('Unable to parse Twilio response JSON: %s', err);
  }

  return { ok: true, dryRun: false, sid };
}

function buildConfirmationMessage_(payload) {
  const firstName = payload.firstName || payload.householdName || 'friend';
  const langKey = getLanguageCode_(payload.language);
  const templateSet = CONFIRMATION_TEMPLATES[langKey] || CONFIRMATION_TEMPLATES.EN;
  const attendanceKey = payload.attendance === 'YES' ? 'YES' : 'NO';
  const formatter = templateSet[attendanceKey] || CONFIRMATION_TEMPLATES.EN[attendanceKey];
  const baseMessage =
    attendanceKey === 'YES' ? formatter(firstName, payload.partySize) : formatter(firstName);
  const allowance =
    SMS_MAX_CHAR_LENGTH - TWILIO_TRIAL_PREFIX_LENGTH - baseMessage.length - 1; // 1 for space separator
  if (allowance <= 0) {
    return baseMessage;
  }
  const summary = buildConfirmationSummary_(payload, langKey, allowance);
  return summary ? baseMessage + ' ' + summary : baseMessage;
}

function buildConfirmationSummary_(payload, langKey, maxLength) {
  const labels = CONFIRMATION_DETAIL_LABELS[langKey] || CONFIRMATION_DETAIL_LABELS.EN;
  const summaryParts = [
    payload.attendance ? labels.attendance + ': ' + payload.attendance : '',
    typeof payload.partySize === 'number' && payload.attendance === 'YES'
      ? labels.partySize + ': ' + payload.partySize
      : '',
    payload.otherGuestNames ? labels.otherGuests + ': ' + payload.otherGuestNames : '',
    payload.notes ? labels.notes + ': ' + truncateText_(payload.notes, 60) : '',
  ].filter(Boolean);

  if (!summaryParts.length) {
    return '';
  }

  let summary = summaryParts.join(', ');
  const prefix = labels.detailsPrefix + ' ';

  if (maxLength <= prefix.length + 1) {
    return '';
  }

  let fullText = prefix + summary;
  if (fullText.length <= maxLength) {
    return fullText;
  }

  const available = maxLength - prefix.length - 1;
  summary = summary.substring(0, Math.max(0, available)) + '…';
  fullText = prefix + summary;
  return fullText.length > maxLength ? fullText.substring(0, maxLength) : fullText;
}

function truncateText_(text, maxLength) {
  const safe = sanitizeString_(text);
  if (safe.length <= maxLength) {
    return safe;
  }
  return safe.substring(0, Math.max(0, maxLength - 1)) + '…';
}

function buildReminderMessage_(reminderNumber, name, link, language) {
  const safeName = name || 'friend';
  const langKey = language || 'EN';
  const templateSet = REMINDER_TEMPLATES[langKey] || REMINDER_TEMPLATES.EN;
  const index = Math.min(Math.max(reminderNumber - 1, 0), templateSet.length - 1);
  const templateFn = templateSet[index];
  return templateFn(safeName, link);
}

function valueToDate_(value) {
  if (value instanceof Date) {
    return value;
  }
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function isSmsOptedOut_(value) {
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

function logOutboxEntry_({ timestamp, type, to, body, status, error, sid }) {
  try {
    const sheet = resolveOutboxSheet_();
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

function resolveOutboxSheet_() {
  const spreadsheet = getSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(OUTBOX_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(OUTBOX_SHEET_NAME);
  }
  ensureOutboxHeader_(sheet);
  return sheet;
}

function ensureOutboxHeader_(sheet) {
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

function getScriptProperties_() {
  return PropertiesService.getScriptProperties().getProperties();
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

function getLanguageCode_(value) {
  const normalized = sanitizeString_(value).toUpperCase();
  return normalized === 'VI' ? 'VI' : 'EN';
}

function getReminderConfig_(props) {
  const properties = props || getScriptProperties_();
  return {
    eventDate: resolveReminderEventDate_(properties),
    offsetsMs: resolveReminderOffsets_(properties),
  };
}

function resolveReminderEventDate_(props) {
  const overrideRaw = sanitizeString_(props && props[TEST_EVENT_DATE_PROPERTY]);
  if (overrideRaw) {
    const parsed = new Date(overrideRaw);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return DEFAULT_EVENT_DATE;
}

function resolveReminderOffsets_(props) {
  const overrideRaw = sanitizeString_(props && props[TEST_OFFSETS_PROPERTY]);
  if (overrideRaw) {
    const seconds = overrideRaw
      .split(',')
      .map((part) => Number(part.trim()))
      .filter((value) => Number.isFinite(value) && value >= 0);
    if (seconds.length) {
      return seconds.map((value) => value * 1000);
    }
  }
  return DEFAULT_REMINDER_SCHEDULE_DAYS.map((days) => Math.max(0, days) * ONE_DAY_MS);
}

function isReminderWindowOpen_(reminderCount, now, reminderConfig) {
  const config = reminderConfig || {};
  const eventDate = config.eventDate;
  const offsets = config.offsetsMs;
  if (!(eventDate instanceof Date) || isNaN(eventDate.getTime())) {
    return true;
  }
  const offsetMs = Array.isArray(offsets) ? offsets[reminderCount] : undefined;
  if (typeof offsetMs !== 'number') {
    return false;
  }
  const eventTime = eventDate.getTime();
  if (now.getTime() > eventTime) {
    return false;
  }
  const targetTime = eventTime - offsetMs;
  return now.getTime() >= targetTime;
}

function getCanonicalPhoneFromRow_(row, indexMap) {
  if (!row || !indexMap) return '';
  const e164Value = canonicalizePhoneValue_(row[indexMap.phoneE164]);
  if (e164Value) {
    return e164Value;
  }
  return canonicalizePhoneValue_(row[indexMap.phone]);
}

function canonicalizePhoneValue_(value) {
  const raw = sanitizeString_(value);
  if (!raw) {
    return '';
  }
  const canonical = toE164AU_(raw);
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

function getOrCreateReminderTestConfig_() {
  const cache = CacheService.getScriptCache();
  let eventIso = cache.get(REMINDER_TEST_EVENT_CACHE_KEY);
  let eventDate = eventIso ? new Date(eventIso) : null;
  if (!eventDate || isNaN(eventDate.getTime())) {
    eventDate = new Date(Date.now() + 5 * 60 * 1000);
    cache.put(REMINDER_TEST_EVENT_CACHE_KEY, eventDate.toISOString(), 600);
  }
  let offsetsValue = cache.get(REMINDER_TEST_OFFSETS_CACHE_KEY);
  let offsetsMs = [];
  if (offsetsValue) {
    offsetsMs = offsetsValue
      .split(',')
      .map((part) => Number(part.trim()))
      .filter((value) => Number.isFinite(value) && value >= 0)
      .map((seconds) => seconds * 1000);
  }
  if (!offsetsMs.length) {
    const offsetsSeconds = [180, 60, 30];
    offsetsMs = offsetsSeconds.map((seconds) => seconds * 1000);
    cache.put(REMINDER_TEST_OFFSETS_CACHE_KEY, offsetsSeconds.join(','), 600);
  }
  return { eventDate, offsetsMs };
}

function clearReminderTestCache() {
  const cache = CacheService.getScriptCache();
  cache.remove(REMINDER_TEST_EVENT_CACHE_KEY);
  cache.remove(REMINDER_TEST_OFFSETS_CACHE_KEY);
}

