/* @flow */

import type { Cell } from '../core/Cell';
import type { ColorIndex } from '../core/Color';
import type { State } from '../reducers';


export type Action =
    { type: 'LOGGED_OUT' }
  // my actions
  | { type: 'TOGGLE_GRID' }
  | { type: 'TOGGLE_AUTO_ZOOM_IN' }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SET_HOVER', hover: Cell }
  | { type: 'UNSET_HOVER' }
  | { type: 'SET_WAIT', wait: ?number }
  | { type: 'COOLDOWN_END' }
  | { type: 'COOLDOWN_SET', coolDown: number }
  | { type: 'SELECT_COLOR', color: ColorIndex }
  | { type: 'PLACE_PIXEL', coordinates: Cell, color: ColorIndex, wait: string }
  | { type: 'SET_VIEW', view: Cell }
  | { type: 'SET_SCALE', scale: number }
  | { type: 'RECEIVE_CHUNK_BUFFER', cell: Cell, chunkBuffer: Uint8Array }
  | { type: 'REQUEST_BIG_CHUNK', center: Cell }
  | { type: 'RECEIVE_BIG_CHUNK', center: Cell, arrayBuffer: ArrayBuffer }
  | { type: 'RECEIVE_BIG_CHUNK_FAILURE', error: Error }
  | { type: 'RECEIVE_PIXEL_UPDATE', x: number, y: number, color: ColorIndex }
  | { type: 'RECEIVE_ONLINE', online: number }
  | { type: 'RECEIVE_ME', id: string, name: string, center: Cell, fingerprint: string }
  | { type: 'SHOW_MODAL', modalType: string, modalProps: obj }
  | { type: 'HIDE_MODAL' }
  ;


export type PromiseAction = Promise<Action>;
export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
