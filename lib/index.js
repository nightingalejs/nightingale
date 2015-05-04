"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.createConsoleTransport = createConsoleTransport;
exports.createLogger = createLogger;
exports.createPrefixedLogger = createPrefixedLogger;
Object.defineProperty(exports, "__esModule", {
    value: true
});
var winston = require("winston");

var levels = _interopRequire(require("./levels/levels"));

var colors = _interopRequire(require("./levels/colors"));

var formatter = _interopRequire(require("./formatter"));

winston.addColors(colors);

function createConsoleTransport() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    var transportOptions = {
        level: "trace",
        colorize: true,
        timestamp: function timestamp() {
            var d = new Date();
            var dayOfMonth = d.getDate();
            if (dayOfMonth < 10) {
                dayOfMonth = "0" + dayOfMonth;
            }
            return dayOfMonth + " " + d.toTimeString().split(" ")[0];
        },
        prettyPrint: true,
        formatter: formatter
    };
    for (var k in options) {
        transportOptions[k] = options;
    }

    return new winston.transports.Console(transportOptions);
}

var labelRewriter = function labelRewriter(msg, meta, level, logger) {
    var label = logger && logger.label;

    if (meta && meta.label) {
        label = meta.label;
        delete meta.label;
    }
    if (label) {
        msg = "[" + label + "] " + msg;
    }

    return { msg: msg, meta: meta };
};

function createLogger() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    if (!options.transports) {
        options.transports = [createConsoleTransport(options.consoleTransportOptions)];
    }

    options.levels = levels;

    var logger = new winston.Logger(options);

    logger.addFilter(labelRewriter.bind(logger));

    return logger;
}

Object.defineProperty(exports, "logger", {
    configurable: true,
    get: function get() {
        var logger = createLogger();
        Object.defineProperty(exports, "logger", {
            value: logger
        });
        return logger;
    }
});

function createPrefixedLogger(logger, prefix) {
    if (prefix == null) {
        prefix = logger;
        logger = exports.logger;
    }
    // can't do.
    return logger;
}
//# sourceMappingURL=index.js.map