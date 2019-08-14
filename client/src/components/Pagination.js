import React, { Component } from 'react';

import './Pagination.css';

class Pagination extends Component {
  render() {
    let { currentPage, totalPages, displayPages, onPageChange } = this.props;
    let startPage;
    let endPage;

    if(totalPages <= displayPages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - displayPages/2;
      if(startPage < 1)
        startPage = 1;

      endPage = startPage + displayPages;

      if(endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - displayPages;
      }
    }

    let pages = Array(endPage - startPage + 1);
    for(let i = 0; i < pages.length; i++) {
      pages[i] = startPage + i;
    }
    
    return (
      <ul className='pagination'>
        <li className={`pagination-item ${currentPage===1?'pagination-hidden':''}`} onClick={() => {onPageChange(1)}}>First</li>
        <li className={`pagination-item ${currentPage===1?'pagination-hidden':''}`} onClick={() => {onPageChange(currentPage-1)}}>Prev</li>
        
        {pages.map(page => (
          <li key={page} className={`pagination-item ${page===currentPage?'pagination-selected':''}`} onClick={() => {if(page!==currentPage) onPageChange(page)}}>{page}</li>
        ))}

        <li className={`pagination-item ${currentPage===totalPages?'pagination-hidden':''}`} onClick={() => {onPageChange(currentPage+1)}}>Next</li>
        <li className={`pagination-item ${currentPage===totalPages?'pagination-hidden':''}`} onClick={() => {onPageChange(totalPages)}}>Last</li>
      </ul>
    );
  }
}

export default Pagination;