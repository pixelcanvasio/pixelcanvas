/**
 * Created by arkeros on 24/5/17.
 * @flow
 */

import express from 'express';
import expressLimiter from 'express-limiter';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import cors from 'cors';

import redis from '../../data/redis';
import {
  MINUTE,
  SECOND,
  DAY,
  BLANK_COOLDOWN,
} from '../../core/constants';

import ban from './ban';
import bigchunk from './bigchunk';
import check from './check';
import me from './me';
import online from './online';
import pixel from './pixel';
import ws from './ws';


const router = express.Router();
const limiter = expressLimiter(router, redis);
router.use(bodyParser.json());
router.use(expressValidator());

function whitelist(req) {
  return req.user && req.user.isAdmin();
}


// TODO strikes
router.post('/pixel',
  limiter({
    lookup: 'headers.cf-connecting-ip',
    whitelist,
    total: Math.ceil((5 * MINUTE) / (BLANK_COOLDOWN - (2 * SECOND))) | 0,
    expire: 5 * MINUTE,
    skipHeaders: true,
  }),
  pixel,
);

router.get('/bigchunk/:x(-?[0-9]+).:y(-?[0-9]+).bmp', cors(), bigchunk);
router.post('/me', me);
router.get('/ws', ws);
router.get('/online', online);
router.get('/ban', ban);

router.get(
  '/check',
  // rate limit
  limiter({
    lookup: 'headers.cf-connecting-ip',
    whitelist,
    // 100 requests per day
    total: 100,
    expire: DAY,
  }),
  check,
);

export default router;
