import React, { useState, Fragment } from 'react';

import ConfirmModal from '../modal/ConfirmModal';

import '../../Forum.css';
import { useSelector } from 'react-redux';

function DeleteButton(props) {
  const [showPanel, setShowPanel] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);

  function onConfirm() {
    props.onConfirm();
    setShowPanel(false);
  }

  if(isAuthenticated && (props.author_id===user.id || user.is_moderator)) {
    return (
      <Fragment>
        <span className='post-delete' onClick={() => setShowPanel(true)}>&times;</span>
        <ConfirmModal show={showPanel} title={'Delete post'} onConfirm={onConfirm} onDeny={() => setShowPanel(false)}>
          Are you sure you want to delete this post?
        </ConfirmModal>
      </Fragment>
    );
  } else {
    return null;
  }
}

export default DeleteButton;