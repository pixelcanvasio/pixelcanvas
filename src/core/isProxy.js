/**
 * Created by arkeros on 30/4/17.
 * @flow
 * */

import fetch from 'isomorphic-fetch';
import Chance from 'chance';
import IP from 'ip';

import redis from '../data/redis';
import { Blacklist } from '../data/models';
import logger from './logger';
import { PROXY_CHECK_SECRET } from '../config';


async function getShroomey(ip: string): Promise<boolean> {
  const response = await fetch(`http://www.shroomery.org/ythan/proxycheck.php?ip=${ip}`);
  if (!response.ok) throw new Error('shroomery.org not ok');
  const body = await response.text();
  logger.debug('is proxy?', ip, body);
  return body === 'Y';
}

// Instantiate Chance so it can be used
const chance = new Chance(IP.address());
const email = chance.email({ domain: 'gmail.com' });
async function getIPIntel(ip: string): Promise<boolean> {
  const url = `http://check.getipintel.net/check.php?ip=${ip}&contact=${email}&flags=f`;
  logger.debug('fetching', url);
  const response = await fetch(url, {
    headers: {
      Accept: '*/*',
      'Accept-Language': 'es-ES,es;q=0.8,en;q=0.6',
      Host: 'check.getipintel.net',
      Referer: 'http://check.getipintel.net/',
      'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)',
    },
  });
  // TODO log response code
  logger.debug('getipintel?', ip);
  if (!response.ok) throw new Error('getipintel not ok');
  const body = await response.text();
  logger.debug('getIPIntel is proxy?', ip, body);
  // returns tru iff we found 1 in the response and was ok (http code = 200)
  const value = parseFloat(body);
  return value > 0.95;
}

async function getProxyCheck(ip: string): Promise<boolean> {
  const url = `http://proxycheck.io/v1/${ip}&key=${PROXY_CHECK_SECRET}&vpn=1`;
  logger.debug('fetching', url);
  const response = await fetch(url);
  if (!response.ok) throw new Error('proxycheck.io not ok');
  const data = await response.json();
  logger.debug('proxycheck.io is proxy?', ip, data);
  // returns tru iff we found 1 in the response and was ok (http code = 200)
  return ('proxy' in data) && data.proxy === 'yes';
}

async function isBlacklisted(ip: string): Promise<boolean> {
  const numIp = IP.toLong(ip);
  const count = await Blacklist
    .count({
      where: {
        numIp,
      },
    });

  return count !== 0;
}

/**
 * El tiempo gastado en consultar apis de terceros se acumula a nuestra api.
 * por eso, se llama en async sin esperar la respuesta, momentaneamente se devuelve false.
 *
 * @param f
 * @param tag
 * @param ttlNo
 * @returns {function(string)}
 */
function withCache(f, tag, ttlNo = 5) {
  return async(ip: string) => {
    const key = `${tag}:${ip}`;
    const cache = await redis.getAsync(key);

    if (cache) {
      const str = cache.toString('utf8');
      logger.debug(key, cache, typeof cache, str, typeof str);
      return str === 'y';
    }

    // asynchronously fetching 3rd party api
    f(ip)
      .then((result) => {
        const value = result ? 'y' : 'n';
        const ttlMinutes = result ? 6 * 60 : ttlNo;
        redis.setAsync(key, value, 'EX', ttlMinutes * 60);
      })
      .catch(error => logger.error('withCache', error.message || error));

    return false;
  };
}

export const getShroomeyWithCache = withCache(getShroomey, 'shroomey');
export const getIPIntelWithCache = withCache(getIPIntel, 'getipintel');
export const getProxyCheckWithCache = withCache(getProxyCheck, 'proxycheck', 30);
export const isBlacklistedWithCache = withCache(isBlacklisted, 'blacklist');

async function cheapDetector(ip: string): Promise<boolean> {
  return (await isBlacklistedWithCache(ip)) || (await getProxyCheckWithCache(ip));
}

export default cheapDetector;
