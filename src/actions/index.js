/* @flow */

import swal from 'sweetalert2';
import Fingerprint2 from 'fingerprintjs2';

import type {
  Action,
  ThunkAction,
  PromiseAction,
} from './types';
import type { Cell } from '../core/Cell';
import type { ColorIndex } from '../core/Color';

import ProtocolClient from '../socket/ProtocolClient';
import { getCoolDown } from '../core/Cell';
import ChunkRGB from '../ui/ChunkRGB';
import {
  getChunkOfPixel,
  getCellInsideChunk,
  durationToString,
 } from '../core/utils';


export function toggleGrid(): Action {
  return {
    type: 'TOGGLE_GRID',
  };
}

export function toggleAutoZoomIn(): Action {
  return {
    type: 'TOGGLE_AUTO_ZOOM_IN',
  };
}

export function toggleMute(): Action {
  return {
    type: 'TOGGLE_MUTE',
  };
}

export function setHover(hover: Cell): Action {
  return {
    type: 'SET_HOVER',
    hover,
  };
}

export function unsetHover(): Action {
  return {
    type: 'UNSET_HOVER',
  };
}

export function setWait(wait: ?number): Action {
  return {
    type: 'SET_WAIT',
    wait,
  };
}

export function selectColor(color: ColorIndex): Action {
  return {
    type: 'SELECT_COLOR',
    color,
  };
}

export function placePixel(coordinates: Cell, color: ColorIndex): Action {
  return {
    type: 'PLACE_PIXEL',
    coordinates,
    color,
  };
}

const fingerprint2 = new Fingerprint2({
  extendedJsFonts: true,
});
function getFingerprint() {
  return new Promise((resolve) => {
    fingerprint2.get(resolve);
  });
}

export function requestPlacePixel(
  coordinates: Cell,
  color: ColorIndex,
  token: ?string = null,
): ThunkAction {
  const [x, y] = coordinates;

  return async (dispatch, getState) => {
    // TODO
    // dispatch(requestOnline());
    try {
      const state = getState();
      const { fingerprint } = state.user;

      const body = JSON.stringify({
        x,
        y,
        color,
        fingerprint,
        token,
        a: x + y + 8,
      });

      const response = await fetch('/api/pixel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
        // https://github.com/github/fetch/issues/349
        credentials: 'include',
      });

      const { success, waitSeconds, errors } = await response.json();

      if (waitSeconds) dispatch(setWait(waitSeconds * 1000));
      if (response.ok && success) {
        dispatch(placePixel(coordinates, color));
        return;
      }

      if (response.status === 422) {
        window.pixel = { coordinates, color };
        grecaptcha.execute();
        return;
      }

      swal({
        title: `Error ${response.status}`,
        text: errors[0].msg,
        type: 'error',
        confirmButtonText: 'OK',
      });

      // const error = new Error('Network response was not ok.');
      // TODO
      // dispatch(receiveBigChunkFailure(error));
    } catch (error) {
      // TODO
      // dispatch(receiveBigChunkFailure(error));
    }
  };
}

function isSameColorIn(
  state: Object,
  coordinates: Cell,
  color: ColorIndex,
): boolean {
  const { chunks } = state.canvas;
  const [cx, cy] = getChunkOfPixel(coordinates);
  const key = ChunkRGB.getKey(cx, cy);
  const chunk = chunks.get(key);
  if (!chunk) {
    // estrenamos chunk!
    return color === 0; // default color is white
  }

  // getColor
  return chunk.hasColorIn(
    getCellInsideChunk(coordinates),
    color,
  );
}

export function tryPlacePixel(
  coordinates: Cell,
  color: ?ColorIndex = null,
): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const selectedColor = (color === undefined || color === null)
      ? state.gui.selectedColor
      : color;

    if (!isSameColorIn(getState(), coordinates, selectedColor)) {
      dispatch(requestPlacePixel(coordinates, selectedColor));
    }
  };
}

export function tryPlacePixelWithConfirm(
  coordinates: Cell,
  color: ?ColorIndex = null,
): ThunkAction {
  const action = tryPlacePixel(coordinates, color);

  return (dispatch, getState) => {
    const { center } = getState().user;
    const waitingTime = getCoolDown(...coordinates, ...center);

    // if less tahn 5 minutes, do not ask
    if (waitingTime < 5 * 60 * 1000) {
      dispatch(action);
      return;
    }

    const [x, y] = coordinates;
    const text = `You are placing a pixel on (${x}, ${y}) and
      the cooldown here is ${durationToString(waitingTime)}`;

    swal({
      title: 'Are you sure?',
      text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, place it!',
      cancelButtonText: 'No, cancel please!',
      closeOnConfirm: true,
      closeOnCancel: true,
    })
    .then((isConfirm) => {
      if (isConfirm) dispatch(action);
    })
    .catch(swal.noop);
  };
}


export function setView(view: Cell): Action {
  return {
    type: 'SET_VIEW',
    view,
  };
}

export function move([dx, dy]: Cell): ThunkAction {
  return (dispatch, getState) => {
    const { view } = getState().canvas;

    const [x, y] = view;
    dispatch(setView([x + dx, y + dy]));
  };
}

export function moveDirection([vx, vy]: Cell): ThunkAction {
  // TODO check direction is unitary vector
  return (dispatch, getState) => {
    const { scale } = getState().canvas;

    const speed = 100.0 / scale;
    dispatch(move([speed * vx, speed * vy]));
  };
}

export function moveNorth(): ThunkAction {
  return (dispatch) => {
    dispatch(moveDirection([0, -1]));
  };
}

export function moveWest(): ThunkAction {
  return (dispatch) => {
    dispatch(moveDirection([-1, 0]));
  };
}

export function moveSouth(): ThunkAction {
  return (dispatch) => {
    dispatch(moveDirection([0, 1]));
  };
}

export function moveEast(): ThunkAction {
  return (dispatch) => {
    dispatch(moveDirection([1, 0]));
  };
}


export function setScale(scale: number): Action {
  return {
    type: 'SET_SCALE',
    scale,
  };
}

export function zoomIn(): ThunkAction {
  return (dispatch, getState) => {
    const { scale } = getState().canvas;
    dispatch(setScale(scale * 1.1));
  };
}

export function zoomOut(): ThunkAction {
  return (dispatch, getState) => {
    const { scale } = getState().canvas;
    dispatch(setScale(scale / 1.1));
  };
}


export function receiveChunkBuffer(
  cell: Cell,
  chunkBuffer: Uint8Array,
): Action {
  return {
    type: 'RECEIVE_CHUNK_BUFFER',
    cell,
    chunkBuffer,
  };
}


function requestBigChunk(center: Cell): Action {
  return {
    type: 'REQUEST_BIG_CHUNK',
    center,
  };
}

function receiveBigChunk(
  center: Cell,
  arrayBuffer: ArrayBuffer,
): Action {
  return {
    type: 'RECEIVE_BIG_CHUNK',
    center,
    arrayBuffer,
  };
}

function receiveBigChunkFailure(error: Error): Action {
  return {
    type: 'RECEIVE_BIG_CHUNK_FAILURE',
    error,
  };
}

export function fetchBigChunk(center: Cell): PromiseAction {
  const [cx, cy] = center;

  return async (dispatch) => {
    dispatch(requestBigChunk(center));
    try {
      const url = `/api/bigchunk/${cx}.${cy}.bmp`;
      const response = await fetch(url);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        dispatch(receiveBigChunk(center, arrayBuffer));
      } else {
        const error = new Error('Network response was not ok.');
        dispatch(receiveBigChunkFailure(error));
      }
    } catch (error) {
      dispatch(receiveBigChunkFailure(error));
    }
  };
}


export function receivePixelUpdate(
  x: number,
  y: number,
  color: ColorIndex,
): Action {
  return {
    type: 'RECEIVE_PIXEL_UPDATE',
    x,
    y,
    color,
  };
}


function receiveOnline(online: number): Action {
  return {
    type: 'RECEIVE_ONLINE',
    online,
  };
}

export function fetchOnline(): PromiseAction {
  return async (dispatch) => {
    // TODO
    // dispatch(requestOnline());
    try {
      const response = await fetch('/api/online');
      if (response.ok) {
        const { online } = await response.json();
        dispatch(receiveOnline(online));
      }
      // const error = new Error('Network response was not ok.');
      // TODO
      // dispatch(receiveBigChunkFailure(error));
    } catch (error) {
      // TODO
      // dispatch(receiveBigChunkFailure(error));
    }
  };
}

function receiveMe(
  id: string,
  name: string,
  center: Cell,
  fingerprint: string,
): Action {
  return {
    type: 'RECEIVE_ME',
    id,
    name,
    center,
    fingerprint,
  };
}

export function fetchMe(): PromiseAction {
  return async (dispatch) => {
    // TODO
    // dispatch(requestOnline());
    try {
      const fingerprint = await getFingerprint();

      ProtocolClient.fingerprint = fingerprint;
      ProtocolClient.connect();

      const body = JSON.stringify({
        fingerprint,
      });

      const startTime = Date.now();
      const response = await fetch('/api/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
        // https://github.com/github/fetch/issues/349
        credentials: 'include',
      });
      const endTime = Date.now();

      if (response.ok) {
        const { id, name, center, waitSeconds } = await response.json();

        const rtt = (endTime - startTime) / 2;
        const durationMs = waitSeconds ? (1000 * waitSeconds) - rtt : null;

        dispatch(receiveMe(id, name, center, fingerprint));
        dispatch(setWait(durationMs));
      }
      // const error = new Error('Network response was not ok.');
      // TODO
      // dispatch(receiveBigChunkFailure(error));
    } catch (error) {
      // TODO
      // dispatch(receiveBigChunkFailure(error));
    }
  };
}

function setCoolDown(coolDown): Action {
  return {
    type: 'COOLDOWN_SET',
    coolDown,
  };
}

function endCoolDown(): Action {
  return {
    type: 'COOLDOWN_END',
  };
}

function getPendingActions(state): Array<Action> {
  const actions = [];

  const { wait } = state.user;
  if (wait === null || wait === undefined) return actions;

  const coolDown = wait - Date.now();

  if (coolDown > 0) actions.push(setCoolDown(coolDown));
  else actions.push(endCoolDown());

  return actions;
}

export function initTimer(): ThunkAction {
  return (dispatch, getState) => {
    function tick() {
      const state = getState();
      const actions = getPendingActions(state);
      dispatch(actions);
    }

    // something shorter than 1000 ms
    setInterval(tick, 333);
  };
}

export function showModal(modalType: string, modalProps: Object = {}): Action {
  return {
    type: 'SHOW_MODAL',
    modalType,
    modalProps,
  };
}

export function showSettingsModal(): Action {
  return showModal('SETTINGS');
}

export function showHelpModal(): Action {
  return showModal('HELP');
}

export function hideModal(): Action {
  return {
    type: 'HIDE_MODAL',
  };
}
