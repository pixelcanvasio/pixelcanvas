/**
 * Created by arkeros on 21/03/2017.
 *
 * @flow
 */

import type { Cell } from '../core/Cell';
import type { State } from '../reducers';

import ChunkRGB from './ChunkRGB';
import { COLORS } from '../core/Color';
import {
  clamp,
  screenToWorld,
  worldToScreen,
  getChunkOfPixel,
} from '../core/utils';
import cellsEquals from '../utils/cellsEquals';
import { CHUNK_SIZE } from '../core/constants';


const PLACEHOLDER_SIZE = 1.2;
const PLACEHOLDER_BORDER = 1;
const maxScreenSize = Math.max(screen.width, screen.height);
const computedRadius = Math.ceil(((maxScreenSize / CHUNK_SIZE) - 1) / 2);
export const CHUNK_RENDER_RADIUS = clamp(computedRadius, 4, 16);


let $canvas: HTMLCanvasElement;


export function initCanvas() {
  const tmpCanvas = document.createElement('canvas');
  if (!(tmpCanvas instanceof HTMLCanvasElement)) return; // TODO wtf
  $canvas = tmpCanvas;

  $canvas.width = ((2 * CHUNK_RENDER_RADIUS) + 1) * CHUNK_SIZE;
  $canvas.height = ((2 * CHUNK_RENDER_RADIUS) + 1) * CHUNK_SIZE;

  const context = $canvas.getContext('2d');
  if (!context) return;

  context.fillStyle = COLORS[0];
  context.fillRect(0, 0, $canvas.width, $canvas.height);
}

export function renderPixel(
  x: number,
  y: number,
  color: ColorIndex,
  chunkPosition = lastRenderCenterChunk,
) {
  const context = $canvas.getContext('2d');
  if (!context) return;

  let px = 0;
  let py = 0;
  const [cx, cy] = chunkPosition;
  px += CHUNK_RENDER_RADIUS - cx;
  py += CHUNK_RENDER_RADIUS - cy;
  px *= CHUNK_SIZE;
  py *= CHUNK_SIZE;

  // now [px, py] = position of (0, 0) on screen
  // TODO use world to screen of utils
  px += x;
  py += y;

  context.fillStyle = COLORS[color];
  context.fillRect(px, py, 1, 1);
}


export function renderChunk(chunk: ChunkRGB, { chunkPosition }) {
  const context = $canvas.getContext('2d');
  if (!context) return;

  const [cx, cy] = chunkPosition;
  let [x, y] = chunk.cell;
  x += CHUNK_RENDER_RADIUS - cx;
  y += CHUNK_RENDER_RADIUS - cy;
  x *= CHUNK_SIZE;
  y *= CHUNK_SIZE;

  context.putImageData(chunk.imageData, x, y);
}

function clearChunk(cell: Cell, { chunkPosition }) {
  const context = $canvas.getContext('2d');
  if (!context) return;

  const [cx, cy] = chunkPosition;
  let [x, y] = cell;
  x += CHUNK_RENDER_RADIUS - cx;
  y += CHUNK_RENDER_RADIUS - cy;
  x *= CHUNK_SIZE;
  y *= CHUNK_SIZE;

  // clear space
  context.fillStyle = COLORS[0];
  context.fillRect(x, y, CHUNK_SIZE, CHUNK_SIZE);
}

/**
 * Optimizado para aprovechar lo maximo el render antiguo.
 * Requiere que el resto de funciones PINTEN un cuadrado blanco, envez de llamar a clearRect!
 * @param chunks
 * @param oldCenter
 * @param newCenter
 */
export function renderChunks(chunks, chunkPosition) {
  const context = $canvas.getContext('2d');
  if (!context) return;

  const [x, y] = chunkPosition;

  // CLEAN margin
  // draw new chunks. If not existing, just clear.
  let cx: number;
  let cy: number;
  let chunk: ChunkRGB;
  let key: string;
  for (let dx = -CHUNK_RENDER_RADIUS; dx <= CHUNK_RENDER_RADIUS; dx += 1) {
    for (let dy = -CHUNK_RENDER_RADIUS; dy <= CHUNK_RENDER_RADIUS; dy += 1) {
      cx = x + dx;
      cy = y + dy;

      // new chunk
      key = ChunkRGB.getKey(cx, cy);
      chunk = chunks.get(key);
      if (chunk) {
        // render new chunk
        renderChunk(chunk, { chunkPosition });
      } else {
        // we don't have that chunk
        // just clear
        clearChunk([cx, cy], { chunkPosition });
      }
    }
  }
}

function renderGrid(state: State, $viewport: HTMLCanvasElement) {
  const { width, height } = $viewport;
  const { scale } = state.canvas;

  const viewportCtx = $viewport.getContext('2d');
  if (!viewportCtx) return;

  viewportCtx.globalAlpha = 0.5;
  viewportCtx.fillStyle = '#000';

  const world = screenToWorld(state, $viewport, [0, 0]);
  let [x, y] = worldToScreen(state, $viewport, world);

  for (; x < width; x += scale) {
    viewportCtx.fillRect(x, 0, 1, height);
  }

  for (; y < height; y += scale) {
    viewportCtx.fillRect(0, y, width, 1);
  }

  viewportCtx.globalAlpha = 1;
}


function renderPlaceholder(
  state: State,
  $viewport: HTMLCanvasElement,
) {
  const { scale } = state.canvas;
  const { selectedColor, hover } = state.gui;

  const viewportCtx = $viewport.getContext('2d');
  if (!viewportCtx) return;

  const worldPos = screenToWorld(state, $viewport, hover);
  const [sx, sy] = worldToScreen(state, $viewport, worldPos);

  /*
   // placement lines
   viewportCtx.globalAlpha = 0.5;

   viewportCtx.fillStyle = '#000';
   viewportCtx.fillRect(sx - 1, 0, 3, viewport.$canvas.height);
   viewportCtx.fillRect((sx - 1) + cellSize, 0, 3, viewport.$canvas.height);
   viewportCtx.fillRect(0, sy - 1, viewport.$canvas.width, 3);
   viewportCtx.fillRect(0, (sy - 1) + cellSize, viewport.$canvas.width, 3);

   viewportCtx.fillStyle = '#fff';
   viewportCtx.fillRect(sx, 0, 1, viewport.$canvas.height);
   viewportCtx.fillRect(sx + cellSize, 0, 1, viewport.$canvas.height);
   viewportCtx.fillRect(0, sy, viewport.$canvas.width, 1);
   viewportCtx.fillRect(0, sy + cellSize, viewport.$canvas.width, 1);

   viewportCtx.globalAlpha = 1;
   */

  viewportCtx.save();
  viewportCtx.translate(sx + (scale / 2), sy + (scale / 2));
  const angle = Math.sin(Date.now() / 250) / 4;
  viewportCtx.rotate(angle);
  viewportCtx.fillStyle = '#000';
  viewportCtx.fillRect(
    -(scale * (PLACEHOLDER_SIZE / 2)) - PLACEHOLDER_BORDER,
    -(scale * (PLACEHOLDER_SIZE / 2)) - PLACEHOLDER_BORDER,
    (scale * PLACEHOLDER_SIZE) + (2 * PLACEHOLDER_BORDER),
    (scale * PLACEHOLDER_SIZE) + (2 * PLACEHOLDER_BORDER),
  );
  viewportCtx.fillStyle = COLORS[selectedColor];
  viewportCtx.fillRect(
    -scale * (PLACEHOLDER_SIZE / 2),
    -scale * (PLACEHOLDER_SIZE / 2),
    scale * PLACEHOLDER_SIZE,
    scale * PLACEHOLDER_SIZE,
  );
  viewportCtx.restore();
}


let lastFetchs: number = 0;
let lastRenderCenterChunk: Cell = null;
let lastView: Cell;
function render(state: State, $viewport: HTMLCanvasElement) {
  const { showGrid, hover } = state.gui;
  const {
    chunks,
    view,
    scale: cellSize,
    fetchs,
  } = state.canvas;

  if (!view) return;

  let renderCenterChunk = lastRenderCenterChunk;
  if (view !== lastView) {
    renderCenterChunk = getChunkOfPixel(view);
    lastView = view;
  }

  // detect change on renderCenterChunk
  if (!cellsEquals(lastRenderCenterChunk, renderCenterChunk)
    || lastFetchs !== fetchs) {
    // if change on render center, lets render!
    renderChunks(chunks, renderCenterChunk);
    lastRenderCenterChunk = renderCenterChunk;
    lastFetchs = fetchs;
  }

  const { coolDown } = state.user;

  const viewportCtx = $viewport.getContext('2d');
  if (!viewportCtx) return;
  const { width, height } = $viewport;
  viewportCtx.clearRect(0, 0, width, height);

  // Disable smoothing
  viewportCtx.msImageSmoothingEnabled = false;
  viewportCtx.webkitImageSmoothingEnabled = false;
  viewportCtx.mozImageSmoothingEnabled = false;
  viewportCtx.imageSmoothingEnabled = false;

  // ZOOM
  // scale = (0.9 * scale) + (0.1 * scaleTarget);
  // TODO animate scale
  // TODO animate view

  // copied colorthis.space
  const [x, y] = view;
  const [cx, cy] = renderCenterChunk;
  viewportCtx.save();
  viewportCtx.translate(width / 2, height / 2);
  viewportCtx.scale(cellSize, cellSize);
  viewportCtx.drawImage($canvas,
    -((CHUNK_SIZE * CHUNK_RENDER_RADIUS) + (x - (cx * CHUNK_SIZE))),
    -((CHUNK_SIZE * CHUNK_RENDER_RADIUS) + (y - (cy * CHUNK_SIZE))),
  );
  viewportCtx.restore();

  if (showGrid && cellSize >= 8) renderGrid(state, $viewport);

  if (!coolDown && hover) {
    renderPlaceholder(state, $viewport);
  }
}

export default render;
