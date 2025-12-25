/**
 * ReminderService.gs
 *
 * Handles automated RSVP reminder scheduling and sending.
 * Sends reminders to guests who haven't responded based on configurable schedule.
 */

const ReminderService = (function () {
  /**
   * Checks if we should send a reminder to this guest based on strict cooldown rules.
   *
   * COOLDOWN RULES:
   * - Reminder #1: Can send anytime (state: NONE)
   * - Reminder #2: Must wait 10 FULL DAYS after reminder #1 (state: FIRST_SENT)
   * - Reminder #3: Must wait 8 FULL DAYS after reminder #2 (state: SECOND_SENT)
   * - After #3: NO MORE REMINDERS (state: FINAL_SENT)
   *
   * @param {number} reminderCount - Number of reminders already sent (0, 1, 2, or 3)
   * @param {Date} lastReminderAt - When the last reminder was sent (or null)
   * @param {Date} now - Current date/time
   * @param {Object} reminderConfig - Reminder configuration
   * @return {Object} { allowed: boolean, reason: string }
   */
  function shouldSendReminder(reminderCount, lastReminderAt, now, reminderConfig) {
    if (reminderConfig && reminderConfig.forceSend) {
      return { allowed: true, reason: 'FORCE_SEND override' };
    }

    // Determine state
    let state;
    if (reminderCount === 0) {
      state = 'NONE';
    } else if (reminderCount === 1) {
      state = 'FIRST_SENT';
    } else if (reminderCount === 2) {
      state = 'SECOND_SENT';
    } else {
      state = 'FINAL_SENT';
    }

    // If already sent 3 reminders, DO NOT SEND
    if (state === 'FINAL_SENT') {
      return { allowed: false, reason: 'FINAL_SENT — no more reminders allowed' };
    }

    // State: NONE (no reminders sent yet) - can send anytime
    if (state === 'NONE') {
      return { allowed: true, reason: 'First reminder — no cooldown required' };
    }

    // For FIRST_SENT and SECOND_SENT states, check cooldown
    if (!lastReminderAt || !(lastReminderAt instanceof Date) || isNaN(lastReminderAt.getTime())) {
      // No valid timestamp - allow send (data integrity issue)
      return { allowed: true, reason: 'No valid last reminder timestamp' };
    }

    const daysSinceLastReminder = Math.floor((now.getTime() - lastReminderAt.getTime()) / ONE_DAY_MS);

    if (state === 'FIRST_SENT') {
      // Must wait REMINDER_COOLDOWN_AFTER_FIRST full days before sending reminder #2
      if (daysSinceLastReminder < REMINDER_COOLDOWN_AFTER_FIRST) {
        return {
          allowed: false,
          reason: 'DO NOT SEND — cooldown not satisfied. Need ' + REMINDER_COOLDOWN_AFTER_FIRST + ' days, only ' + daysSinceLastReminder + ' days passed.'
        };
      }
      return { allowed: true, reason: 'Second reminder — ' + REMINDER_COOLDOWN_AFTER_FIRST + '-day cooldown satisfied (' + daysSinceLastReminder + ' days)' };
    }

    if (state === 'SECOND_SENT') {
      // Must wait REMINDER_COOLDOWN_AFTER_SECOND full days before sending reminder #3
      if (daysSinceLastReminder < REMINDER_COOLDOWN_AFTER_SECOND) {
        return {
          allowed: false,
          reason: 'DO NOT SEND — cooldown not satisfied. Need ' + REMINDER_COOLDOWN_AFTER_SECOND + ' days, only ' + daysSinceLastReminder + ' days passed.'
        };
      }
      return { allowed: true, reason: 'Final reminder — ' + REMINDER_COOLDOWN_AFTER_SECOND + '-day cooldown satisfied (' + daysSinceLastReminder + ' days)' };
    }

    return { allowed: false, reason: 'Unknown state' };
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
      const reminderConfig = overrideConfig || {};
      const now = new Date();

      Logger.log('sendReminders running. Mode: %s', reminderConfig.forceSend ? 'FORCE_SEND' : 'NORMAL');

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
        if (reminderCount >= 3) {
          return;
        }
        const lastReminderAt = lastReminderColumnIndex !== null ? row[lastReminderColumnIndex] : null;
        const lastReminderDate = StringUtils.valueToDate(lastReminderAt);

        const displayName =
          StringUtils.sanitize(row[indexMap.firstName]) ||
          StringUtils.sanitize(row[indexMap.householdName]) ||
          'friend';
        const languageValue = getLanguageCode_(row[indexMap.language]);
        eligibleEntries.push({
          rowIndex: idx,
          reminderCount: reminderCount,
          lastReminderAt: lastReminderDate,
          phone: phone,
          displayName: displayName,
          languageValue: languageValue,
        });
      });

      if (!eligibleEntries.length) {
        Logger.log('sendReminders: no eligible rows to process');
        return 0;
      }

      // Group by reminder count to send in batches
      const byReminderCount = {};
      eligibleEntries.forEach((entry) => {
        const nextReminder = entry.reminderCount + 1;
        if (!byReminderCount[nextReminder]) {
          byReminderCount[nextReminder] = [];
        }
        byReminderCount[nextReminder].push(entry);
      });

      // Find the lowest reminder count (send to those who need it most)
      const reminderNumbers = Object.keys(byReminderCount).map(Number).sort((a, b) => a - b);
      const targetReminderNumber = reminderNumbers.length > 0 ? reminderNumbers[0] : null;

      if (!targetReminderNumber) {
        Logger.log('No reminders to send');
        return 0;
      }

      Logger.log('Sending reminder #%s to %s guest(s)', targetReminderNumber, byReminderCount[targetReminderNumber].length);

      let remindersSent = 0;
      let skippedCooldown = 0;
      const cooldownReasons = [];

      byReminderCount[targetReminderNumber].forEach((entry) => {
        // Check strict cooldown rules
        const result = shouldSendReminder(entry.reminderCount, entry.lastReminderAt, now, reminderConfig);

        if (!result.allowed) {
          skippedCooldown += 1;
          if (cooldownReasons.length < 3) {  // Only log first 3 for brevity
            cooldownReasons.push(entry.displayName + ': ' + result.reason);
          }
          return;
        }

        Logger.log('Sending to %s: %s', entry.displayName, result.reason);

        const body = buildReminderMessage(targetReminderNumber, entry.displayName, rsvpLink, entry.languageValue);
        const smsResult = SmsService.sendSmsWithLogging({
          type: 'REMINDER',
          to: entry.phone,
          body: body,
          rethrowOnError: false,
        });
        if (smsResult.status === 'FAILED' || smsResult.status === 'DRY_RUN') {
          return;
        }
        const updatedReminderCount = entry.reminderCount + 1;
        const rowNumber = entry.rowIndex + 2;
        if (lastReminderColumnIndex !== null) {
          sheet.getRange(rowNumber, lastReminderColumnIndex + 1).setValue(smsResult.attemptAt);
        }
        if (reminderColumnIndex !== null) {
          sheet.getRange(rowNumber, reminderColumnIndex + 1).setValue(updatedReminderCount);
        }
        remindersSent += 1;
      });

      if (cooldownReasons.length > 0) {
        Logger.log('Cooldown blocked examples:\n' + cooldownReasons.join('\n'));
      }

      Logger.log('sendReminders completed. Sent: %s, Skipped (cooldown): %s', remindersSent, skippedCooldown);
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
  // Sends next reminder batch immediately, regardless of schedule
  // Finds the lowest reminder count among eligible guests and sends to all at that level
  const overrideConfig = {
    forceSend: true,  // Bypass time window checks
  };

  let lock;
  let locked = false;
  try {
    lock = LockService.getScriptLock();
    lock.waitLock(30 * 1000);
    locked = true;

    const sheet = SheetOperations.resolveSheet();
    const { rows, indexMap } = SheetOperations.readSheet(sheet);

    if (!rows.length) {
      Logger.log('No rows to process');
      return 'No guests found';
    }

    const props = SmsService.getScriptProperties();
    const rsvpLink = StringUtils.sanitize(props.RSVP_LINK);
    if (!rsvpLink) {
      throw new Error('Missing RSVP_LINK script property.');
    }

    const reminderColumnIndex = typeof indexMap.reminderCount === 'number' ? indexMap.reminderCount : null;
    const lastReminderColumnIndex = typeof indexMap.lastReminderAt === 'number' ? indexMap.lastReminderAt : null;

    // Find all eligible guests
    const eligibleEntries = [];
    rows.forEach((row, idx) => {
      const attendanceValue = StringUtils.sanitize(row[indexMap.attendance]).toUpperCase();
      if (attendanceValue) return;  // Already responded

      const phone = PhoneUtils.getCanonicalPhoneFromRow(row, indexMap);
      if (!phone) return;  // No phone number

      const smsOptOutValue = typeof indexMap.smsOptOut === 'number' ? row[indexMap.smsOptOut] : false;
      if (StringUtils.isSmsOptedOut(smsOptOutValue)) return;  // Opted out

      const reminderCount = reminderColumnIndex === null ? 0 : Number(row[reminderColumnIndex]) || 0;
      if (reminderCount >= 3) return;  // Already sent all 3 reminders

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
      Logger.log('No eligible guests for reminders');
      return 'No eligible guests found';
    }

    // Find the minimum reminder count (send to those who need it most)
    const minReminderCount = eligibleEntries.reduce((min, entry) => {
      return entry.reminderCount < min ? entry.reminderCount : min;
    }, Infinity);

    Logger.log('Sending reminder #%s to guests with count %s', minReminderCount + 1, minReminderCount);

    let remindersSent = 0;
    eligibleEntries.forEach((entry) => {
      // Only send to guests at the minimum reminder count level
      if (entry.reminderCount !== minReminderCount) return;

      const body = ReminderService.buildReminderMessage(
        entry.reminderCount + 1,
        entry.displayName,
        rsvpLink,
        entry.languageValue
      );

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

    const message = 'Sent reminder #' + (minReminderCount + 1) + ' to ' + remindersSent + ' guest(s)';
    Logger.log(message);
    return message;

  } finally {
    if (lock && locked) {
      lock.releaseLock();
    }
  }
}

function testSendSmsToMe() {
  return SmsService.testSendSmsToMe();
}
