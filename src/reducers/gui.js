/* @flow */

import type { Action } from '../actions/types';
import type { ColorIndex } from '../core/Color';
import type { Cell } from '../core/Cell';


export type GUIState = {
  showGrid: boolean,
  selectedColor: ColorIndex,
  hover: ?Cell,
  pixelsPlaced: number,
  autoZoomIn: boolean,
};

const initialState: GUIState = {
  showGrid: false,
  selectedColor: 3,
  hover: null,
  pixelsPlaced: 0,
  autoZoomIn: true,
};


export default function gui(
  state: GUIState = initialState,
  action: Action,
): GUIState {
  switch (action.type) {

    case 'TOGGLE_GRID': {
      return {
        ...state,
        showGrid: !state.showGrid,
      };
    }

    case 'TOGGLE_AUTO_ZOOM_IN': {
      return {
        ...state,
        autoZoomIn: !state.autoZoomIn,
      };
    }

    case 'SELECT_COLOR': {
      return {
        ...state,
        selectedColor: action.color,
      };
    }

    case 'SET_HOVER': {
      const { hover } = action;
      return {
        ...state,
        hover,
      };
    }

    // clear hover when placing a pixel
    // fixes a bug with iPad
    case 'PLACE_PIXEL': {
      let { pixelsPlaced } = state;
      pixelsPlaced += 1;
      return {
        ...state,
        hover: null,
        pixelsPlaced,
      };
    }

    case 'UNSET_HOVER': {
      return {
        ...state,
        hover: null,
      };
    }

    default:
      return state;
  }
}
