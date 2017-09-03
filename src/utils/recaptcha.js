/**
 * Created by arkeros on 10/6/17.
 *
 * @flow
 */

import fetch from 'isomorphic-fetch';
import moment from 'moment';

import logger from '../core/logger';
import { recaptcha } from '../config';


const BASE_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify';
const ENDPOINT = `${BASE_ENDPOINT}?secret=${recaptcha.secret}`;
const VALID_HOSTNAMES = [
  'pixelcanvas.io',
  'pixelcanvas.apotema.games',
];

/**
 * https://stackoverflow.com/questions/27297067/google-recaptcha-how-to-get-user-response-and-validate-in-the-server-side
 *
 * @param token
 * @param ip
 * @returns {Promise.<boolean>}
 */
export async function verifyCaptcha(
  token: string,
  ip: string,
): Promise<boolean> {
  try {
    const url = `${ENDPOINT}&response=${token}&remoteip=${ip}`;
    const response = await fetch(url);
    if (response.ok) {
      const { success, challenge_ts, hostname } = await response.json();
      const date = new Date(challenge_ts);
      const now = moment.utc();
      const diffTime = now - date;
      const info = { token, ip, success, date, diffTime, hostname };
      logger.info('verify token', info);
      if (success
        && (__DEV__ || VALID_HOSTNAMES.includes(hostname))) {
        return true;
      }

      logger.warn('SPOOFED captcha', info);
    } else {
      logger.warn('recaptcha not ok', token, ip);
    }
  } catch (error) {
    logger.error(error);
  }

  return false;
}
