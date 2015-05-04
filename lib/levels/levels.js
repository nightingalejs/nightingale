"use strict";

var levels = {
    /** @type {Number} Trace information */
    trace: 10,
    /** @type {Number} Detailed debug information */
    debug: 100,
    /** @type {Number} Normal but significant events */
    info: 200,
    /** @type {Number} Success events, info level */
    success: 200,
    /** @type {Number} Exceptional occurrences that are not errors (Use of deprecated APIs) */
    warn: 300,
    /** @type {Number} Runtime errors that do not require immediate action but should be logged and monitored */
    error: 400,
    /** @type {Number} Critical conditions. Example: Application component unavailable, unexpected exception */
    critical: 500,
    /** @type {Number} Action must be taken immediately. Example: Entire website down, database unavailable, etc
      *                 This should trigger the SMS alerts and wake you up */
    fatal: 550,
    /** @type {Number} Emergency: system is unusable */
    emergency: 600
};

module.exports = levels;
//# sourceMappingURL=levels.js.map