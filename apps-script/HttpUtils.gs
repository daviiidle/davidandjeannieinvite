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

  return {
    createError: createError,
    jsonResponse: jsonResponse,
  };
})();
