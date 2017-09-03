/**
 * Created by arkeros on 1/6/17.
 *
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';
import FaUser from 'react-icons/lib/fa/user';

import Box from './Box';
import type { State } from '../reducers';


const CoordinatesBox = ({ online }) => (
  <Box style={{ whiteSpace: 'nowrap' }}>{online} <FaUser /></Box>
);

function mapStateToProps(state: State) {
  const { online } = state.user;
  return { online };
}

export default connect(mapStateToProps)(CoordinatesBox);
