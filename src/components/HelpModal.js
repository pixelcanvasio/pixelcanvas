/**
 * Created by arkeros on 10/7/17.
 *
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';
import FaFacebook from 'react-icons/lib/fa/facebook';
import FaTwitter from 'react-icons/lib/fa/twitter';
import FaRedditAlien from 'react-icons/lib/fa/reddit-alien';

import Modal from './Modal';
import { social, MIN_COOLDOWN, BLANK_COOLDOWN } from '../core/constants';

import type { State } from '../reducers';


const linkStyle = {
  textDecoration: 'none',
  color: '#428bca',
};

const logoStyle = {
  marginRight: '1em',
};

const titleStyle = {
  color: '#4f545c',
  marginLeft: 0,
  marginRight: 10,
  overflow: 'hidden',
  wordWrap: 'break-word',
  lineHeight: '24px',
  fontSize: 16,
  fontWeight: 500,
  // marginTop: 0,
  marginBottom: 0,
};

const textStyle = {
  color: 'hsla(218, 5%, 47%, .6)',
  fontSize: 14,
  fontWeight: 500,
  position: 'relative',
  textAlign: 'inherit',
  float: 'none',
  margin: 0,
  padding: 0,
  lineHeight: 'normal',
};

// TODO generalize
function renderCoordinates([x, y]: Cell): string {
  return `(${x}, ${y})`;
}

// TODO generalize
function getUrl([x, y]: Cell): string {
  return `/@${x},${y}`;
}


// TODO add telegram when react-icons adds them
const LoginModal = ({ center }) => (
  <Modal title="Welcome to PixelCanvas.io">
    <p style={{ textAlign: 'center' }}>
      <p style={textStyle}>Place color pixels on an infinite canvas with other players online!
        The cooldown is {(BLANK_COOLDOWN / 1000) | 0} seconds for new pixels, and {(MIN_COOLDOWN / 1000) | 0} seconds when you replace a pixel, plus a bonus
        factor based on the age of that pixel. Have fun <span role="img" aria-label="Smile">😄</span></p>

      <h3 style={titleStyle}>Controls</h3>
      <p style={textStyle}>Click a color in palette to select</p>
      <p style={textStyle}>Press <kbd>G</kbd> or <kbd>space</kbd> to toggle grid</p>
      <p style={textStyle}>Press <kbd>W</kbd>,<kbd>A</kbd>,<kbd>S</kbd>, <kbd>D</kbd> to move</p>
      <p style={textStyle}>Press <kbd>↑</kbd>,<kbd>←</kbd>,<kbd>↓</kbd>, <kbd>→</kbd> to move</p>
      <p style={textStyle}>Drag mouse to move</p>
      <p style={textStyle}>Scroll mouse wheel to zoom</p>
      <p style={textStyle}>Pinch to zoom (on touch devices)</p>
      <p style={textStyle}>Pan to move (on touch devices)</p>

      <h3 style={titleStyle}>Follow us!</h3>
      <a href={social.facebook} style={linkStyle}>
        <FaFacebook size={32} style={logoStyle} />
      </a>
      <a href={social.twitter} style={linkStyle}>
        <FaTwitter size={32} style={logoStyle} />
      </a>
      <a href={social.reddit} style={linkStyle}>
        <FaRedditAlien size={32} style={logoStyle} />
      </a>
      <a href={social.discord} style={linkStyle}>
        <img
          src="https://discordapp.com/assets/f8389ca1a741a115313bede9ac02e2c0.svg"
          alt="Discord"
          title="Discord"
          width={32}
          style={logoStyle}
        />
      </a>
    </p>
  </Modal>
);

function mapStateToProps(state: State) {
  const { center } = state.user;
  return { center };
}

export default connect(mapStateToProps)(LoginModal);
