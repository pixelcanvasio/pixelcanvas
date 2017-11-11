/* @flow */

import { using } from 'bluebird';

import type { User } from '../data/models';
import { clamp } from './utils';
import { Pixel } from '../data/models';
import { redlock } from '../data/redis';
import PixelUpdate from '../socket/packets/PixelUpdate';
import { broadcast } from '../socket/service';
import logger from './logger';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config';

/**
 *
 * @param user
 * @param x
 * @param y
 * @param color
 * @returns {Promise.<boolean>}
 */
async function draw(
  user: User,
  x: number,
  y: number,
  color: ColorIndex,
): Promise<boolean> {
  const now = Date.now();

  const wait = await user.getWait();
  // 2 seconds of margin
  if (wait && (wait - 2000) > now) return false;

  // const currentColor = await Pixel.getColor(x, y);
  // console.log('currentColor', currentColor);
  // if (currentColor === color) return false;

  const { ip, fingerprint } = user;
  const [pixel, isCreated] = await Pixel.findOrCreate({
    where: { x, y },
  });
  const oldCooldown = await user.getCoolDown(pixel, isCreated); // in milliseconds
  const distance = Math.sqrt((x ** 2) + (y ** 2));
  const maxSeconds = 30.0 * (1.0 + (distance / 500.0));
  const maxCooldown = maxSeconds * 1000.0 | 0;
  const coolDown = Math.min(oldCooldown, maxCooldown);
  await pixel.update({ user, color, ip, fingerprint });
  broadcast(PixelUpdate.dehydrate({ x, y, color }));
  // this.emit('place', { x, y, color });

  await user.setWait(coolDown);
  // console.log('waitTime', cell, waitTime);
  // console.log('cannot place until', player.wait);
  // TODO emit update waittime
  return true;
}

/**
 * This function is a wrapper for draw. It fixes the race condition exploited by @TheGrid.
 * It permits just placing one pixel at a time per user.
 *
 * @param user
 * @param x
 * @param y
 * @param color
 * @returns {Promise.<boolean>}
 */
function drawSafe(
  user: User,
  x: number,
  y: number,
  color: ColorIndex,
  token: string,
): Promise<boolean> {
  const userId = user.id;

  return new Promise((resolve) => {
    using(
      redlock.disposer(`locks:${userId}`, 5000, logger.error),
      async () => {
        if (await user.verifyCaptcha(token)) {
          const success = await draw(user, x, y, color);
          resolve(success);
        } else {
          resolve(false);
        }
      },
    ); // <-- unlock is automatically handled by bluebird
  });
}


export function drawRect(
  user: User,
  x: number,
  y: number,
  w: number,
  h: number,
  color: ColorIndex,
) {
  // prevent drawing outside of the canvas
  const width = clamp(w, 0, CANVAS_WIDTH - x);
  const height = clamp(h, 0, CANVAS_HEIGHT - y);

  const promises = [];

  let dx;
  let dy;
  for (dx = 0; dx < width; dx += 1) {
    for (dy = 0; dy < height; dy += 1) {
      promises.push(draw(user, x + dx, y + dy, color));
    }
  }

  return Promise.all(promises);
}

export const drawUnsafe = draw;

export default drawSafe;
