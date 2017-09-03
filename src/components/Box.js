/**
 * Created by arkeros on 1/6/17.
 *
 * @flow
 */

import React from 'react';

// TODo share common
const SIZE = 42;

const Box = ({ children, style, ...props }) => (
  <div
    {...props}
    style={{
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      color: '#fafafa',
      textAlign: 'center',
      verticalAlign: 'middle',
      lineHeight: `${SIZE}px`,
      width: 'auto',
      height: SIZE,
      borderRadius: SIZE / 2,
      padding: '0 1.5em',
      ...style,
    }}
  >
    {children}
  </div>
);

export default Box;
