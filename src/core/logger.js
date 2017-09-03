/**
 * Created by arkeros on 9/7/17.
 *
 * http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
 *
 * @flow
 */

import winston from 'winston';


const logger = winston;

export const pixelLogger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './pixels.log',
      json: true,
      maxsize: 2 * 52428800, // 100MB
      colorize: false,
    }),
  ],
});

export const proxyLogger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './proxies.log',
      json: true,
      maxsize: 2 * 52428800, // 100MB
      colorize: false,
    }),
  ],
});


export default logger;
