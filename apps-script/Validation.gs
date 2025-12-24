/**
 * Validation.gs
 *
 * Handles HTTP request payload parsing and validation.
 * Ensures all required fields are present and valid before processing.
 */

const Validation = (function () {
  /**
   * Parses and validates the RSVP payload from an HTTP POST request.
   *
   * @param {Object} e - The doPost event object
   * @return {Object} Validated payload object
   * @throws {Error} If validation fails (400 status)
   */
  function parsePayload(e) {
    if (!e?.postData?.contents) {
      throw HttpUtils.createError(400, 'Missing JSON body');
    }

    let body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (err) {
      throw HttpUtils.createError(400, 'Request body must be valid JSON');
    }

    const firstName = StringUtils.sanitize(body.firstName);
    const lastName = StringUtils.sanitize(body.lastName);
    const householdName = StringUtils.sanitize(body.householdName);
    const phoneRaw = StringUtils.sanitize(body.phone);
    const email = StringUtils.sanitize(body.email);
    const language = StringUtils.sanitize(body.language || 'EN').toUpperCase();
    const attendance = StringUtils.sanitize(body.attendance).toUpperCase();
    const otherGuestNames = StringUtils.sanitize(body.otherGuestNames);
    const notes = StringUtils.sanitize(body.notes);
    const honeypot = StringUtils.sanitize(body.honeypot);

    if (!firstName || !phoneRaw || !attendance) {
      throw HttpUtils.createError(400, 'Missing required fields: firstName, phone, attendance');
    }

    if (attendance !== 'YES' && attendance !== 'NO') {
      throw HttpUtils.createError(400, 'Attendance must be YES or NO');
    }

    const partySize = attendance === 'YES' ? Number(body.partySize ?? 0) : 0;
    if (attendance === 'YES' && (!Number.isFinite(partySize) || partySize < 0)) {
      throw HttpUtils.createError(400, 'Party size must be a positive number');
    }

    const phoneE164 = PhoneUtils.toE164AU(phoneRaw);
    if (!phoneE164) {
      throw HttpUtils.createError(400, 'Invalid phone number');
    }

    return {
      firstName: firstName,
      lastName: lastName,
      householdName: householdName,
      phoneRaw: phoneRaw,
      phoneE164: phoneE164,
      email: email,
      language: language,
      attendance: attendance,
      partySize: partySize,
      otherGuestNames: otherGuestNames,
      notes: notes,
      honeypot: honeypot,
    };
  }

  return {
    parsePayload: parsePayload,
  };
})();
