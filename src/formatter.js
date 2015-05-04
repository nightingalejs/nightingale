    var winston = require('winston');
var util = require('util');
var colors = require('colors/safe');
import * as errorsParser from 'springbokjs-errors';
import levelToSymbol from './levels/symbols';
import levelToColors from './levels/colors';
colors.enabled = true;

var stylify = function(string, colorsArray) {
    if (!string || string.length === 0) {
        return string;
    }
    let colorizedString = string;
    for (let i = 0, l = colorsArray.length; i < l; ++i) {
        colorizedString = colors[colorsArray[i]](colorizedString);
    }
    return colorizedString;
};

export default function(params) {
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
    var output = timestamp ?  stylify(timestamp + ' ', ['gray'])  : '';
    output += stylify(levelToSymbol[params.level], levelToColors[params.level]);
    output += ' ';
    output += params.label ? ('[' + params.label + '] ') : '';
    output += stylify(params.message !== undefined ? params.message : '', levelToColors[params.level]);
    if (meta !== null && meta !== undefined) {
        if (meta && meta instanceof Error) {
            try {
                var parsedError = errorsParser.parse(meta);
                meta = parsedError.toString();
            } catch (err2) {
                meta = meta.stack;
            }
        }
        if (typeof meta !== 'object') {
            output += ' ' + meta;
        } else {
            var length = Object.keys(meta).length;
            if (length !== 0) {
                if (typeof params.prettyPrint === 'function') {
                    output += ' ' + params.prettyPrint(meta);
                } else if (params.prettyPrint) {
                    output += ' ' + ( length > 1 ? '\n' : '' ) +
                                util.inspect(meta, false, params.depth || null, false);
                } else {
                    output += ' ' + winston.config.serialize(meta);
                }
            }
        }
    }
    return output;
}
