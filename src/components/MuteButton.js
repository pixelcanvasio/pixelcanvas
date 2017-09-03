/**
 * Created by arkeros on 31/5/17.
 *
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';
import FaVolumeUp from 'react-icons/lib/fa/volume-up';
import FaVolumeOff from 'react-icons/lib/fa/volume-off';

import FloatingActionButton from './FloatingActionButton';
import { toggleMute } from '../actions';

import type { State } from '../reducers';


const MutteButton = ({ onMute, mute }) => (
  <FloatingActionButton onClick={onMute}>
    {mute ? <FaVolumeOff /> : <FaVolumeUp />}
  </FloatingActionButton>
);

function mapStateToProps(state: State) {
  const { mute } = state.audio;
  return { mute };
}

function mapDispatchToProps(dispatch) {
  return {
    onMute() {
      dispatch(toggleMute());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MutteButton);
