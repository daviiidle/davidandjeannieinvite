/**
 * ConfirmationService.gs
 *
 * Handles RSVP confirmation message generation and sending.
 * Builds localized confirmation messages with details summary.
 */

const ConfirmationService = (function () {
  /**
   * Builds a confirmation message from an RSVP payload.
   *
   * @param {Object} payload - The RSVP payload
   * @return {string} Confirmation message
   */
  function buildConfirmationMessage(payload) {
    const firstName = payload.firstName || payload.householdName || 'friend';
    const langKey = getLanguageCode_(payload.language);
    const templateSet = CONFIRMATION_TEMPLATES[langKey] || CONFIRMATION_TEMPLATES.EN;
    const attendanceKey = payload.attendance === 'YES' ? 'YES' : 'NO';
    const formatter = templateSet[attendanceKey] || CONFIRMATION_TEMPLATES.EN[attendanceKey];
    const baseMessage =
      attendanceKey === 'YES' ? formatter(firstName, payload.partySize) : formatter(firstName);
    const allowance =
      SMS_MAX_CHAR_LENGTH - TWILIO_TRIAL_PREFIX_LENGTH - baseMessage.length - 1;
    if (allowance <= 0) {
      return baseMessage;
    }
    const summary = buildConfirmationSummary(payload, langKey, allowance);
    return summary ? baseMessage + ' ' + summary : baseMessage;
  }

  /**
   * Builds a summary of RSVP details to append to confirmation message.
   *
   * @param {Object} payload - The RSVP payload
   * @param {string} langKey - Language code (EN or VI)
   * @param {number} maxLength - Maximum length allowed
   * @return {string} Summary string or empty if it won't fit
   */
  function buildConfirmationSummary(payload, langKey, maxLength) {
    const labels = CONFIRMATION_DETAIL_LABELS[langKey] || CONFIRMATION_DETAIL_LABELS.EN;
    const summaryParts = [
      payload.attendance ? labels.attendance + ': ' + payload.attendance : '',
      typeof payload.partySize === 'number' && payload.attendance === 'YES'
        ? labels.partySize + ': ' + payload.partySize
        : '',
      payload.otherGuestNames ? labels.otherGuests + ': ' + payload.otherGuestNames : '',
      payload.notes ? labels.notes + ': ' + StringUtils.truncate(payload.notes, 60) : '',
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

  /**
   * Sends a confirmation SMS for an RSVP submission.
   *
   * @param {Object} options - Confirmation options
   * @param {GoogleAppsScript.Spreadsheet.Sheet} options.sheet - The RSVP sheet
   * @param {number} options.rowNumber - Row number that was updated
   * @param {Array} options.rowValues - Complete row values
   * @param {Object} options.indexMap - Column index mapping
   * @param {Object} options.payload - The RSVP payload
   * @param {Array} options.existingRow - Existing row values (or null)
   * @param {boolean} options.isNewRow - Whether this is a new row
   */
  function maybeSendConfirmation({ sheet, rowNumber, rowValues, indexMap, payload, existingRow, isNewRow }) {
    if (typeof indexMap.confirmationSentAt !== 'number') {
      return;
    }

    const smsOptOutValue = typeof indexMap.smsOptOut === 'number' ? rowValues[indexMap.smsOptOut] : false;
    if (StringUtils.isSmsOptedOut(smsOptOutValue)) {
      return;
    }

    if (!payload.phoneE164) {
      return;
    }

    const message = buildConfirmationMessage(payload);
    const result = SmsService.sendSmsWithLogging({
      type: 'CONFIRMATION',
      to: payload.phoneE164,
      body: message,
      rethrowOnError: false,
    });

    sheet.getRange(rowNumber, indexMap.confirmationSentAt + 1).setValue(result.attemptAt);
  }

  return {
    buildConfirmationMessage: buildConfirmationMessage,
    maybeSendConfirmation: maybeSendConfirmation,
  };
})();
