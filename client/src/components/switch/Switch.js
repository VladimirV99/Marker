import React from 'react';

import './Switch.css';

export default function Switch(props) {
  return (
    <label className="switch">
      <input type="checkbox" checked={props.checked} onChange={props.onChecked}/>
      <span className="slider"></span>
    </label>
  );
}