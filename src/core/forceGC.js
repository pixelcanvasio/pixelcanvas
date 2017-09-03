/**
 * Created by arkeros on 5/5/17.
 */

import logger from './logger';


/**
 * https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/
 */
function forceGC() {
  if (global.gc) {
    global.gc();
    logger.info('GC');
  } else {
    logger.warn('Garbage collection unavailable. ' +
      'Pass --expose-gc when launching node to enable forced garbage ' +
      'collection.');
  }
}

export default forceGC;
