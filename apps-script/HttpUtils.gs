/**
 * HttpUtils.gs
 *
 * HTTP utilities for request/response handling, JSON responses,
 * and error management.
 */

const HttpUtils = (function () {
  /**
   * Creates an HTTP error with a status code.
   *
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @return {Error} Error object with statusCode property
   */
  function createError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  }

  /**
   * Creates a JSON response with proper headers and status code.
   *
   * @param {number} status - HTTP status code
   * @param {Object} obj - Object to serialize as JSON
   * @return {GoogleAppsScript.Content.TextOutput} The response object
   */
  function jsonResponse(status, obj) {
    const output = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
      ContentService.MimeType.JSON
    );
    if (typeof output.setStatusCode === 'function') {
      output.setStatusCode(status);
    }
    if (typeof output.setHeader === 'function') {
      output.setHeader('Access-Control-Allow-Origin', '*');
      output.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    return output;
  }

  /**
   * Resolves the normalized request path from the event object.
   *
   * @param {Object} e - The doGet/doPost event
   * @return {string} Normalized path starting with /
   */
  function getRequestPath(e) {
    const rawPath = e && typeof e.pathInfo === 'string' ? e.pathInfo : '';
    let normalized = rawPath ? '/' + rawPath.replace(/^\/+/, '') : '/';
    normalized = normalized.replace(/\/+$/, '') || '/';

    if (normalized === '/' && e && e.parameter && e.parameter.action) {
      let action = e.parameter.action;
      if (Array.isArray(action)) {
        action = action[0];
      }
      if (action) {
        normalized = '/' + String(action).replace(/^\/+/, '').replace(/\/+$/, '');
      }
    }

    return normalized || '/';
  }

  return {
    createError: createError,
    jsonResponse: jsonResponse,
    getRequestPath: getRequestPath,
  };
})();
