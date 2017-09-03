/**
 * Created by arkeros
 *
 * @flow
 */

import type { Request, Response } from 'express';
import url from 'url';
import nodeIp from 'ip';

import draw, { drawRect } from '../../core/draw';
import { getIPFromProxiedRequest, isHosting } from '../../utils/ip';
import isProxy from '../../core/isProxy';
import getFingerprint from '../../utils/fingerprint';
import { verifyCaptcha } from '../../utils/recaptcha';
import logger, { pixelLogger, proxyLogger } from '../../core/logger';
import { clamp } from '../../core/utils';
import redis from '../../data/redis';
import {
  Human,
  User,
} from '../../data/models';
import {
  CANVAS_MIN_X,
  CANVAS_MIN_Y,
  CANVAS_MAX_X,
  CANVAS_MAX_Y,
} from '../../config';


async function validate(req: Request, res: Response, next) {
  req.checkBody('x', 'x out of limits')
    .notEmpty()
    .isInt({ min: CANVAS_MIN_X, max: CANVAS_MAX_X });
  req.checkBody('y', 'y out of limits')
    .notEmpty()
    .isInt({ min: CANVAS_MIN_Y, max: CANVAS_MAX_Y });
  // TODO do not hardcode 15
  req.checkBody('color', 'color not valid')
    .notEmpty()
    .isInt({ min: 0, max: 15 });
  // TODO more validation on fingerprint, like characters and so
  req.checkBody('fingerprint', 'fingerprint not valid')
    .notEmpty()
    .isLength({ min: 32, max: 32 });

  // TODO sanitize
  req.sanitizeBody('x').toInt();
  req.sanitizeBody('y').toInt();
  req.sanitizeBody('color').toInt();

  const validationResult = await req.getValidationResult();
  if (!validationResult.isEmpty()) {
    res.status(400).json({ errors: validationResult.array() });
    return;
  }

  next();
}


async function getIp(req: Request, res: Response, next) {
  const ip = await getIPFromProxiedRequest(req);
  req.trueIp = ip ? ip : '0.0.0.1';
  req.fingerprint = getFingerprint(req);
  next();
}


const TTL_CACHE = 2 * 24 * 3600; // seconds
async function checkHuman(req: Request, res: Response, next) {
  try {
    const { trueIp: ip, fingerprint } = req;
    const { token } = req.body;
    const numIp = nodeIp.toLong(ip);

    const key = `human:${ip}:${fingerprint}`;

    const ttl: number = await redis.ttlAsync(key);
    if (ttl > 0) {
      next();
      return;
    }

    isProxy(ip);
    const human = await Human.findOne({ where: { numIp, fingerprint } });

    if (!human) {
      if (!token || !await verifyCaptcha(token, ip)) {
        res.status(422)
          .json({ errors: [{ msg: 'You must provide a token' }] });
        return;
      }

      // valid captcha!
      await Human.create({ numIp, fingerprint });
    }

    // save to cache
    await redis.setAsync(key, 'y', 'EX', TTL_CACHE);
  } catch (error) {
    logger.error('checkHuman', error);
  }

  next();
}

async function checkProxy(req: Request, res: Response, next) {
  const { trueIp: ip, headers } = req;

  if (!ip || isHosting(ip) || await isProxy(ip)) {
    if (ip) proxyLogger.info({ ip, headers });
    res.status(403)
      .json({ errors: [{ msg: 'You are using a proxy!!!11!one' }] });
    return;
  }

  next();
}


async function place(req: Request, res: Response) {
  // https://stackoverflow.com/questions/49547/how-to-control-web-page-caching-across-all-browsers
  // https://stackoverflow.com/a/7066740
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  });

  const { x, y, color, token } = req.body;
  const { trueIp: ip, fingerprint, headers } = req;

  const isHashed = parseInt(req.body.a, 10) === (x + y + 8);

  if (Object.keys(req.body).length !== 6 || !isHashed) {
    if (ip) proxyLogger.info({ ip, headers });
    res.status(401)
      .json({
        errors: [
          { msg: 'You are using an old version. Please, refresh the page to get the newest version.' },
        ],
      });
    return;
  }

  logger.info(`Client ${ip} wants to place ${color} in (${x}, ${y})`);

  const user = req.user || new User(`ip:${ip}`);
  user.ip = ip;
  user.fingerprint = fingerprint;

  // TODO reactivate
  // if (!(await user.isValidFingerprint())) {
  //   console.error('FINGERPRINT not linked!', ip, req.headers);
  //   res.status(403).json({ errors: [{ msg: 'You are using a proxy!!!11!' }] });
  //   return;
  // }

  // if (!headers.cookie) {
  //   // shadow ban
  //   await shadowDraw(user, x, y, color);
  //   const waitSeconds = user.getWaitSeconds();
  //   res.json({ success: true, waitSeconds });
  //   return;
  // }

  // draw
  // TODO strikes
  if (!__DEV__ && user.isAdmin()) {
    // if (color === 0) {
    const location = url.parse(req.get('Referrer'), true);
    const isBig = ('r' in location.query);
    if (isBig) {
      const r = parseInt(location.query.r, 10);
      const radius = clamp(r, 0, 32);
      const size = (2 * radius) + 1;
      drawRect(user, x - radius, y - radius, size, size, color);
      return;
    }
  }
  const success = await draw(user, x, y, color, token);
  logger.log('debug', success);
  const waitSeconds = user.getWaitSeconds();

  if (success) {
    pixelLogger.info({ x, y, color, ip, fingerprint, headers });
    res.json({ success, waitSeconds });
  } else {
    const errors = [];
    res.status(400);

    if (waitSeconds) {
      errors.push({ msg: 'You must wait' });
    } else if (!token) {
      res.status(422);
      errors.push({ msg: 'You must provide a token' });
    }
    res.json({ success, waitSeconds, errors });
  }
}


export default [validate, getIp, checkHuman, checkProxy, place];
