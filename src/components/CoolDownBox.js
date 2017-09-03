/**
 * Created by arkeros on 2/6/17.
 *
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';

import Box from './Box';
import {
  durationToString,
} from '../core/utils';
import type { State } from '../reducers';


// TODO stop using em
/* http://stackoverflow.com/questions/1776915/how-to-center-absolutely-positioned-element-in-div */
const styles = {
  position: 'absolute',
  top: '1em',
  width: '5em',
  padding: '0 1.5em',
  left: 0,
  right: 0,
  marginLeft: 'auto',
  marginRight: 'auto',
};

const CoolDownBox = ({ coolDown }) => (
  <Box style={{
    ...styles,
    display: (coolDown) ? 'block' : 'none',
  }}>
    {coolDown && durationToString(coolDown)}
  </Box>
);

function mapStateToProps(state: State) {
  const { coolDown } = state.user;
  return { coolDown };
}

export default connect(mapStateToProps)(CoolDownBox);
