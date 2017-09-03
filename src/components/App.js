/**
 * Created by arkeros on 31/5/17.
 *
 * @flow
 */

import React from 'react';
import MediaQuery from 'react-responsive';

import CoolDownBox from './CoolDownBox';
import CoordinatesBox from './CoordinatesBox';
import DownloadButton from './DownloadButton';
import HelpButton from './HelpButton';
import OnlineBox from './OnlineBox';
import Palette from './Palette';
import ReCaptcha from './ReCaptcha';
import SettingsButton from './SettingsButton';
import ModalRoot from './ModalRoot';


const position = 'absolute';
const left = '1em';
const right = left;

const App = () => (
  <div>
    <canvas id="gameWindow" />
    <div
      id="outstreamContainer"
      style={{
        position: 'fixed',
        display: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        zIndex: 9000,
      }}
    />
    <ReCaptcha />
    <CoolDownBox />
    <div style={{ position, left, top: '1em' }}><HelpButton /></div>
    <div style={{ position, right, top: '1em' }}><SettingsButton /></div>
    <div style={{ position, right, top: '4em' }}><DownloadButton /></div>
    <Palette />
    <MediaQuery maxWidth={480}>
      <div style={{ position, left, bottom: '9em' }}><OnlineBox /></div>
      <div style={{ position, left, bottom: '6em' }}><CoordinatesBox /></div>
    </MediaQuery>
    <MediaQuery minWidth={481}>
      <div style={{ position, left, bottom: '4em' }}><OnlineBox /></div>
      <div style={{ position, left, bottom: '1em' }}><CoordinatesBox /></div>
    </MediaQuery>
    <ModalRoot />
  </div>
);

export default App;
