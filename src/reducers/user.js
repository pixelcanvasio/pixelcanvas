/* @flow */

import type { Action } from '../actions/types';


export type UserState = {
  id: string,
  name: string,
  center: Cell,
  wait: ?Date,
  coolDown: ?number, // ms
  // TODO online no deberia ir aqui, deberia ir en stats guarro!
  online: ?number,
  fingerprint: string,
};

const initialState: UserState = {
  id: '',
  name: 'Loading...',
  center: [0, 0],
  wait: null,
  coolDown: null,
  online: null,
  fingerprint: '',
};

export default function user(
  state: UserState = initialState,
  action: Action,
): UserState {
  switch (action.type) {

    case 'COOLDOWN_SET': {
      const { coolDown } = action;
      return {
        ...state,
        coolDown,
      };
    }

    case 'COOLDOWN_END': {
      return {
        ...state,
        coolDown: null,
        wait: null,
      };
    }

    case 'SET_WAIT': {
      const { wait: duration } = action;

      const wait = duration ? new Date(Date.now() + duration) : null;

      return {
        ...state,
        wait,
      };
    }

    case 'RECEIVE_ONLINE': {
      const { online } = action;
      return {
        ...state,
        online,
      };
    }

    case 'RECEIVE_ME': {
      const {
        id,
        name,
        center,
        fingerprint,
      } = action;

      return {
        ...state,
        id,
        name,
        center,
        fingerprint,
      };
    }

    default:
      return state;
  }
}
