/**
 * Created by arkeros on 7/7/17.
 *
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';
import FaCog from 'react-icons/lib/fa/cog';

import FloatingActionButton from './FloatingActionButton';
import { showSettingsModal } from '../actions';

import type { State } from '../reducers';


const SettingsButton = ({ open }) => (
  <FloatingActionButton onClick={open}>
    <FaCog />
  </FloatingActionButton>
);

// TODO simplify...
function mapStateToProps(state: State) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    open() {
      dispatch(showSettingsModal());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsButton);
