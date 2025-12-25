/**
 * RsvpAccessService.gs
 *
 * Handles token generation, token-backed lookups, and mapping sheet rows
 * to public-safe RSVP payloads for the View/Edit experience.
 */

const RsvpAccessService = (function () {
  /**
   * Ensures the provided row has a secure token value.
   *
   * @param {Array} rowValues - Row values to mutate
   * @param {Object} indexMap - Column index mapping
   * @return {Object} Object with token and whether it was newly created
   */
  function ensureRowToken(rowValues, indexMap) {
    if (!rowValues || typeof indexMap.token !== 'number') {
      return { token: '', changed: false };
    }
    let token = StringUtils.sanitize(rowValues[indexMap.token]);
    if (token) {
      return { token: token, changed: false };
    }
    token = generateToken();
    rowValues[indexMap.token] = token;
    if (typeof indexMap.tokenUpdatedAt === 'number') {
      rowValues[indexMap.tokenUpdatedAt] = new Date();
    }
    return { token: token, changed: true };
  }

  /**
   * Generates a web-safe token string.
   *
   * @return {string} Token
   */
  function generateToken() {
    const byteLength = Number(TOKEN_BYTE_LENGTH || 24);
    let token = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    for (let i = 0; i < Math.max(32, byteLength); i++) {
      const index = Math.floor(Math.random() * alphabet.length);
      token += alphabet.charAt(index);
    }
    return token;
  }

  /**
   * Builds the public View/Edit URL for a token.
   *
   * @param {string} token - Token value
   * @return {string} View/Edit URL
   */
  function buildViewUrl(token) {
    if (!token) return '';
    const base = (BASE_SITE_URL || '').replace(/\/+$/, '');
    const path = '/r/' + token;
    return base ? base + path : path;
  }

  /**
   * Converts a sheet row to a JSON-safe RSVP payload.
   *
   * @param {Array} rowValues - Row values
   * @param {Object} indexMap - Column indexes
   * @return {Object|null} RSVP payload or null
   */
  function rowToResponse(rowValues, indexMap) {
    if (!rowValues || !indexMap) {
      return null;
    }
    const attendance =
      typeof indexMap.attendance === 'number'
        ? (StringUtils.sanitize(rowValues[indexMap.attendance]) || 'NO').toUpperCase()
        : 'NO';
    const partySize =
      typeof indexMap.partySize === 'number' ? Number(rowValues[indexMap.partySize]) || 0 : 0;
    const token =
      typeof indexMap.token === 'number' ? StringUtils.sanitize(rowValues[indexMap.token]) : '';
    return {
      householdName:
        typeof indexMap.householdName === 'number'
          ? String(rowValues[indexMap.householdName] || '')
          : '',
      firstName:
        typeof indexMap.firstName === 'number' ? String(rowValues[indexMap.firstName] || '') : '',
      lastName:
        typeof indexMap.lastName === 'number' ? String(rowValues[indexMap.lastName] || '') : '',
      phone: typeof indexMap.phone === 'number' ? String(rowValues[indexMap.phone] || '') : '',
      phoneE164:
        typeof indexMap.phoneE164 === 'number'
          ? String(rowValues[indexMap.phoneE164] || '')
          : '',
      email: typeof indexMap.email === 'number' ? String(rowValues[indexMap.email] || '') : '',
      language:
        typeof indexMap.language === 'number'
          ? getLanguageCode_(rowValues[indexMap.language])
          : 'EN',
      attendance: attendance,
      partySize: attendance === 'YES' ? partySize : 0,
      otherGuestNames:
        typeof indexMap.otherGuestNames === 'number'
          ? String(rowValues[indexMap.otherGuestNames] || '')
          : '',
      notes: typeof indexMap.notes === 'number' ? String(rowValues[indexMap.notes] || '') : '',
      updatedAt:
        typeof indexMap.updatedAt === 'number'
          ? formatDateValue(rowValues[indexMap.updatedAt])
          : null,
      createdAt:
        typeof indexMap.timestamp === 'number'
          ? formatDateValue(rowValues[indexMap.timestamp])
          : null,
      lastSmsSentAt:
        typeof indexMap.lastSmsSentAt === 'number'
          ? formatDateValue(rowValues[indexMap.lastSmsSentAt])
          : null,
      editCount:
        typeof indexMap.editCount === 'number' ? Number(rowValues[indexMap.editCount]) || 0 : 0,
      token: token,
      viewUrl: buildViewUrl(token),
    };
  }

  /**
   * Applies editable fields for a token-based update.
   *
   * @param {Object} options - Update options
   * @param {Array} options.rowValues - Row values to update
   * @param {Object} options.indexMap - Column indexes
   * @param {Object} options.updates - Parsed updates with provided flags
   * @return {Object} Result containing rowValues, attendance, partySize, updatedAt
   */
  function applyEditableUpdates({ rowValues, indexMap, updates }) {
    if (!rowValues || !indexMap) {
      throw HttpUtils.createError(500, 'Missing row context for update.');
    }
    const now = new Date();
    let attendanceValue = 'NO';
    if (typeof indexMap.attendance === 'number') {
      if (updates.attendanceProvided) {
        rowValues[indexMap.attendance] = updates.attendance;
      }
      attendanceValue =
        (StringUtils.sanitize(rowValues[indexMap.attendance]) || 'NO').toUpperCase() === 'YES'
          ? 'YES'
          : 'NO';
    }
    let partySize = 0;
    if (typeof indexMap.partySize === 'number') {
      partySize = Number(rowValues[indexMap.partySize]) || 0;
      if (updates.partySizeProvided) {
        partySize = updates.partySize;
      }
      if (attendanceValue !== 'YES') {
        partySize = 0;
      }
      rowValues[indexMap.partySize] = partySize;
    }

    if (updates.otherGuestNamesProvided && typeof indexMap.otherGuestNames === 'number') {
      rowValues[indexMap.otherGuestNames] = updates.otherGuestNames;
    }
    if (updates.notesProvided && typeof indexMap.notes === 'number') {
      rowValues[indexMap.notes] = updates.notes;
    }
    if (updates.emailProvided && typeof indexMap.email === 'number') {
      rowValues[indexMap.email] = updates.email;
    }

    if (typeof indexMap.updatedAt === 'number') {
      rowValues[indexMap.updatedAt] = now;
    }

    if (typeof indexMap.editCount === 'number') {
      const previous = Number(rowValues[indexMap.editCount]) || 0;
      rowValues[indexMap.editCount] = previous + 1;
    }

    return {
      rowValues: rowValues,
      attendance: attendanceValue,
      partySize: partySize,
      updatedAt: now,
    };
  }

  function formatDateValue(value) {
    const date = StringUtils.valueToDate(value);
    return date ? date.toISOString() : null;
  }

  return {
    ensureRowToken: ensureRowToken,
    buildViewUrl: buildViewUrl,
    rowToResponse: rowToResponse,
    applyEditableUpdates: applyEditableUpdates,
  };
})();
