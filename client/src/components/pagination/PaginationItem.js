import React from 'react';

export default function PaginationItem(props) {
  function handleClick(event) {
    event.preventDefault();
    if(!props.selected)
      props.onPageChange(props.page);
  }

  return <li className={`pagination-item ${props.selected? 'pagination-selected': ''}`} onClick={handleClick}>{props.children}</li>
}