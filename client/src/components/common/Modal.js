import React from 'react';

import './Modal.css';

function Modal(props) {
  let wrapperRef;

  function setWrapperRef(node) {
    wrapperRef = node;
  }

  function handleClickOutside(event) {
    if (wrapperRef && !wrapperRef.contains(event.target)) {
      props.onDeny();
    }
  }

  const showHideClassName = props.show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName} onClick={handleClickOutside}>
      <section ref={setWrapperRef} className='modal-main'>
        <div className='modal-header'>
          <h2>{props.title}</h2>
        </div>
        <div className='modal-content'>
          {props.children}
        </div>
        <div className='modal-menu'>
          <button className='btn btn-success modal-button' onClick={props.onConfirm}>Yes</button>
          <button className='btn btn-danger modal-button' onClick={props.onDeny}>No</button>
        </div>
      </section>
    </div>
  );
}

export default Modal