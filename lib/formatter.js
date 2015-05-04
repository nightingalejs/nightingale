"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var winston = require("winston");
var util = require("util");
var colors = require("colors/safe");

var errorsParser = _interopRequireWildcard(require("springbokjs-errors"));

var levelToSymbol = _interopRequire(require("./levels/symbols"));

var levelToColors = _interopRequire(require("./levels/colors"));

colors.enabled = true;

var stylify = function stylify(string, colorsArray) {
    if (!string || string.length === 0) {
        return string;
    }
    var colorizedString = string;
    for (var i = 0, l = colorsArray.length; i < l; ++i) {
        colorizedString = colors[colorsArray[i]](colorizedString);
    }
    return colorizedString;
};

module.exports = function (params) {
    var timestamp = params.timestamp();
    var meta = params.meta;
    var styles;
    if (meta) {
        if (meta.label) {
            params.label = meta.label;
            delete meta.label;
        }
        if (meta.styles) {
            if (Array.isArray(meta.styles)) {
                styles = {
                    msg: meta.styles
                };
            } else {
                styles = meta.styles;
            }
            delete meta.styles;
        }
    }
    var output = timestamp ? stylify(timestamp + " ", ["gray"]) : "";
    output += stylify(levelToSymbol[params.level], levelToColors[params.level]);
    output += " ";
    output += params.label ? "[" + params.label + "] " : "";
    output += stylify(params.message !== undefined ? params.message : "", levelToColors[params.level]);
    if (meta !== null && meta !== undefined) {
        if (meta && meta instanceof Error) {
            try {
                var parsedError = errorsParser.parse(meta);
                meta = parsedError.toString();
            } catch (err2) {
                meta = meta.stack;
            }
        }
        if (typeof meta !== "object") {
            output += " " + meta;
        } else {
            var length = Object.keys(meta).length;
            if (length !== 0) {
                if (typeof params.prettyPrint === "function") {
                    output += " " + params.prettyPrint(meta);
                } else if (params.prettyPrint) {
                    output += " " + (length > 1 ? "\n" : "") + util.inspect(meta, false, params.depth || null, false);
                } else {
                    output += " " + winston.config.serialize(meta);
                }
            }
        }
    }
    return output;
};
//# sourceMappingURL=formatter.js.map