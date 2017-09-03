/**
 * Created by arkeros on 31/5/17.
 *
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';
import FaQuestion from 'react-icons/lib/fa/question';

import FloatingActionButton from './FloatingActionButton';
import { showHelpModal } from '../actions';


const HelpButton = ({ open }) => (
  <FloatingActionButton onClick={open}>
    <FaQuestion />
  </FloatingActionButton>
);

// TODO simplify...
function mapStateToProps(state: State) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    open() {
      dispatch(showHelpModal());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpButton);
