/* @flow */

import type { Action } from '../actions/types';
import type { Cell } from '../core/Cell';

import {
  getChunkOfPixel,
  mod,
  clamp,
 } from '../core/utils';
import ChunkRGB from '../ui/ChunkRGB';
import { getRandomInt } from '../utils/random';
import { CHUNK_SIZE, BIG_CHUNK_RADIUS } from '../core/constants';


export type CanvasState = {
  chunks: Map<string, ChunkRGB>,
  scale: number,
  view: Cell,
  requested: Set<string>,
  // TODO encontrarle utilidad a isFetchinBigChunk
  // design thinking!!!
  isFetchinBigChunk: boolean,
  fetchs: number,
};

const RANDOM_RADIUS = 2000;
function getRandomCenter(): Cell {
  return [
    getRandomInt(-RANDOM_RADIUS, RANDOM_RADIUS),
    getRandomInt(-RANDOM_RADIUS, RANDOM_RADIUS),
  ];
}

function getCenter() {
  const url: string = window.location.href;
  const cleanUrl = url
    .split('#')[0]
    .split('?')[0];
  const path = cleanUrl.split('/').pop();

  if (path.length === 0 || !path.startsWith('@')) return getRandomCenter();

  try {
    const almost = path.substring(1);
    const [x, y] = almost
      .split(',')
      .map(num => parseInt(num, 10));
    return [x, y];
  } catch (error) {
    return getRandomCenter();
  }
}

const initialState: CanvasState = {
  chunks: new Map(),
  view: getCenter(),
  requested: new Set(),
  scale: 4,
  isFetchinBigChunk: false,
  fetchs: 0,
};

const MIN_SCALE = 1;
const MAX_SCALE = 40;

function onChunkBufferReceived(
  chunks: Map<number, ChunkRGB>,
  cell: Cell,
  chunkBuffer: Uint8Array,
): ChunkRGB {
  const chunkRGB = new ChunkRGB(cell);
  chunkRGB.from(chunkBuffer);
  chunks.set(chunkRGB.key, chunkRGB);
  return chunkRGB;
}


export default function gui(
  state: CanvasState = initialState,
  action: Action,
): CanvasState {
  switch (action.type) {

    case 'PLACE_PIXEL': {
      const { chunks } = state;
      const { coordinates, color } = action;

      const [cx, cy] = getChunkOfPixel(coordinates);
      const key = ChunkRGB.getKey(cx, cy);
      let chunk = chunks.get(key);
      if (!chunk) {
        chunk = new ChunkRGB([cx, cy]);
        chunks.set(chunk.key, chunk);
      }

      // redis prediction
      const [x, y] = coordinates;
      chunk.setColor(
        [x - (cx * CHUNK_SIZE), y - (cy * CHUNK_SIZE)],
        color,
      );
      return {
        ...state,
        chunks,
      };
    }

    case 'SET_SCALE': {
      return {
        ...state,
        scale: clamp(action.scale, MIN_SCALE, MAX_SCALE),
      };
    }

    case 'SET_VIEW': {
      const { view } = action;
      return {
        ...state,
        view,
      };
    }

    case 'RECEIVE_ME': {
      let { view } = state;
      const { center } = action;

      return {
        ...state,
        view,
      };
    }

    case 'REQUEST_BIG_CHUNK': {
      const { fetchs, requested } = state;
      const { center } = action;

      const key = ChunkRGB.getKey(...center);
      requested.add(key);
      return {
        ...state,
        isFetchinBigChunk: true,
        fetchs: fetchs + 1,
        requested,
      };
    }

    case 'RECEIVE_BIG_CHUNK': {
      const { chunks, fetchs } = state;
      const { center, arrayBuffer } = action;
      const [cx, cy] = center;
      const radius = BIG_CHUNK_RADIUS;

      let start = 0;
      const bufferSize = (CHUNK_SIZE * CHUNK_SIZE) / 2;
      let chunkBuffer: Uint8Array;
      let cell: Cell;

      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          cell = [cx + dx, cy + dy];
          chunkBuffer = new Uint8Array(arrayBuffer, start, bufferSize);
          onChunkBufferReceived(chunks, cell, chunkBuffer);
          start += bufferSize;
        }
      }
      return {
        ...state,
        chunks,
        isFetchinBigChunk: false,
        fetchs: fetchs + 1,
      };
    }

    case 'RECEIVE_PIXEL_UPDATE': {
      const { chunks } = state;
      const { x, y, color } = action;

      const cell = getChunkOfPixel([x, y]);
      const key = ChunkRGB.getKey(...cell);
      const chunk = chunks.get(key);

      // ignore because is not seen
      if (!chunk) return state;

      // TODO abstract in utils
      const cx = mod(x, CHUNK_SIZE);
      const cy = mod(y, CHUNK_SIZE);
      chunk.setColor([cx, cy], color);

      return {
        ...state,
        chunks,
      };
    }

    case 'RECEIVE_CHUNK_BUFFER': {
      const { chunks } = state;
      const { cell, chunkBuffer } = action;
      onChunkBufferReceived(chunks, cell, chunkBuffer);
      return {
        ...state,
        chunks,
      };
    }

    default:
      return state;
  }
}
