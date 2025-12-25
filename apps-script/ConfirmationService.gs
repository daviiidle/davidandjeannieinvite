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
  function buildConfirmationMessage(payload, viewUrl) {
    const partySize = payload.attendance === 'YES' ? Number(payload.partySize) || 0 : 0;
    const base =
      partySize > 0 ? 'RSVP saved for ' + partySize + '.' : 'RSVP saved.';
    const linkSegment = viewUrl ? ' View/edit: ' + viewUrl : '';
    const optOut = ' Reply STOP to opt out.';
    let message = base + linkSegment;
    if (message.length + optOut.length <= SMS_MAX_CHAR_LENGTH) {
      message += optOut;
    }
    return message;
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

    const token =
      typeof indexMap.token === 'number' ? StringUtils.sanitize(rowValues[indexMap.token]) : '';
    const viewUrl = RsvpAccessService.buildViewUrl(token);
    if (!viewUrl) {
      return;
    }

    const message = buildConfirmationMessage(payload, viewUrl);
    const result = SmsService.sendSmsWithLogging({
      type: 'CONFIRMATION',
      to: payload.phoneE164,
      body: message,
      rethrowOnError: false,
    });

    const timestamp = result.attemptAt;
    if (typeof indexMap.confirmationSentAt === 'number') {
      sheet.getRange(rowNumber, indexMap.confirmationSentAt + 1).setValue(timestamp);
    }
    if (typeof indexMap.lastSmsSentAt === 'number') {
      sheet.getRange(rowNumber, indexMap.lastSmsSentAt + 1).setValue(timestamp);
    }
  }

  return {
    buildConfirmationMessage: buildConfirmationMessage,
    maybeSendConfirmation: maybeSendConfirmation,
  };
})();
