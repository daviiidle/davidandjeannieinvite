/**
 * Config.gs
 *
 * Central configuration file containing all constants, header mappings,
 * message templates, and configuration settings for the RSVP system.
 *
 * This file should be the single source of truth for all configuration values.
 */

const SPREADSHEET_ID = '10JrN7JVnGNO3Za4TNpwX7yfEhkaLghv8o9m-_0WVtlo';
const SHEET_NAME = 'Sheet1';
const SOURCE_LABEL = 'WEBSITE';
const OUTBOX_SHEET_NAME = 'OUTBOX';

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

const OUTBOX_HEADERS = ['Timestamp', 'Type', 'To', 'Body', 'Status', 'Error', 'TwilioSid'];

const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;

// Reminder cooldown periods (days)
const REMINDER_COOLDOWN_AFTER_FIRST = 10;  // Wait 10 days after reminder #1
const REMINDER_COOLDOWN_AFTER_SECOND = 8;   // Wait 8 days after reminder #2

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

function getLanguageCode_(value) {
  const normalized = StringUtils.sanitize(value).toUpperCase();
  return normalized === 'VI' ? 'VI' : 'EN';
}
