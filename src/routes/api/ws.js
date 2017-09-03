/**
 * Created by arkeros
 *
 * @flow
 */

import type { Request, Response } from 'express';

import { randomChoice } from '../../utils/random';
import logger from '../../core/logger';
import { SECOND } from '../../core/constants';
import { WS_HOSTS } from '../../config';


const onlineMap: Map<string, number> = new Map();
async function updateOnline(host) {
  let online = -1;
  try {
    const response = await fetch(`http://${host}/api`);
    if (!response.ok) throw new Error('websockets/api: response not ok');

    const data = await response.json();
    online = data.clients;
  } catch (error) {
    online = -1;
    logger.error(error);
  }

  onlineMap.set(host, online);
}

async function updateOnlineAll() {
  WS_HOSTS.forEach(updateOnline);
}

updateOnlineAll();
setInterval(updateOnlineAll, 3 * SECOND);


export default async (req: Request, res: Response) => {
  let min = +Infinity;
  let minHost;

  onlineMap.forEach((online, host) => {
    if (online < 0) return;

    if (online < min) {
      min = online;
      minHost = host;
    }
  });

  if (!minHost) minHost = randomChoice(WS_HOSTS);

  const url = `ws://${minHost}`;
  res.set({
    'Cache-Control': 'public, s-maxage=30, max-age=5', // seconds
  });
  res.json({ url });
};
