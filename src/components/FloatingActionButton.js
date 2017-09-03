/**
 * Created by arkeros on 31/5/17.
 *
 * @flow
 */

import React from 'react';


const SIZE = 42;

const FloatingActionButton = ({ onClick, children }) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      color: '#fafafa',
      textAlign: 'center',
      verticalAlign: 'text-bottom',
      cursor: 'pointer',
      lineHeight: `${SIZE}px`,
      width: SIZE,
      height: SIZE,
      borderRadius: SIZE / 2,
      padding: 0,
    }}
  >
    {children}
  </div>
);

export default FloatingActionButton;
