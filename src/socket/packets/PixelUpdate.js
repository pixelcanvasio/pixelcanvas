/* @flow */

/**
 * Created by arkeros on 08/04/2017.
 */


import type { ColorIndex } from '../../core/Color';
import {
  getChunkOfPixel,
  getOffsetOfPixel,
  getPixelFromChunkOffset,
} from '../../core/utils';


type PixelUpdatePacket = {
  x: number,
  y: number,
  color: ColorIndex,
};

const OP_CODE = 0xC1; // Chunk Update
const INDEX_MASK = 0xFFF0;
const COLOR_MASK = 0x000F;


export default {
  OP_CODE,
  hydrate(data: DataView): PixelUpdatePacket {
    // CLIENT
    const i = data.getInt16(1);
    const j = data.getInt16(3);
    const bytes = data.getUint16(5);

    const offset = (bytes & INDEX_MASK) >> 4;
    const [x, y] = getPixelFromChunkOffset(i, j, offset);
    const color = bytes & COLOR_MASK;

    return { x, y, color };
  },
  dehydrate({ x, y, color }: PixelUpdatePacket): Buffer {
    // SERVER
    if (!process.env.BROWSER) {
      const buffer = Buffer.allocUnsafe(1 + 2 + 2 + 2);
      buffer.writeUInt8(OP_CODE, 0);

      const [i, j] = getChunkOfPixel([x, y]);
      buffer.writeInt16BE(i, 1);
      buffer.writeInt16BE(j, 3);

      const offset = getOffsetOfPixel(x, y);
      const bytes = (offset << 4) | color;
      buffer.writeUInt16BE(bytes, 5);

      return buffer;
    }
  },
};
