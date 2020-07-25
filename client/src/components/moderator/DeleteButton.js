import React, { useState } from 'react';

import ConfirmModal from '../modal/ConfirmModal';

import '../../Forum.css';

function DeleteButton(props) {
  const [showPanel, setShowPanel] = useState(false);

  function onConfirm() {
    props.onConfirm();
    setShowPanel(false);
  }

  return (
    <div className='option'>
      <span className='option-delete' onClick={() => setShowPanel(true)}>&times;</span>
      <ConfirmModal show={showPanel} title={props.title} onConfirm={onConfirm} onDeny={() => setShowPanel(false)}>
        {props.content}
      </ConfirmModal>
    </div>
  );
}

export default DeleteButton;