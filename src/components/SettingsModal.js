/**
 * Created by arkeros on 7/7/17.
 *
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';

import Modal from './Modal';
import MdToggleButtonHover from './MdToggleButtonHover';
import {
  toggleGrid,
  toggleMute,
  toggleAutoZoomIn,
} from '../actions';

import type { State } from '../reducers';


const flexy = {
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  flexWrap: 'nowrap',
  boxSizing: 'border-box',
  flex: '1 1 auto',
};

const itemStyles = {
  ...flexy,
  flexDirection: 'column',
  marginBottom: 20,
};

const titleStyles = {
  flex: '1 1 auto',
  marginLeft: 0,
  marginRight: 10,
  color: '#4f545c',
  overflow: 'hidden',
  wordWrap: 'break-word',
  lineHeight: '24px',
  fontSize: 16,
  fontWeight: 500,
  marginTop: 0,
  marginBottom: 0,
};

const rowStyles = {
  ...flexy,
  flexDirection: 'row',
};

const descriptionStyle = {
  boxSizing: 'border-box',
  flex: '1 1 auto',
  color: 'hsla(218, 5%, 47%, .6)',
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
  marginTop: 4,
};

const dividerStyles = {
  boxSizing: 'border-box',
  marginTop: 20,
  height: 1,
  width: '100%',
  backgroundColor: 'hsla(216, 4%, 74%, .3)',
};


const SettingsItem = ({ title, description, keyBind, value, onToggle }) => (
  <div style={itemStyles}>
    <div style={rowStyles}>
      <h3 style={titleStyles}>{title} {keyBind && <kbd>{keyBind}</kbd>}</h3>
      <MdToggleButtonHover value={value} onToggle={onToggle} />
    </div>
    {description && <div style={descriptionStyle}>{description} </div>}
    <div style={dividerStyles} />
  </div>
);

function SettingsModal({
  isMuted,
  isGridShown,
  onMute,
  autoZoomIn,
  onToggleGrid,
  onToggleAutoZoomIn,
}) {
  return (
    <Modal title="Settings">
      <SettingsItem
        title="Show Grid"
        description="Turn on grid to highlight pixel borders."
        keyBind="G"
        value={isGridShown}
        onToggle={onToggleGrid}
      />
      <SettingsItem
        title="Disable Sounds"
        description="All sound effects will be disabled."
        keyBind="M"
        value={isMuted}
        onToggle={onMute
        } />
      <SettingsItem
        title="Auto Zoom In"
        description="Zoom in instead of placing a pixel when you tap the canvas and your zoom is small."
        value={autoZoomIn}
        onToggle={onToggleAutoZoomIn}
      />
    </Modal>
  );
}

function mapStateToProps(state: State) {
  const { mute } = state.audio;
  const { showGrid, autoZoomIn } = state.gui;
  const isMuted = mute;
  const isGridShown = showGrid;
  return { isMuted, isGridShown, autoZoomIn };
}

function mapDispatchToProps(dispatch) {
  return {
    onMute() {
      dispatch(toggleMute());
    },
    onToggleGrid() {
      dispatch(toggleGrid());
    },
    onToggleAutoZoomIn() {
      dispatch(toggleAutoZoomIn());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
