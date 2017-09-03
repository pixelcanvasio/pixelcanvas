/**
 * Created by arkeros on 7/7/17.
 */

import React from 'react';
import MdToggleButton from './MdToggleButton';


const MdToggleButtonHover = ({ value, onToggle}) => (
  <MdToggleButton
    value={value}
    onToggle={onToggle}
    thumbStyle={{
      position: 'absolute',
      width: 30,
      height: 30,
      boxShadow: `0 0 2px rgba(0,0,0,.12),0 2px 4px rgba(0,0,0,.24)`,
      display: 'flex',
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    }}
    thumbStyleHover={{
      width: 32,
      height: 32,
    }}
    animateThumbStyleHover={(n) => ({
      boxShadow: `0 0 ${2 + (4 * n)}px rgba(0,0,0,.16),0 ${2 + (3 * n)}px ${4 + (8 * n)}px rgba(0,0,0,.32)`,
    })}
  />
);

export default MdToggleButtonHover;
