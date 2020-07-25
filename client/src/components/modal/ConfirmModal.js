import React from 'react';

import '../../Form.css';
import './Modal.css';

function Modal(props) {
  let wrapperRef;

  function handleClickOutside(event) {
    if (wrapperRef && !wrapperRef.contains(event.target)) {
      props.onDeny();
    }
  }

  function onConfirm(event) {
    event.preventDefault();
    props.onConfirm();
  }

  function onDeny(event) {
    event.preventDefault();
    props.onDeny();
  }

  const showHideClassName = props.show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName} onClick={handleClickOutside}>
      <section ref={node => wrapperRef = node} className='modal-main'>
        <div className='modal-header'>
          <h2>{props.title}</h2>
        </div>
        <div className='modal-content'>
          {props.children}
        </div>
        <div className='modal-menu'>
          <button className='btn btn-yes modal-button' onClick={onConfirm}>Yes</button>
          <button className='btn btn-no modal-button' onClick={onDeny}>No</button>
        </div>
      </section>
    </div>
  );
}

export default Modal