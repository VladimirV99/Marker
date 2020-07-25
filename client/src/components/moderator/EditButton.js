import React, { useState } from 'react';

import EditIcon from '../icon/EditIcon';
import InputModal from '../modal/InputModal';

import '../../Forum.css';

function EditButton(props) {
  const [showPanel, setShowPanel] = useState(false);

  function onConfirm(value) {
    props.onConfirm(value);
    setShowPanel(false);
  }

  return (
    <div className='option'>
      <span className='option-edit' onClick={() => setShowPanel(true)}>
        <EditIcon></EditIcon>
      </span>
      <InputModal show={showPanel} validate={props.validate} validator={props.validator} title={props.title} value={props.value} onConfirm={onConfirm} onCancel={() => setShowPanel(false)}></InputModal>
    </div>
  );
}

export default EditButton;