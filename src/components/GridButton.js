/**
 * Created by arkeros on 31/5/17.
 *
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';
import FaTh from 'react-icons/lib/fa/th';

import FloatingActionButton from './FloatingActionButton';
import { toggleGrid } from '../actions';


const GridButton = ({ onToggleGrid }) => (
  <FloatingActionButton onClick={onToggleGrid}>
    <FaTh />
  </FloatingActionButton>
);

// TODO simplify...
function mapStateToProps(state: State) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    open() {
      dispatch(toggleGrid());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GridButton);
