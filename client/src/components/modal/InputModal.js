import React, { useState } from 'react';

import ValidationBlock from '../validation/ValidationBlock';

import '../../Form.css';
import './Modal.css';

function Modal(props) {
  const [content, setContent] = useState(props.value);
  const [content_validation, setContentValidation] = useState([]);
  const [content_error, setContentError] = useState(false);

  let wrapperRef;

  function setWrapperRef(node) {
    wrapperRef = node;
  }

  function handleClickOutside(event) {
    if (wrapperRef && !wrapperRef.contains(event.target)) {
      props.onCancel();
    }
  }

  function onChange(event) {
    if(props.validate) {
      const res = props.validator(event.target.value);
      setContent(event.target.value);
      setContentValidation(res.validation);
      setContentError(res.error);
    } else {
      setContent(event.target.value);
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

  const canSubmit = content && !content_error;

  return (
    <div className={showHideClassName} onClick={handleClickOutside}>
      <section ref={setWrapperRef} className='modal-main'>
        <div className='modal-header'>
          <h2>{props.title}</h2>
        </div>
        <div className='modal-content'>
          <input type='text' className='form-control' name='content' value={content} onChange={onChange}></input>
          {props.validate? <ValidationBlock validations={content_validation}></ValidationBlock> : null}
        </div>
        <div className='modal-menu'>
          <button disabled={!canSubmit} className='btn btn-confirm modal-button' onClick={onConfirm}>Confirm</button>
          <button className='btn btn-cancel modal-button' onClick={onCancel}>Cancel</button>
        </div>
      </section>
    </div>
  );
}

export default Modal