/**
 * HttpHandlers.gs
 *
 * Main HTTP webhook handlers for RSVP form submissions.
 * These are the entry points called by Google Apps Script runtime.
 *
 * doPost - Handles RSVP form submissions
 * doGet - Health check endpoint
 * doOptions - CORS preflight handler
 */

/**
 * Handles POST requests from the RSVP web form.
 * This is the main webhook endpoint for RSVP submissions.
 *
 * Process:
 * 1. Parse and validate the payload
 * 2. Check honeypot for spam
 * 3. Find duplicate by phone number or create new entry
 * 4. Update/insert row in spreadsheet
 * 5. Send confirmation SMS
 *
 * @param {Object} e - The doPost event object from Apps Script
 * @return {GoogleAppsScript.Content.TextOutput} JSON response
 */
function doPost(e) {
  const path = HttpUtils.getRequestPath(e);
  if (path === '/rsvp/update') {
    return handleRsvpUpdate_(e);
  }
  if (path === '/rsvp' || path === '/') {
    return handleRsvpSubmission_(e);
  }
  return HttpUtils.jsonResponse(404, { ok: false, error: 'Not found' });
}

/**
 * Handles GET requests.
 * Used as a health check to verify the webhook is running.
 *
 * @return {GoogleAppsScript.Content.TextOutput} JSON response
 */
function doGet(e) {
  const path = HttpUtils.getRequestPath(e);
  if (path === '/rsvp') {
    return handleRsvpFetch_(e);
  }
  return HttpUtils.jsonResponse(200, {
    ok: true,
    message: 'RSVP webhook is running',
  });
}

/**
 * Handles OPTIONS requests for CORS preflight.
 *
 * @return {GoogleAppsScript.Content.TextOutput} Empty 204 response
 */
function doOptions() {
  return HttpUtils.jsonResponse(204, {});
}

function handleRsvpSubmission_(e) {
  let lock;
  let locked = false;
  try {
    const payload = Validation.parsePayload(e);
    Logger.log('Payload received: %s', JSON.stringify(payload));

    if (payload.honeypot) {
      Logger.log('Honeypot triggered, ignoring submission.');
      return HttpUtils.jsonResponse(200, { ok: true });
    }

    const sheet = SheetOperations.resolveSheet();
    lock = LockService.getScriptLock();
    lock.waitLock(30 * 1000);
    locked = true;

    const { rows, indexMap, columnCount } = SheetOperations.readSheet(sheet);
    const { duplicateRowIndex, existingRow } = SheetOperations.findDuplicateByPhone(
      rows,
      indexMap,
      payload.phoneE164
    );
    const isNewRow = duplicateRowIndex < 0;

    const newRowValues = SheetOperations.buildRowValues({
      payload: payload,
      indexMap: indexMap,
      existingRow: existingRow,
      columnCount: columnCount,
    });
    const tokenResult = RsvpAccessService.ensureRowToken(newRowValues, indexMap);

    const targetRowNumber = SheetOperations.upsertRow(sheet, duplicateRowIndex, newRowValues);

    ConfirmationService.maybeSendConfirmation({
      sheet: sheet,
      rowNumber: targetRowNumber,
      rowValues: newRowValues,
      indexMap: indexMap,
      payload: payload,
      existingRow: existingRow,
      isNewRow: isNewRow,
    });

    const token = tokenResult.token;
    const viewUrl = RsvpAccessService.buildViewUrl(token);
    return HttpUtils.jsonResponse(200, { ok: true, token: token, viewUrl: viewUrl });
  } catch (err) {
    const status = err?.statusCode || 500;
    Logger.log('Error: %s', err && err.stack ? err.stack : err);
    return HttpUtils.jsonResponse(status, {
      ok: false,
      error: err?.message || String(err),
    });
  } finally {
    if (lock && locked) {
      lock.releaseLock();
    }
  }
}

function handleRsvpFetch_(e) {
  try {
    const token = Validation.parseTokenQuery(e);
    const sheet = SheetOperations.resolveSheet();
    const { rows, indexMap } = SheetOperations.readSheet(sheet);
    const { row } = SheetOperations.findRowByToken(rows, indexMap, token);
    if (!row) {
      throw HttpUtils.createError(404, 'RSVP not found');
    }
    const response = RsvpAccessService.rowToResponse(row, indexMap);
    return HttpUtils.jsonResponse(200, { ok: true, rsvp: response });
  } catch (err) {
    const status = err?.statusCode || 500;
    Logger.log('Error fetching RSVP: %s', err && err.message ? err.message : err);
    return HttpUtils.jsonResponse(status, {
      ok: false,
      error: err?.message || String(err),
    });
  }
}

function handleRsvpUpdate_(e) {
  let lock;
  let locked = false;
  try {
    const payload = Validation.parseUpdatePayload(e);
    const sheet = SheetOperations.resolveSheet();
    lock = LockService.getScriptLock();
    lock.waitLock(30 * 1000);
    locked = true;

    const { rows, indexMap } = SheetOperations.readSheet(sheet);
    const { rowIndex, row } = SheetOperations.findRowByToken(rows, indexMap, payload.token);
    if (rowIndex < 0 || !row) {
      throw HttpUtils.createError(404, 'RSVP not found');
    }

    const rowValues = row.slice();
    const updateResult = RsvpAccessService.applyEditableUpdates({
      rowValues: rowValues,
      indexMap: indexMap,
      updates: payload,
    });

    const rowNumber = rowIndex + 2;
    sheet.getRange(rowNumber, 1, 1, updateResult.rowValues.length).setValues([updateResult.rowValues]);

    return HttpUtils.jsonResponse(200, {
      ok: true,
      updatedAt: updateResult.updatedAt ? updateResult.updatedAt.toISOString() : null,
      attendance: updateResult.attendance,
      partySize: updateResult.partySize,
    });
  } catch (err) {
    const status = err?.statusCode || 500;
    Logger.log('Error updating RSVP: %s', err && err.message ? err.message : err);
    return HttpUtils.jsonResponse(status, {
      ok: false,
      error: err?.message || String(err),
    });
  } finally {
    if (lock && locked) {
      lock.releaseLock();
    }
  }
}
