/* @flow */

import type { Cell } from '../core/Cell';

import { COLORS_ABGR } from '../core/Color';
import { CHUNK_SIZE } from '../core/constants';

const CHUNK_AREA = CHUNK_SIZE * CHUNK_SIZE;

function colorsFromChunkBuffer(chunkBuffer: Uint8Array): Uint8Array {
  const colors = new Uint8Array(CHUNK_AREA);
  let color: ColorIndex;
  let value: number;
  const buffer = chunkBuffer;

  for (let i = 0; i < 64 * 32; i += 1) {
    value = buffer[i];

    color = value >> 4;
    colors[2 * i] = color;

    color = value & 0x0F;
    colors[(2 * i) + 1] = color;
  }

  return colors;
}


class ChunkRGB {

  cell: Cell;
  key: string;
  imageData: ImageData;
  intView: Uint32Array;

  constructor(cell: Cell) {
    try {
      this.imageData = new ImageData(CHUNK_SIZE, CHUNK_SIZE);
    } catch (e) {
      // workaround when ImageData is unavailable (Such as under MS Edge)
      const $canvas = document.createElement('canvas');
      $canvas.width = CHUNK_SIZE;
      $canvas.height = CHUNK_SIZE;
      const ctx = $canvas.getContext('2d');
      this.imageData = ctx.getImageData(0, 0, CHUNK_SIZE, CHUNK_SIZE);
    }
    this.intView = new Uint32Array(this.imageData.data.buffer);
    this.cell = cell;
    this.key = ChunkRGB.getKey(...cell);
  }

  from(chunkBuffer: Uint8Array) {
    const colors = colorsFromChunkBuffer(chunkBuffer);
    // console.log('colors', chunkBuffer, colors);
    colors.forEach((color, index) => {
      this.intView[index] = COLORS_ABGR[color];
    }, this);
  }

  static getKey(x: number, y: number) {
    return `${x}:${y}`;
  }

  static getIndexFromCell([x, y]: Cell): number {
    return x + (CHUNK_SIZE * y);
  }

  hasColorIn(cell: Cell, color: ColorIndex): boolean {
    const index = ChunkRGB.getIndexFromCell(cell);

    const oldColor = this.intView[index];
    const newColor = COLORS_ABGR[color];
    return (oldColor === newColor);
  }

  setColor(cell: Cell, color: ColorIndex): boolean {
    if (this.hasColorIn(cell, color)) return false;
    // apply color
    const index = ChunkRGB.getIndexFromCell(cell);
    this.intView[index] = COLORS_ABGR[color];
    return true;
  }
}

export default ChunkRGB;
