nightingale [![NPM version][npm-image]][npm-url] [![Build Status][build-status-image]][build-status-url] [![Coverage][coverage-image]][coverage-url]
==================

The nightingale is a bird best known for its powerful and beautiful song.

See the [auto-generated docs](http://christophehurpeau.github.io/nightingale/docs/)

### How to use


```js
var LoggerConsole = require('nightingale/console');
var logger = new LoggerConsole();
logger.setPrefix('[app] ');
logger.log('This is a log');
logger.warn('This is a warning !');
logger.write('test ' + logger.blue.bold('This is blue and bold')).write(' keep writing log').nl();
```

[npm-image]: https://img.shields.io/npm/v/nightingale.svg?style=flat-square
[npm-url]: https://npmjs.org/package/nightingale
[build-status-image]: https://img.shields.io/circleci/project/christophehurpeau/nightingale/master.svg?style=flat-square
[build-status-url]: https://circleci.com/gh/christophehurpeau/nightingale
[coverage-image]: http://img.shields.io/badge/coverage-90%-green.svg?style=flat
[coverage-url]: http://christophehurpeau.github.io/nightingale/coverage/lcov-report/
