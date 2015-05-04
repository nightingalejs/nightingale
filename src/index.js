var winston = require('winston');
import levels from './levels/levels';
import colors from './levels/colors';
import formatter from './formatter';

winston.addColors(colors);

export function createConsoleTransport(options = {}) {
    var transportOptions = {
        level: 'trace',
        colorize: true,
        timestamp: function() {
            var d = new Date();
            var dayOfMonth = d.getDate();
            if (dayOfMonth < 10) {
                dayOfMonth = '0' + dayOfMonth;
            }
            return dayOfMonth + ' ' + d.toTimeString().split(' ')[0];
        },
        prettyPrint: true,
        formatter: formatter
    };
    for (let k in options) {
        transportOptions[k] = options;
    }

    return new winston.transports.Console(transportOptions);
}

var labelRewriter = function(msg, meta, level, logger) {
    let label = logger && logger.label;

    if (meta && meta.label) {
        label = meta.label;
        delete meta.label;
    }
    if (label) {
        msg = '[' + label + '] ' + msg;
    }

    return { msg, meta };
};


export function createLogger(options = {}) {
    if (!options.transports) {
        options.transports = [
            createConsoleTransport(options.consoleTransportOptions)
        ];
    }

    options.levels = levels;

    var logger = new winston.Logger(options);

    logger.addFilter(labelRewriter.bind(logger));

    return logger;
}


Object.defineProperty(exports, 'logger', {
    configurable: true,
    get: function() {
        let logger = createLogger();
        Object.defineProperty(exports, 'logger', {
            value: logger
        });
        return logger;
    }
});

export function createPrefixedLogger(logger, prefix) {
    if (prefix == null) {
        prefix = logger;
        logger = exports.logger;
    }
    // can't do.
    return logger;
}
