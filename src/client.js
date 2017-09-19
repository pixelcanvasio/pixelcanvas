/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import fetch from 'isomorphic-fetch'; // TODO put in the beggining with webpack!
import keycode from 'keycode';
import Hammer from 'hammerjs';
import Visibility from 'visibilityjs';
import Raven from 'raven-js';
import 'cookieconsent';

import {
  getChunkOfPixel,
  screenToWorld,
 } from './core/utils';

import type { State } from './reducers';
import initAds, { requestAds } from './ui/ads';
import {
  tryPlacePixelWithConfirm,
  toggleGrid,
  toggleMute,
  setHover,
  unsetHover,
  setView,
  moveNorth,
  moveWest,
  moveSouth,
  moveEast,
  setScale,
  zoomIn,
  zoomOut,
  fetchBigChunk,
  receivePixelUpdate,
  fetchOnline,
  fetchMe,
  initTimer,
 } from './actions';
import store from './ui/store';
import { startAudioContext } from "./store/audio";

import App from './components/App';

import ChunkRGB from './ui/ChunkRGB';
import render, {
  renderPixel,
  initCanvas,
} from './ui/render';
import ProtocolClient from './socket/ProtocolClient';
import cellsEquals from './utils/cellsEquals';
import { CHUNK_SIZE, BIG_CHUNK_RADIUS, release } from './core/constants';


Raven
  .config('https://083d57cc37ac46a5956f9b5f734861f0@sentry.io/172626', {
    release,
    // serverName: device.uuid,
  })
  .install();

let $viewport: HTMLCanvasElement;


// TODO save previous session view position (localStorage)

// TODO move view


function getCenterCorresponding([x, y]: Cell) {
  const distance = (2 * BIG_CHUNK_RADIUS) + 1;
  const [fx, fy] = [0, 0];
  const [cx, cy] = [(x - fx) / distance, (y - fy) / distance].map(Math.round);
  return [fx + (cx * distance), fy + (cy * distance)];
}

function initBigChunk() {
  const initialState: State = store.getState();
  const { view } = initialState.canvas;

  const firstCenterChunk = getCenterCorresponding(getChunkOfPixel(view));
  store.dispatch(fetchBigChunk(firstCenterChunk));
  // moveChunk(initialState);
}

let moveLastCell: Cell = null;
let moveLastScale: Cell = null;
function moveChunk(state: State) {
  const { view, scale, chunks, requested } = state.canvas;

  // check if new chunks could be seen
  const cell = getChunkOfPixel(view);
  if (cellsEquals(cell, moveLastCell) && scale >= moveLastScale) return;
  moveLastCell = cell;
  moveLastScale = scale;

  const width = Math.ceil($viewport.width / CHUNK_SIZE);
  const height = Math.ceil($viewport.height / CHUNK_SIZE);
  const missing: Set<Cell> = new Set();
  const pixelTopLeft = screenToWorld(state, $viewport, [0, 0]);
  const [cx, cy] = getChunkOfPixel(pixelTopLeft);

  let dx;
  let dy;
  let key;
  for (dx = 0; dx < width; dx += 1) {
    for (dy = 0; dy < height; dy += 1) {
      key = ChunkRGB.getKey(cx + dx, cy + dy);
      if (!chunks.has(key)) missing.add([cx + dx, cy + dy]);
    }
  }

  if (missing.size === 0) return;

  console.log('missing', missing);

  const centers = new Map();
  missing.forEach((missingCell) => {
    const center = getCenterCorresponding(missingCell);
    key = ChunkRGB.getKey(...center);
    centers.set(key, center);
  });

  console.log('centers', centers);

  // TODO marcar en state que que han pedido ya para descargar estos centers
  centers.forEach((center, centerKey) => {
    if (!requested.has(centerKey)) {
      store.dispatch(fetchBigChunk(center));
    }
  });
}

function updateOnline() {
  store.dispatch(fetchOnline());
}

// TODO hacerlo con eventos
function onViewFinishChange() {
  const state: State = store.getState();
  const { view } = state.canvas;

  // round pixel, to delete decimals!
  const [x, y] = view.map(Math.round);

  // url coordinates
  if (history.pushState) {
    const currentView = (history.state && history.state.view) || [0, 0];
    const [curX, curY] = currentView;

    if (curX !== x || curY !== y) {
      const newurl = `/@${x},${y}`;
      window.history.pushState({ view: [x, y] }, `(${x}, ${y})`, newurl);
    }
  }
}

function onKeyPress(event: KeyboardEvent) {
  // console.log(event);
  switch (keycode(event)) {
    case 'up':
    case 'w':
      store.dispatch(moveNorth());
      break;
    case 'left':
    case 'a':
      store.dispatch(moveWest());
      break;
    case 'down':
    case 's':
      store.dispatch(moveSouth());
      break;
    case 'right':
    case 'd':
      store.dispatch(moveEast());
      break;
    case 'space':
    case 'g':
      store.dispatch(toggleGrid());
      return;
    case 'p':
      if ($viewport) $viewport.click();
      return;
    case 'm':
      store.dispatch(toggleMute());
      return;
    case '+':
    case 'e':
      store.dispatch(zoomIn());
      return;
    case '-':
    case 'q':
      store.dispatch(zoomOut());
      return;
    default:
      return;
  }
  onViewFinishChange();
}

function animationLoop() {
  // TODO think order: requestAnimationFrame before or after render?
  window.requestAnimationFrame(animationLoop);

  render(store.getState(), $viewport);
}

window.addEventListener('keydown', onKeyPress, false);

// hooks

function resizeViewport() {
  $viewport.width = window.innerWidth;
  $viewport.height = window.innerHeight;
}


function MouseWheelHandler({ deltaY }: WheelEvent) {
  if (deltaY < 0) {
    store.dispatch(zoomIn());
  }

  if (deltaY > 0) {
    store.dispatch(zoomOut());
  }
}

// zoom controls with wheel
document.addEventListener('wheel', MouseWheelHandler, false);

function initViewport() {
  const canvas = document.getElementById('gameWindow');
  if (!(canvas instanceof HTMLCanvasElement)) return; // TODO wtf
  $viewport = canvas;

  // track hover
  $viewport.onmousemove = ({ clientX, clientY }: MouseEvent) => {
    // if (e.which || e.buttons) return; // only track hover
    store.dispatch(setHover([clientX, clientY]));
  };
  $viewport.onmouseout = () => {
    store.dispatch(unsetHover());
  };

  // fingers controls on touch
  const hammertime = new Hammer($viewport);
  // Zoom-in Zoom-out in touch devices
  hammertime.get('pinch').set({ enable: true });
  // hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

  hammertime.on('tap', ({ center }) => {
    const state = store.getState();
    const { coolDown } = state.user;
    const { autoZoomIn } = state.gui;

    const { scale } = state.canvas;
    const { x, y } = center;
    const cell = screenToWorld(state, $viewport, [x, y]);

    if (autoZoomIn && scale < 8) {
      store.dispatch(setView(cell));
      store.dispatch(setScale(12));
      return;
    }

    if (coolDown) return;
    const { pixelsPlaced } = state.gui;
    console.log({ pixelsPlaced });
    // dirty trick: to fetch only before multiple 3 AND on user action
    if (pixelsPlaced % 3 === 0) requestAds();

    // TODO assert only one finger
    store.dispatch(tryPlacePixelWithConfirm(cell));
  });

  // http://stackoverflow.com/questions/18011099/pinch-to-zoom-using-hammer-js
  const initialState: State = store.getState();
  [window.lastPosX, window.lastPosY] = initialState.canvas.view;
  let lastScale = initialState.canvas.scale;
  hammertime.on(
    'panstart pinchstart pan pinch panend pinchend',
    ({ type, deltaX, deltaY, scale },
  ) => {
      $viewport.style.cursor = 'move'; // like google maps

      // pinch start
      if (type === 'pinchstart') {
        const { scale: initScale } = store.getState().canvas;
        lastScale = Math.round(initScale);
      }

      // panstart
      if (type === 'panstart') {
        const { view: initView } = store.getState().canvas;
        [window.lastPosX, window.lastPosY] = initView;
      }

      // pinch
      if (type === 'pinch') {
        store.dispatch(setScale(lastScale * scale));
      }

      const { scale: viewportScale } = store.getState().canvas;

      // pan
      store.dispatch(setView([
        window.lastPosX - (deltaX / viewportScale),
        window.lastPosY - (deltaY / viewportScale),
      ]));

      // pinch end
      if (type === 'pinchend') {
        lastScale = Math.round(viewportScale);
        store.dispatch(setScale(lastScale));
      }

      // panend
      if (type === 'panend') {
        onViewFinishChange();
        const { view } = store.getState().canvas;
        [window.lastPosX, window.lastPosY] = view;
        $viewport.style.cursor = 'auto';
        return;
      }
    });

  resizeViewport();
  window.addEventListener('resize', resizeViewport);
}

ProtocolClient.on('pixelUpdate', ({ x, y, color }) => {
  store.dispatch(receivePixelUpdate(x, y, color));

  // render updated pixel
  renderPixel(x, y, color);
});

document.addEventListener('DOMContentLoaded', () => {
  // API: init me endpoint
  store.dispatch(fetchMe());

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app'),
    startAudioContext,
  );

  initViewport();
  initBigChunk();
  initCanvas();
  initAds();
  // TODO add analytics

  store.subscribe(() => {
    const state: State = store.getState();

    moveChunk(state);
  });

  store.dispatch(initTimer());

  // TODO checkear que no se filtren partes del codigo

  animationLoop();

  updateOnline();
  Visibility.every((10 + 2) * 1000, () => {
    updateOnline();
  });

  window.cookieconsent.initialise({
    palette: {
      popup: {
        background: "#000",
      },
      button: {
        background: "#f1d600",
      },
    },
    position: 'top',
    content: {
      message: "We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information you’ve provided to them or they’ve collected from your use of their services.",
      href: "https://www.google.com/policies/technologies/cookies/"
    },
  });
});
