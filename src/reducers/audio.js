/* @flow */

import type { Action } from '../actions/types';


export type AudioState = {
  mute: boolean,
};

const initialState: AudioState = {
  mute: false,
};


export default function audio(
  state: AudioState = initialState,
  action: Action,
): AudioState {
  switch (action.type) {

    case 'TOGGLE_MUTE':
      return {
        ...state,
        // TODO error prone
        mute: !state.mute,
      };

    default:
      return state;
  }
}
