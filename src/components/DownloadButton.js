/**
 * Created by arkeros on 31/5/17.
 *
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';
import MdFileDownload from 'react-icons/lib/md/file-download';
import fileDownload from 'react-file-download';
import moment from 'moment';

import FloatingActionButton from './FloatingActionButton';

import type { State } from '../reducers';


/**
 * https://jsfiddle.net/AbdiasSoftware/7PRNN/
 */
function download(view) {
  // TODO id shouldnt be hardcoded
  const $viewport = document.getElementById('gameWindow');
  if (!$viewport) return;

  // TODO change name

  const [x, y] = view.map(Math.round);
  const now = moment.utc(Date.now()).format();
  const filename = `pixelcanvas.io (${x},${y}) ${now}.png`;

  $viewport.toBlob((blob) => fileDownload(blob, filename));
}


const DownloadButton = ({ view }) => (
  <FloatingActionButton onClick={() => download(view)}>
    <MdFileDownload />
  </FloatingActionButton>
);

// TODO optimize
function mapStateToProps(state: State) {
  const { view } = state.canvas;
  return { view };
}

export default connect(mapStateToProps)(DownloadButton);
