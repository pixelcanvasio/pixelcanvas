/**
 * https://stackoverflow.com/questions/35623656/how-can-i-display-a-modal-dialog-in-redux-that-performs-asynchronous-actions/35641680#35641680
 *
 * @flow
 */

import type { Action } from '../actions/types';

export type ModalState = {
  modalType: ?string,
  modalProps: object,
};

const initialState: ModalState = {
  modalType: null,
  modalProps: {},
};


export default function modal(
  state: ModalState = initialState,
  action: Action,
): ModalState {
  switch (action.type) {

    // clear hover when placing a pixel
    // fixes a bug with iPad
    case 'SHOW_MODAL': {
      const { modalType, modalProps } = action;
      return {
        ...state,
        modalType,
        modalProps,
      };
    }

    case 'HIDE_MODAL':
      return initialState;

    default:
      return state;
  }
}
