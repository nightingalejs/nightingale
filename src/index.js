/*#if NODE */
var util = require('util');
/*#/if */

/**
 * Abstract Logger
 *
 * @class
 */
export class Logger {
    constructor() {
        Object.getOwnPropertyNames(Logger.prototype).forEach((key) => {
            if (key === 'constructor') {
                return;
            }
            this[key] = Logger.prototype[key].bind(this);
        });
    }

    /**
     * Log a message
     *
     * @param {String} message
     * @param {String} logLevel
     * @return {Logger}
     */
    log(message, logLevel) {
        this.prefix(logLevel).write(message, logLevel).nl(logLevel);
    }

    /**
     * Add a new line
     *
     * @param {String} logLevel
     * @return {Logger}
     */
    nl(logLevel) {
        this.write("\n", logLevel);
        return this;
    }

    /**
     * Set the logger prefix
     *
     * @param {String} prefix
     * @return {Logger}
     */
    setPrefix(prefix, color) {
        if (!color) {
            color = this.gray;
        }
        this._prefix = color(prefix);
    }

    /**
     * Write the current prefix, if exists
     * @see setPrefix
     *
     * @param {String} logLevel
     * @return {Logger}
     */
    prefix(logLevel) {
        this.now(undefined, logLevel);
        if (this._prefix) {
            this.write(this._prefix, logLevel);
        }
        return this;
    }

    /**
     * Write the current time
     * @see setPrefix
     *
     * @param {Function} color
     * @return {Logger}
     */
    now(color, logLevel) {
        if (!color) {
            color = this.gray;
        }
        this.write(color.bold(new Date().toTimeString().split(' ')[0]
                                /*new Date().toFormat('HH24:MI:SS')*/)+' ', logLevel);
        return this;
    }

    /**
     * Log an info message
     *
     * @param {String} message
     * @return {Logger}
     */
    info(message) {
        return this.log('→ ' + message);
    }

    /**
     * Log an warn message
     *
     * @param {String} message
     * @return {Logger}
     */
    warn(message) {
        return this.log(this.yellow('⚠ ' + message));
    }

    /**
     * Log an error message
     *
     * @param {String|Error} message
     * @return {Logger}
     */
    error(message) {
        return this.log(this.red.bold('✖ ' + (message.stack || message.message || message)), 'error');
    }

    /**
     * Log an alert message
     *
     * @param {String} message
     * @return {Logger}
     */
    alert(message) {
        return this.log(this.red.bold('! ' + message));
    }

    /**
     * Log an fatal message
     *
     * @param {String} message
     * @return {Logger}
     */
    fatal(message) {
        return this.log(this.bgRed.white.bold('‼ ' + message), 'fatal');
    }

    /**
     * Log an debug message
     *
     * @param {String} message
     * @return {Logger}
     */
    debug(message) {
        return this.log(this.gray('• '+ message));
    }

    /**
     * Log an debug message
     *
     * @param {*} value
     * @return {Logger}
     */
    inspect(value) {
        value = util.inspect(value);
        return this.log(this.gray('• '+ value));
    }

    /**
     * Log an debugged var
     *
     * @param {String} message
     * @param {*} varValue
     * @return {Logger}
     */
    inspectVar(varName, varValue){
        varValue = util.inspect(varValue);
        return this.log(this.cyan('• ' + varName + ' = ' + varValue));
    }

    /**
     * Log an sucess message
     *
     * @param {String} message
     * @return {Logger}
     */
    success(message) {
        return this.log(this.green.bold('✔ ' + message));
    }

    /**
     * Stores current time in milliseconds
     * in the timers map
     *
     * @param {string} timer name
     */
    time(name) {
        if (name) {
            if (!this._timers) {
                this._timers = {};
            }
            this._timers[name] = Date.now();
        }
    }

    /**
    * Finds difference between when this method
    * was called and when the respective time method
    * was called, then logs out the difference
    * and deletes the original record
    *
    * @param {string} timer name
    */
    timeEnd( name ) {
        if (this._timers && this._timers[name]) {
            this.log(name + ': ' + (Date.now() - this._timers[name]) + 'ms');
            delete this._timers[name];
        }
    }
}

Logger._inject = (object) => {
    var injectStyle = (target, styleNames) => {
        'bold italic underline inverse strikethrough'.split(' ').forEach((styleName) => {
            var styleNames2 = styleNames.slice();
            styleNames2.push(styleName);
            target[styleName] = (message) => {
                return object.style(styleNames2, message);
            };
        });
    };
    injectStyle(object.prototype, []);

    var colors = 'black red green yellow blue magenta cyan white gray'.split(' ');
    var injectColor = (target, styleNames) => {
        colors.forEach((styleName) => {
            var styleNames2 = styleNames.slice();
            styleNames2.push(styleName);
            target[styleName] = (message) => {
                return object.style(styleNames2, message);
            };
        });
    };

    injectColor(object.prototype, []);
    colors.forEach((styleName) => {
        injectStyle(object.prototype[styleName], [styleName]);
    });

    'bgBlack bgRed bgGreen bgYellow bgBlue bgMagenta bgCyan bgWhite bgGray'.split(' ').forEach((styleName) => {
        object.prototype[styleName] = (message) => {
            return object.style([styleName], message);
        };
        injectColor(object.prototype[styleName], [styleName]);
        injectStyle(object.prototype[styleName], [styleName]);
        colors.forEach((styleNameColor) => {
            injectStyle(object.prototype[styleName][styleNameColor], [styleName, styleNameColor]);
        });
    });
};


// logger.black.bold('Hello');

//Logger.blue.bold('test');