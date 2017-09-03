/**
 * Created by arkeros on 1/6/17.
 *
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';

import Box from './Box';
import { screenToWorld } from '../core/utils';
import type { State } from '../reducers';


function renderCoordinates([x, y]: Cell): string {
  return `(${x}, ${y})`;
}

// TODO vaya chapuza, arreglalo un poco...
// TODO create viewport state
const CoordinatesBox = ({ state, view, hover }) => (
  <Box>{renderCoordinates(hover
    ? screenToWorld(state, document.getElementById('gameWindow'), hover)
    : view.map(Math.round))}</Box>
);

function mapStateToProps(state: State) {
  const { view } = state.canvas;
  const { hover } = state.gui;
  return { view, state, hover };
}

export default connect(mapStateToProps)(CoordinatesBox);
