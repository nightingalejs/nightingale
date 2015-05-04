springbokjs-logger [![NPM version][npm-image]][npm-url] [![Drone.io Status][droneio-image]][droneio-url] [![Test coverage][coveralls-image]][coveralls-url]
==================

See the [auto-generated docs](http://christophehurpeau.github.io/springbokjs-logger/docs/)

### How to use


```js
import { createLogger } from 'springbokjs-logger';
var logger = createLogger();
logger.info('This is an info');
logger.warn('This is a warning !');
logger.debug('debug var :', { var: myvar });
logger.error('catched error ', err);
```

[npm-image]: https://img.shields.io/npm/v/springbokjs-logger.svg?style=flat
[npm-url]: https://npmjs.org/package/springbokjs-logger
[droneio-image]: https://drone.io/github.com/christophehurpeau/springbokjs-logger/status.png
[droneio-url]: https://drone.io/github.com/christophehurpeau/springbokjs-logger/latest
[coveralls-image]: https://img.shields.io/coveralls/christophehurpeau/springbokjs-logger.svg?style=flat
[coveralls-url]: https://coveralls.io/r/christophehurpeau/springbokjs-logger?branch=master
