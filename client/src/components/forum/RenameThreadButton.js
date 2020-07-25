import React, { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';

import EditIcon from '../icon/EditIcon';
import InputModal from '../modal/InputModal';

import '../../Forum.css';

function RenameThreadButton(props) {
  const [showPanel, setShowPanel] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);

  function onConfirm(value) {
    props.onConfirm(value);
    setShowPanel(false);
  }

  if(isAuthenticated && (props.author_id===user.id || user.is_moderator)) {
    return (
      <Fragment>
        <span className='thread-rename' onClick={() => setShowPanel(true)}>
          <EditIcon></EditIcon>
        </span>
        <InputModal show={showPanel} title='Rename thread' value={props.value} onConfirm={onConfirm} onCancel={() => setShowPanel(false)}></InputModal>
      </Fragment>
    );
  } else {
    return null;
  }
}

export default RenameThreadButton;