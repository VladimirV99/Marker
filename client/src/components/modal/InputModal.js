import React, { useState } from 'react';

import '../../Form.css';
import './Modal.css';

function Modal(props) {
  const [content, setContent] = useState(props.value);

  let wrapperRef;

  function setWrapperRef(node) {
    wrapperRef = node;
  }

  function handleClickOutside(event) {
    if (wrapperRef && !wrapperRef.contains(event.target)) {
      props.onCancel();
    }
  }

  function onConfirm(event) {
    event.preventDefault();
    props.onConfirm(content);
  }

  function onCancel(event) {
    event.preventDefault();
    props.onCancel();
  }

  const showHideClassName = props.show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName} onClick={handleClickOutside}>
      <section ref={setWrapperRef} className='modal-main'>
        <div className='modal-header'>
          <h2>{props.title}</h2>
        </div>
        <div className='modal-content'>
          <input type='text' className='form-control' name='content' value={content} onChange={e => setContent(e.target.value)}></input>
        </div>
        <div className='modal-menu'>
          <button className='btn btn-confirm modal-button' onClick={onConfirm}>Confirm</button>
          <button className='btn btn-cancel modal-button' onClick={onCancel}>Cancel</button>
        </div>
      </section>
    </div>
  );
}

export default Modal