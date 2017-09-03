/* @flow */

import { TRANSPARENT } from '../../core/Color';
import { getChunkOfPixel, getOffsetOfPixel } from '../../core/utils';

import redis from '../redis';


const UINT_SIZE = 'u4';

const EMPTY_CACA = new Uint8Array(64 * 32);
const EMPTY_CHUNK_BUFFER = Buffer.from(EMPTY_CACA.buffer);

// cache existence of chunks
const chunks: Set<string> = new Set();


class RedisCanvas {

  static getChunk(i: number, j: number): Promise<string> {
    return redis.getAsync(`chunk:${i}:${j}`);
  }

  static async setColor(x: number, y: number, color: ColorIndex) {
    const [i, j] = getChunkOfPixel([x, y]);
    const offset = getOffsetOfPixel(x, y);
    const key = `chunk:${i}:${j}`;

    if (!chunks.has(key)) {
      const setNXArgs = [key, EMPTY_CHUNK_BUFFER.toString('binary')];
      await redis.sendCommandAsync('SETNX', setNXArgs);
      chunks.add(key);
    }

    const args = [key, 'SET', UINT_SIZE, `#${offset}`, color];
    // console.log('bitfield', args);
    await redis.sendCommandAsync('bitfield', args);
  }

  static async getColor(x: number, y: number): Promise<ColorIndex> {
    const [i, j] = getChunkOfPixel([x, y]);
    const offset = getOffsetOfPixel(x, y);
    const args = [`chunk:${i}:${j}`, 'GET', UINT_SIZE, `#${offset}`];
    // console.log('bitfield', args);
    const result: ?number = await redis.sendCommandAsync('bitfield', args);
    if (!result) return TRANSPARENT;
    const color = result[0];
    return color || TRANSPARENT;
  }
}

export default RedisCanvas;
