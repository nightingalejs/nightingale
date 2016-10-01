'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = configure;
exports.addConfig = addConfig;
exports.addGlobalProcessor = addGlobalProcessor;
exports.addGlobalHandler = addGlobalHandler;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _minimatch = require('minimatch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Config = _tcombForked2.default.interface({
  pattern: _tcombForked2.default.maybe(_tcombForked2.default.String),
  patterns: _tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.String)),
  handler: _tcombForked2.default.maybe(_tcombForked2.default.Object),
  handlers: _tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.Object))
}, 'Config');

if (!global.__NIGHTINGALE_CONFIG) {
  global.__NIGHTINGALE_CONFIG = [];
  global.__NIGHTINGALE_GLOBAL_PROCESSORS = [];
  global.__NIGHTINGALE_GLOBAL_HANDLERS = [];
  global.__NIGHTINGALE_LOGGER_MAP_CACHE = new Map();
  global.__NIGHTINGALE_CONFIG_DEFAULT = {
    handlers: [],
    processors: []
  };
}

function clearCache() {
  global.__NIGHTINGALE_LOGGER_MAP_CACHE.clear();
}

function handleConfig(config) {
  _assert(config, Config, 'config');

  if (config.key) {
    if (config.patterns) {
      throw new Error('Cannot have key and patterns for the same config');
    }
    config.patterns = [config.key];
    delete config.key;
  }

  if (config.pattern) {
    if (config.patterns) {
      throw new Error('Cannot have pattern and patterns for the same config');
    }
    config.patterns = [config.pattern];
    delete config.pattern;
  }

  if (config.handler) {
    if (config.handlers) {
      throw new Error('Cannot have handler and handlers for the same config');
    }
    config.handlers = [config.handler];
    delete config.handler;
  }

  if (config.patterns) {
    config.minimatchPatterns = config.patterns.map(pattern => new _minimatch.Minimatch(pattern));
  }

  return config;
}

function configure(config) {
  if (global.__NIGHTINGALE_CONFIG.length !== 0) {
    // eslint-disable-next-line no-console
    console.log('nightingale: warning: config overridden');
  }

  clearCache();
  global.__NIGHTINGALE_CONFIG = [];
  global.__NIGHTINGALE_CONFIG_DEFAULT = null;

  config.reverse().forEach(config => {
    config = handleConfig(config);

    if (config.patterns) {
      global.__NIGHTINGALE_CONFIG.push(config);
    } else {
      if (global.__NIGHTINGALE_CONFIG_DEFAULT) {
        throw new Error('Config cannot contains more than 1 default declaration');
      }

      global.__NIGHTINGALE_CONFIG_DEFAULT = config;
    }
  });

  if (!global.__NIGHTINGALE_CONFIG_DEFAULT) {
    global.__NIGHTINGALE_CONFIG_DEFAULT = {
      handlers: [],
      processors: []
    };
  }
}

function addConfig(config) {
  let unshift = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  _assert(config, Config, 'config');

  config = handleConfig(config);

  if (!config.patterns) {
    throw new Error('Config must have `pattern` or `patterns`');
  }

  clearCache();
  global.__NIGHTINGALE_CONFIG[unshift ? 'unshift' : 'push'](config);
}

function addGlobalProcessor(processor) {
  clearCache();
  global.__NIGHTINGALE_GLOBAL_PROCESSORS.push(processor);
}

function addGlobalHandler(handler) {
  clearCache();
  global.__NIGHTINGALE_GLOBAL_HANDLERS.push(handler);
}

global.__NIGHTINGALE_GET_CONFIG_FOR_LOGGER = function (key) {
  const globalProcessors = global.__NIGHTINGALE_GLOBAL_PROCESSORS;
  const globalHandlers = global.__NIGHTINGALE_GLOBAL_HANDLERS;
  const globalCache = global.__NIGHTINGALE_LOGGER_MAP_CACHE;

  if (globalCache.has(key)) {
    return globalCache.get(key);
  }

  let value = global.__NIGHTINGALE_CONFIG.find(c => c.minimatchPatterns.some(p => p.match(key)));
  if (!value) {
    value = global.__NIGHTINGALE_CONFIG_DEFAULT;
  }

  let loggerConfig = {
    patterns: value.patterns,
    handlers: value.handlers ? globalHandlers.concat(value.handlers) : globalHandlers,
    processors: value.processors ? globalProcessors.concat(value.processors) : globalProcessors
  };

  globalCache.set(key, loggerConfig);
  return loggerConfig;
};

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=config.js.map