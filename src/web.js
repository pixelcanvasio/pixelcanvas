/* @flow */

import 'newrelic';
import fetch from 'isomorphic-fetch';
import path from 'path';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import React from 'react';
import ReactDOM from 'react-dom/server';
import expressValidator from 'express-validator';


import baseCss from './components/base.css';
import forceGC from './core/forceGC';
import Html from './components/Html';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import logger from './core/logger';
import session from './core/session';
import passport from './core/passport';
import models from './data/models';
import liana from './data/liana';

import { api, auth } from './routes';
import { SECOND, HOUR } from './core/constants';
import {
  PORT,
  CANVAS_MIN_X,
  CANVAS_MIN_Y,
  CANVAS_MAX_X,
  CANVAS_MAX_Y,
} from './config';


const app = express();

const appLogger = morgan(
  (__DEV__) ? 'dev' : ':req[cf-connecting-ip] ' +
  '":method :url HTTP/:http-version" :status :res[content-length] ' +
  '":referrer" ":user-agent"',
  {
    stream: {
      write(message: string, encoding) {
        logger.info(message.trim());
      },
    },
  },
);
app.use(appLogger); // log every request to console

const server = http.createServer(app);
if (__DEV__) {
  app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: HOUR,
  }));
}

app.use(session);
app.use(expressValidator());


//
// Auth
// -----------------------------------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());
app.use('/login', auth(passport));


// Call Garbage Collector every 30 seconds
setInterval(forceGC, 30 * SECOND);

//
// API
// -----------------------------------------------------------------------------
app.use('/api', api);


//
// Setup the Forest Liana middleware in your app.js file
// -----------------------------------------------------------------------------
app.use(liana);


//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
const data = {
  title: 'PixelCanvas.io',
  description: 'Place color pixels on an infinite canvas ' +
  'with other players online',
  styles: [
    { id: 'css', cssText: baseCss },
  ],
  scripts: [
    assets.vendor.js,
    assets.client.js,
  ],
  code: '',
};
const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
const index = `<!doctype html>${html}`;

// data.children = ReactDOM.renderToString(<App context={context}>{route.component}</App>);
app.get('/(@:x(-?[0-9]+),:y(-?[0-9]+))?', async (req, res, next) => {
  req.checkParams('x', '%0 is not an integer')
    .optional()
    .isInt({ min: CANVAS_MIN_X, max: CANVAS_MAX_X });
  req.checkParams('y', '%0 is not an integer')
    .optional()
    .isInt({ min: CANVAS_MIN_Y, max: CANVAS_MAX_Y });

  const validationResult = await req.getValidationResult();
  if (!validationResult.isEmpty()) {
    res.status(403).send('OUT OF CANVAS LIMITS');
    return;
  }

  res.set({
    'Cache-Control': `public, max-age=${30 * 24 * 60 * 60}`, // seconds
  });
  res.send(index);
});

// ip config
const promise = models.sync().catch(err => logger.error(err.stack));
promise.then(() => {
  server.listen(PORT, () => {
    const address = server.address();
    logger.log('info', `web is running at http://localhost:${address.port}/`);
  });
});
