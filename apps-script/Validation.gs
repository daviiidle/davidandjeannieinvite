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
    const body = parseJsonBody_(e);

    const firstName = StringUtils.sanitize(body.firstName);
    const lastName = StringUtils.sanitize(body.lastName);
    const householdName = StringUtils.sanitize(body.householdName);
    const phoneRaw = StringUtils.sanitize(body.phone);
    const email = StringUtils.sanitize(body.email);
    const language = StringUtils.sanitize(body.language || 'EN').toUpperCase();
    const attendance = StringUtils.sanitize(body.attendance).toUpperCase();
    const otherGuestNames = StringUtils.sanitize(
      body.otherGuestNames !== undefined ? body.otherGuestNames : body.additionalNames
    );
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

  /**
   * Parses payload for token-based updates.
   *
   * @param {Object} e - The doPost event object
   * @return {Object} Parsed token update payload
   */
  function parseUpdatePayload(e) {
    const body = parseJsonBody_(e);
    const token = StringUtils.sanitize(body.token);
    if (!token) {
      throw HttpUtils.createError(400, 'Token is required');
    }

    let attendanceProvided = false;
    let attendance = 'NO';
    if (Object.prototype.hasOwnProperty.call(body, 'attendance')) {
      const normalized = StringUtils.sanitize(body.attendance).toUpperCase();
      if (normalized) {
        if (normalized !== 'YES' && normalized !== 'NO') {
          throw HttpUtils.createError(400, 'Attendance must be YES or NO');
        }
        attendance = normalized;
        attendanceProvided = true;
      }
    }

    let partySizeProvided = false;
    let partySize = 0;
    if (Object.prototype.hasOwnProperty.call(body, 'partySize')) {
      const parsed = Number(body.partySize);
      if (!Number.isFinite(parsed) || parsed < 0) {
        throw HttpUtils.createError(400, 'Party size must be a non-negative number');
      }
      partySize = parsed;
      partySizeProvided = true;
    }

    const additionalProvided =
      Object.prototype.hasOwnProperty.call(body, 'additionalNames') ||
      Object.prototype.hasOwnProperty.call(body, 'otherGuestNames');
    const otherGuestNames = StringUtils.sanitize(
      Object.prototype.hasOwnProperty.call(body, 'additionalNames')
        ? body.additionalNames
        : body.otherGuestNames
    );

    const notesProvided = Object.prototype.hasOwnProperty.call(body, 'notes');
    const notes = StringUtils.sanitize(body.notes);
    const emailProvided = Object.prototype.hasOwnProperty.call(body, 'email');
    const email = StringUtils.sanitize(body.email);

    if (
      !attendanceProvided &&
      !partySizeProvided &&
      !additionalProvided &&
      !notesProvided &&
      !emailProvided
    ) {
      throw HttpUtils.createError(400, 'Provide at least one field to update');
    }

    return {
      token: token,
      attendance: attendance,
      attendanceProvided: attendanceProvided,
      partySize: partySize,
      partySizeProvided: partySizeProvided,
      otherGuestNames: otherGuestNames,
      otherGuestNamesProvided: additionalProvided,
      notes: notes,
      notesProvided: notesProvided,
      email: email,
      emailProvided: emailProvided,
    };
  }

  /**
   * Reads a token from a GET query string.
   *
   * @param {Object} e - doGet event
   * @return {string} Token
   */
  function parseTokenQuery(e) {
    const param =
      (e && e.parameter && e.parameter.token) ||
      (e && e.parameters && Array.isArray(e.parameters.token) ? e.parameters.token[0] : '');
    const token = StringUtils.sanitize(param);
    if (!token) {
      throw HttpUtils.createError(400, 'token query parameter is required');
    }
    return token;
  }

  function parseJsonBody_(e) {
    if (!e?.postData?.contents) {
      throw HttpUtils.createError(400, 'Missing JSON body');
    }
    let body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (err) {
      throw HttpUtils.createError(400, 'Request body must be valid JSON');
    }
    if (!body || typeof body !== 'object') {
      throw HttpUtils.createError(400, 'Request body must be a JSON object');
    }
    return body;
  }

  return {
    parsePayload: parsePayload,
    parseUpdatePayload: parseUpdatePayload,
    parseTokenQuery: parseTokenQuery,
  };
})();
