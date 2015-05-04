import { createLogger } from '../lib';

var logger = createLogger({
    name: 'app'
});

logger.log('log()');
logger.info('info()');
logger.warn('warn()');
logger.error('error()');
logger.critical('critical()');
logger.fatal('fatal()');
logger.debug('debug()');
logger.debug('debug() var', { hello: 'world' });
logger.success('success()');
