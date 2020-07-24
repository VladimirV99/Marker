import React, { Fragment, useState } from 'react';

import Modal from '../common/Modal';

import '../../Forum.css';

function DeleteButton(props) {
  const [showPanel, setShowPanel] = useState(false);

  function onConfirm(event) {
    event.preventDefault();
    props.onConfirm();
    setShowPanel(false);
  }

  return (
    <Fragment>
      <span className='category-delete' onClick={() => setShowPanel(true)}>&times;</span>
      <Modal show={showPanel} title={props.title} onConfirm={onConfirm} onDeny={() => setShowPanel(false)}>
        {props.content}
      </Modal>
    </Fragment>
  );
}

export default DeleteButton;