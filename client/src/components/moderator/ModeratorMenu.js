import React from 'react';
import { useSelector } from 'react-redux';

import EditButton from './EditButton';
import DeleteButton from './DeleteButton';

import './ModeratorMenu.css';

function ModeratorMenu(props) {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  let renameTitle = `Rename ${props.type}`;
  let deleteTitle = 'Confirm delete';
  let deleteContent = `Are you sure you want to delete this ${props.type}?`;

  if(isAuthenticated && user.is_moderator) {
    return (
      <div className='moderator-menu'>
        <EditButton title={renameTitle} value={props.value} onConfirm={value => props.onRename(value)}></EditButton>
        <DeleteButton title={deleteTitle} content={deleteContent} onConfirm={props.onDelete} />
      </div>
    )
  } else {
    return null;
  }
}

export default ModeratorMenu;