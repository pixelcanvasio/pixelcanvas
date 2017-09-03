/**
 * Created by arkeros on 1/6/17.
 *
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';

import Box from './Box';
import { selectColor } from '../actions';
import { COLORS } from '../core/Color';

import type { State } from '../reducers';


const colorStyles = {
  display: 'block',
  width: '2em',
  height: '2em',
  zIndex: 1,
  cursor: 'pointer',
  margin: 0,
  padding: 0,
};

const ColorItem = ({ color, onClick, className }) => (
  <span className={className} style={{ ...colorStyles, backgroundColor: color }} onClick={onClick} />
);

// TODO stop using em
/* http://stackoverflow.com/questions/1776915/how-to-center-absolutely-positioned-element-in-div */
const styles = {
  position: 'absolute',
  bottom: '1em',
  left: 0,
  right: 0,
  marginLeft: 'auto',
  marginRight: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  width: '16em',
  height: '4em',
  lineHeight: 0,
  padding: 5,
  borderRadius: 4,
};

const Palette = ({ selectedColor, select }) => (
  <Box id="colors" style={styles}>
    {COLORS.map((color, index) => (<ColorItem
      key={index}
      className={selectedColor === index ? 'selected' : ''}
      color={color}
      onClick={() => select(index)}
    />),
    )}
  </Box>
);

function mapStateToProps(state: State) {
  const { selectedColor } = state.gui;
  return { selectedColor };
}

function mapDispatchToProps(dispatch) {
  return {
    select(color) {
      dispatch(selectColor(color));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Palette);
