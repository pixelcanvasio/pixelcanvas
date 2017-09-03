/* @flow */

import moment from 'moment';

import type { Cell } from './Cell';
import type { State } from '../reducers';

import { CHUNK_SIZE } from './constants';

/**
 * http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving
 * @param n
 * @param m
 * @returns {number} remainder
 */
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function distMax([x1, y1]: Cell, [x2, y2]: Cell): number {
  return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

export function getChunkOfPixel(pixel: Cell): Cell {
  return pixel.map(x => Math.floor(x / CHUNK_SIZE));
}

export function getOffsetOfPixel(x: number, y: number): number {
  const cx = mod(x, CHUNK_SIZE);
  const cy = mod(y, CHUNK_SIZE);
  return (cy * CHUNK_SIZE) + cx;
}

export function getPixelFromChunkOffset(
  i: number,
  j: number,
  offset: number,
): Cell {
  const cx = mod(offset, CHUNK_SIZE);
  const cy = Math.floor(offset / CHUNK_SIZE);
  const x = (i * CHUNK_SIZE) + cx;
  const y = (j * CHUNK_SIZE) + cy;
  return [x, y];
}

export function getCellInsideChunk(pixel: Cell): Cell {
  // TODO assert is positive!
  return pixel.map(x => mod(x, CHUNK_SIZE));
}

export function screenToWorld(
  state: State,
  $viewport: HTMLCanvasElement,
  [x, y]: Cell,
): Cell {
  const { scale, view } = state.canvas;
  const [viewX, viewY] = view;
  const { width, height } = $viewport;
  return [
    Math.floor(((x - (width / 2)) / scale) + viewX),
    Math.floor(((y - (height / 2)) / scale) + viewY),
  ];
}

export function worldToScreen(
  state: State,
  $viewport: HTMLCanvasElement,
  [x, y]: Cell,
): Cell {
  const { scale, view } = state.canvas;
  const [viewX, viewY] = view;
  const { width, height } = $viewport;
  return [
    ((x - viewX) * scale) + (width / 2),
    ((y - viewY) * scale) + (height / 2),
  ];
}

export function durationToString(
  ms: number,
  smallest: boolean = false,
): string {
  const duration = moment.duration(ms);

  let rendered: string;
  if (duration.days()) {
    const clock = moment.utc(ms).format('HH:mm:ss');
    rendered = `${duration.days()}d ${clock}`;
  } else if (duration.hours()) {
    rendered = moment.utc(ms).format('HH:mm:ss');
  } else if (duration.minutes()) {
    rendered = moment.utc(ms).format('mm:ss');
  } else {
    rendered = moment.utc(ms).format(smallest ? 'ss' : 'mm:ss');
  }

  return rendered;
}
