/**
 * Created by arkeros
 *
 * @flow
 */

import type { Request, Response } from 'express';

import { Pixel } from '../../data/models';
import { SECOND, MINUTE } from '../../core/constants';


let online = 0;

async function updateOnline() {
  const now = Date.now();
  online = await Pixel
    .aggregate('fingerprint', 'count', {
      distinct: true,
      where: {
        updatedAt: {
          $gte: new Date(now - (5 * MINUTE)),
        },
      },
    });
}

setInterval(updateOnline, 10 * SECOND);

export default (req: Request, res: Response) => {
  res.set({
    'Cache-Control': 'public, s-maxage=30, max-age=5', // seconds
  });
  res.json({ online });
};
