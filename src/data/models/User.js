/* @flow */

import redis from '../redis';
import { getRegionOfIP } from '../../utils/location';
import { centers } from '../../core/regions';
import { randomDice } from '../../utils/random';
import { verifyCaptcha } from '../../utils/recaptcha';
import logger from '../../core/logger';
import RedisCanvas from './RedisCanvas';
import { BLANK_COOLDOWN } from '../../core/constants';


const GRACE_PERIOD = 20 * 60;
const FLAG_TTL = 7 * 3600;
const RECAPTCHA_TTL = 48 * 3600; // seconds

const CAPTCHA_PROB = 0.05;

const DATE_FIRST_PIXEL = new Date(2017, 7, 12);

const ADMINS = new Set([
  // TODO fetch from environment
  'facebook:your id on fb',
  'facebook:another id on fb',
  'ip:your static ip???',
]);

class User {
  id: string;
  ip: string;
  fingerprint: string;
  name: ?string;
  center: ?Cell;
  wait: ?number;  // TODO date

  constructor(id: string) {
    this.id = id;
    this.ip = '127.0.0.1';
    this.fingerprint = '';
    this.name = null;
    this.center = null;
    this.wait = null;
  }

  async getCoolDown(pixel: Pixel, isCreated: boolean): Promise<number> {
    if (this.isAdmin()) return 0;
    // if (__DEV__) return 5 * SECOND;

    if (isCreated) {
      const { x, y } = pixel;
      const color = await RedisCanvas.getColor(x, y);
      // TODO
      if (color === 0) return BLANK_COOLDOWN;
      pixel.updatedAt = DATE_FIRST_PIXEL;
    }

    return pixel.getCoolDown();
  }

  async setWait(coolDown: number): Promise<boolean> {
    if (this.isAdmin()) return false;

    this.wait = Date.now() + coolDown;
    // TODO think about puting await
    // http://redis.js.org/#redis-commands
    // PX stands for milliseconds expire. Read more at https://redis.io/commands/set
    await redis.setAsync(`cooldown:${this.id}`, 'y', 'PX', coolDown);
    await redis.setAsync(`cooldown:fingerprint:${this.fingerprint}`, 'y', 'PX', coolDown);
    return true;
  }

  async getWait(): Promise<?number> {
    const ttlIP: number = await redis.pttlAsync(`cooldown:${this.id}`);
    const ttlFingerprint: number = await redis.pttlAsync(`cooldown:fingerprint:${this.fingerprint}`);
    logger.debug('ererer', ttlIP, ttlFingerprint, typeof ttlIP);

    const ttl = ttlIP < 0 ? Math.max(ttlIP, ttlFingerprint) : ttlIP;

    const wait = ttl < 0 ? null : Date.now() + ttl;
    this.wait = wait;
    return wait;
  }

  async verifyCaptcha(token: ?string): boolean {
    logger.info('verifying recaptcha token', token, this.ip);

    const ttlIP: number = await redis.ttlAsync(`captcha:${this.ip}`);
    logger.debug('ttlIP', ttlIP, typeof ttlIP);
    // under grace period
    if (ttlIP > FLAG_TTL) return true;

    // under scrutiny period (flagged)
    if (ttlIP > 0) {
      if (!token) return false;

      const ttlCaptcha: number = await redis.ttlAsync(`recaptcha:${token}`);
      logger.debug('ttlCaptcha', ttlCaptcha);
      // already used
      if (ttlCaptcha > 0) return false;

      if (!await verifyCaptcha(token, this.ip)) return false;
    }

    // captcha is valid!
    if (token) {
      await redis.setAsync(
        `recaptcha:${token}`,
        'y',
        'EX',
        RECAPTCHA_TTL,
      );
    }

    await redis.delAsync(`captcha:${this.ip}`);

    const flagIP = randomDice(CAPTCHA_PROB);
    logger.info('next time captcha?', flagIP);
    if (flagIP) {
      await redis.setAsync(
        `captcha:${this.ip}`,
        'y',
        'EX',
        FLAG_TTL + GRACE_PERIOD,
      );
    }

    return true;
  }

  async linkFingerprint() {
    await redis.setAsync(
      `link:${this.id}:${this.fingerprint}`,
      'y',
      'EX',
      FLAG_TTL,
    );
  }

  async isValidFingerprint(): Promise<boolean> {
    const pepe = `${this.id}:${this.fingerprint}`;
    const ttl: number = await redis.ttlAsync(`link:${pepe}`);
    logger.debug('ttl link', ttl, typeof ttl);
    const ttlWS: number = await redis.ttlAsync(`wslink:${pepe}`);
    logger.debug('ttl wslink', ttlWS, typeof ttlWS);

    return (ttl > 0) && (ttlWS > 0);
  }

  getWaitSeconds(): ?number {
    const { wait } = this;
    if (!wait) return null;
    const now = Date.now();
    return (wait - now) / 1000;
  }

  isAdmin(): boolean {
    return ADMINS.has(this.id);
  }

  getName(): string {
    const { name } = this;
    if (name) return name;

    const { id } = this;
    // TODO name
    this.name = id.startsWith('ip') ? 'Anonymous' : 'TODO';
    return this.name;
  }

  async getCenter(): Promise<Cell> {
    const { center } = this;
    if (center) return center;

    const { id } = this;
    if (id.startsWith('ip')) {
      const ip = this.ip;
      const region = getRegionOfIP(ip);
      this.center = centers[region];
    } else {
      // TODO
      this.center = [0, 0];
    }
    return this.center;
  }
}

export default User;
