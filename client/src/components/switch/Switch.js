import React from 'react';

import './Switch.css';

export default function Switch(props) {
  let is_checked = props.checked;

  function onChange() {
    is_checked = !is_checked;
    props.onCheck(!props.checked);
  }

  return (
    <label className="switch">
      <input type="checkbox" checked={is_checked} onChange={onChange}/>
      <span className="slider"></span>
    </label>
  );
}