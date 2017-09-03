/**
 * Created by arkeros
 *
 * https://nodejs.org/docs/latest/api/buffer.html#buffer_buffers_and_typedarray
 *
 * @flow
 */

import type { Request, Response } from 'express';

import redis from '../../data/redis';
import { BIG_CHUNK_RADIUS } from '../../core/constants';


const EMPTY_CACA = new Uint8Array(64 * 32);
const EMPTY_CHUNK_BUFFER = Buffer.from(EMPTY_CACA.buffer);


export default async (req: Request, res: Response, next) => {
  const { x: paramX, y: paramY } = req.params;
  // TODO protection to NaN
  const x = parseInt(paramX, 10);
  const y = parseInt(paramY, 10);
  const radius = BIG_CHUNK_RADIUS;
  // console.log('radius', radius);
  try {
    const keys = [];
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        keys.push(`chunk:${x + dx}:${y + dy}`);
      }
    }

    const chunks: Array<?Buffer> = await redis.mgetAsync(...keys);
    // console.log(chunks);

    // Content-Type: text/html
    res.set({
      'Content-Type': 'image/bmp', // seconds
      'Cache-Control': 'public, s-maxage=5, max-age=1', // seconds
    });
    res.status(200);

    // TODO optimize
    chunks.forEach((chunk, index) => {
      if (!chunk) chunks[index] = EMPTY_CHUNK_BUFFER;
    });
    // https://github.com/expressjs/express/issues/1555#issuecomment-15472419
    res.write(Buffer.concat(chunks), 'binary');
    res.end(null, 'binary');
  } catch (error) {
    next(error);
  }
};
