/* @flow */

import { combineReducers } from 'redux';
import audio from './audio';
import canvas from './canvas';
import gui from './gui';
import modal from './modal';
import user from './user';

import type { AudioState } from './audio';
import type { CanvasState } from './canvas';
import type { GUIState } from './gui';
import type { ModalState } from './modal';
import type { UserState } from './user';

export type State = {
  audio: AudioState,
  canvas: CanvasState,
  gui: GUIState,
  modal: ModalState,
  user: UserState,
};

export default combineReducers({
  audio,
  canvas,
  gui,
  modal,
  user,
});
