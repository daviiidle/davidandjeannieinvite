/**
 * ReminderService.gs
 *
 * Handles automated RSVP reminder scheduling and sending.
 * Sends reminders to guests who haven't responded based on configurable schedule.
 */

const ReminderService = (function () {
  /**
   * Gets reminder configuration from script properties.
   *
   * @param {Object} props - Script properties (optional)
   * @return {Object} Configuration with eventDate and offsetsMs
   */
  function getReminderConfig(props) {
    const properties = props || SmsService.getScriptProperties();
    return {
      eventDate: resolveReminderEventDate(properties),
      offsetsMs: resolveReminderOffsets(properties),
    };
  }

  /**
   * Resolves the reminder event date from properties or defaults.
   *
   * @param {Object} props - Script properties
   * @return {Date} Event date
   */
  function resolveReminderEventDate(props) {
    const overrideRaw = StringUtils.sanitize(props && props[TEST_EVENT_DATE_PROPERTY]);
    if (overrideRaw) {
      const parsed = new Date(overrideRaw);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return DEFAULT_EVENT_DATE;
  }

  /**
   * Resolves reminder offset schedule from properties or defaults.
   *
   * @param {Object} props - Script properties
   * @return {Array<number>} Array of offsets in milliseconds
   */
  function resolveReminderOffsets(props) {
    const overrideRaw = StringUtils.sanitize(props && props[TEST_OFFSETS_PROPERTY]);
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

  /**
   * Checks if the reminder window is currently open for a given reminder count.
   *
   * @param {number} reminderCount - Number of reminders already sent
   * @param {Date} now - Current date/time
   * @param {Object} reminderConfig - Reminder configuration
   * @return {boolean} True if window is open
   */
  function isReminderWindowOpen(reminderCount, now, reminderConfig) {
    if (reminderConfig && reminderConfig.forceSend) {
      return true;
    }
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

  /**
   * Builds a reminder message using the appropriate template.
   *
   * @param {number} reminderNumber - Reminder number (1-based)
   * @param {string} name - Recipient name
   * @param {string} link - RSVP link
   * @param {string} language - Language code (EN or VI)
   * @return {string} Reminder message
   */
  function buildReminderMessage(reminderNumber, name, link, language) {
    const safeName = name || 'friend';
    const langKey = language || 'EN';
    const templateSet = REMINDER_TEMPLATES[langKey] || REMINDER_TEMPLATES.EN;
    const index = Math.min(Math.max(reminderNumber - 1, 0), templateSet.length - 1);
    const templateFn = templateSet[index];
    return templateFn(safeName, link);
  }

  /**
   * Sends reminders with optional configuration overrides.
   *
   * @param {Object} overrideConfig - Optional configuration overrides
   * @return {number} Number of reminders sent
   */
  function sendRemindersWithConfig(overrideConfig) {
    let lock;
    let locked = false;
    try {
      lock = LockService.getScriptLock();
      lock.waitLock(30 * 1000);
      locked = true;

      const sheet = SheetOperations.resolveSheet();
      const { rows, indexMap } = SheetOperations.readSheet(sheet);
      if (!rows.length) {
        Logger.log('sendReminders: no rows to inspect');
        return 0;
      }

      const props = SmsService.getScriptProperties();
      const rsvpLink = StringUtils.sanitize(props.RSVP_LINK);
      if (!rsvpLink) {
        throw new Error('Missing RSVP_LINK script property.');
      }
      const defaultConfig = getReminderConfig(props);
      const reminderConfig = overrideConfig ? Object.assign({}, defaultConfig, overrideConfig) : defaultConfig;
      const manualMode = Boolean(overrideConfig && overrideConfig.manualTrigger);
      Logger.log(
        'Reminder config -> eventDate: %s, offsetsMs: %s',
        reminderConfig.eventDate,
        JSON.stringify(reminderConfig.offsetsMs)
      );
      const scheduleOffsets = reminderConfig.offsetsMs || [];
      const scheduleCount = scheduleOffsets.length || MAX_REMINDER_TEMPLATE_COUNT;
      const reminderColumnIndex = typeof indexMap.reminderCount === 'number' ? indexMap.reminderCount : null;
      const lastReminderColumnIndex = typeof indexMap.lastReminderAt === 'number' ? indexMap.lastReminderAt : null;

      const eligibleEntries = [];
      rows.forEach((row, idx) => {
        const attendanceValue = StringUtils.sanitize(row[indexMap.attendance]).toUpperCase();
        if (attendanceValue) {
          return;
        }
        const phone = PhoneUtils.getCanonicalPhoneFromRow(row, indexMap);
        if (!phone) {
          return;
        }
        const smsOptOutValue = typeof indexMap.smsOptOut === 'number' ? row[indexMap.smsOptOut] : false;
        if (StringUtils.isSmsOptedOut(smsOptOutValue)) {
          return;
        }
        const reminderCount = reminderColumnIndex === null ? 0 : Number(row[reminderColumnIndex]) || 0;
        if (scheduleCount && reminderCount >= scheduleCount) {
          return;
        }
        const displayName =
          StringUtils.sanitize(row[indexMap.firstName]) ||
          StringUtils.sanitize(row[indexMap.householdName]) ||
          'friend';
        const languageValue = getLanguageCode_(row[indexMap.language]);
        eligibleEntries.push({
          rowIndex: idx,
          reminderCount: reminderCount,
          phone: phone,
          displayName: displayName,
          languageValue: languageValue,
        });
      });

      if (!eligibleEntries.length) {
        Logger.log('sendReminders: no eligible rows to process');
        return 0;
      }

      let manualTargetCount = null;
      let manualEligibleCount = 0;
      if (manualMode) {
        manualTargetCount = eligibleEntries.reduce((min, entry) => {
          return entry.reminderCount < min ? entry.reminderCount : min;
        }, Infinity);
        if (!isFinite(manualTargetCount)) {
          Logger.log('sendReminders: manual run skipped (no pending reminders)');
          return 0;
        }
        manualEligibleCount = eligibleEntries.filter((entry) => entry.reminderCount === manualTargetCount).length;
        if (!manualEligibleCount) {
          Logger.log('sendReminders: manual run skipped (no rows matching target reminder count %s)', manualTargetCount);
          return 0;
        }
        Logger.log(
          'sendRemindersManual targeting reminder #%s for %s recipient(s).',
          manualTargetCount + 1,
          manualEligibleCount
        );
      }

      let remindersSent = 0;
      eligibleEntries.forEach((entry) => {
        if (manualMode && entry.reminderCount !== manualTargetCount) {
          return;
        }
        const now = new Date();
        if (!manualMode && !isReminderWindowOpen(entry.reminderCount, now, reminderConfig)) {
          return;
        }
        const body = buildReminderMessage(entry.reminderCount + 1, entry.displayName, rsvpLink, entry.languageValue);
        const result = SmsService.sendSmsWithLogging({
          type: 'REMINDER',
          to: entry.phone,
          body: body,
          rethrowOnError: false,
        });
        if (result.status === 'FAILED' || result.status === 'DRY_RUN') {
          return;
        }
        const updatedReminderCount = entry.reminderCount + 1;
        const rowNumber = entry.rowIndex + 2;
        if (lastReminderColumnIndex !== null) {
          sheet.getRange(rowNumber, lastReminderColumnIndex + 1).setValue(result.attemptAt);
        }
        if (reminderColumnIndex !== null) {
          sheet.getRange(rowNumber, reminderColumnIndex + 1).setValue(updatedReminderCount);
        }
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

  return {
    sendRemindersWithConfig: sendRemindersWithConfig,
    buildReminderMessage: buildReminderMessage,
  };
})();

function sendReminders() {
  return ReminderService.sendRemindersWithConfig();
}

function sendRemindersManual() {
  return ReminderService.sendRemindersWithConfig({ forceSend: true, manualTrigger: true });
}

function sendRemindersTest() {
  const overrideConfig = {
    eventDate: new Date(),
    offsetsMs: [0, 0, 0],
    forceSend: true,
  };
  return ReminderService.sendRemindersWithConfig(overrideConfig);
}

function testSendSmsToMe() {
  return SmsService.testSendSmsToMe();
}
