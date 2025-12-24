/**
 * SmsService.gs
 *
 * Core SMS service using Twilio API.
 * Handles sending SMS messages and logging to the outbox.
 * Supports both live and dry-run modes.
 */

const SmsService = (function () {
  /**
   * Gets script properties for configuration.
   *
   * @return {Object} Script properties
   */
  function getScriptProperties() {
    return PropertiesService.getScriptProperties().getProperties();
  }

  /**
   * Sends an SMS message via Twilio API or dry-run mode.
   *
   * @param {string} to - Recipient phone number (E.164 format)
   * @param {string} body - SMS message body
   * @return {Object} Result with ok, dryRun, and optionally sid
   * @throws {Error} If SMS sending fails
   */
  function sendSms(to, body) {
    const toNumber = StringUtils.sanitize(to);
    if (!toNumber) {
      throw new Error('Missing SMS recipient.');
    }
    if (!body) {
      throw new Error('Missing SMS body.');
    }

    const props = getScriptProperties();
    const mode = (props.SMS_MODE || 'DRY_RUN').toUpperCase();
    const isLive = mode === 'LIVE';

    if (!isLive) {
      Logger.log('DRY_RUN SMS -> %s: %s', toNumber, body);
      return { ok: true, dryRun: true };
    }

    const accountSid = StringUtils.sanitize(props.TWILIO_ACCOUNT_SID);
    const authToken = StringUtils.sanitize(props.TWILIO_AUTH_TOKEN);
    const fromNumber = StringUtils.sanitize(props.TWILIO_FROM_NUMBER);

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

    return { ok: true, dryRun: false, sid: sid };
  }

  /**
   * Sends an SMS and logs the result to the outbox.
   *
   * @param {Object} options - Send options
   * @param {string} options.type - Message type (REMINDER, CONFIRMATION, TEST)
   * @param {string} options.to - Recipient phone number
   * @param {string} options.body - SMS message body
   * @param {boolean} options.rethrowOnError - Whether to rethrow errors
   * @return {Object} Result with attemptAt, status, and optionally sid or error
   */
  function sendSmsWithLogging({ type, to, body, rethrowOnError }) {
    const attemptAt = new Date();
    let status = 'SENT';
    let sid = '';
    let errorMessage = '';
    try {
      const result = sendSms(to, body);
      status = result.dryRun ? 'DRY_RUN' : 'SENT';
      sid = result.sid || '';
      return { attemptAt: attemptAt, status: status, sid: sid };
    } catch (err) {
      status = 'FAILED';
      errorMessage = err?.message || String(err);
      if (rethrowOnError) {
        throw err;
      }
      return { attemptAt: attemptAt, status: status, error: errorMessage };
    } finally {
      OutboxLogger.logEntry({
        timestamp: attemptAt,
        type: type,
        to: to,
        body: body,
        status: status,
        error: errorMessage,
        sid: sid,
      });
    }
  }

  /**
   * Test function to send an SMS to a configured test number.
   *
   * @return {Object} Send result
   * @throws {Error} If test number not configured
   */
  function testSendSmsToMe() {
    const props = getScriptProperties();
    const to = StringUtils.sanitize(props.TWILIO_TEST_TO);
    if (!to) {
      throw new Error('Set TWILIO_TEST_TO script property before running testSendSmsToMe.');
    }

    const result = sendSmsWithLogging({
      type: 'TEST',
      to: to,
      body: 'RSVP SMS test message.',
      rethrowOnError: true,
    });

    Logger.log('Test SMS dispatched at %s with status %s', result.attemptAt, result.status);
    return result;
  }

  return {
    sendSmsWithLogging: sendSmsWithLogging,
    testSendSmsToMe: testSendSmsToMe,
    getScriptProperties: getScriptProperties,
  };
})();
