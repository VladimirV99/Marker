import React, { Component } from 'react';

import PaginationItem from './PaginationItem';

import './Pagination.css';

class Pagination extends Component {
  render() {
    let { currentPage, totalPages, displayPages, onPageChange } = this.props;

    if(totalPages<=1)
      return null;

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
        { currentPage!==1 ? <PaginationItem onPageChange={onPageChange} page={1}>First</PaginationItem> : null }
        { currentPage!==1 ? <PaginationItem onPageChange={onPageChange} page={currentPage-1}>Prev</PaginationItem> : null }
        
        {pages.map(page => (
          <PaginationItem key={page} onPageChange={onPageChange} page={page} selected={page===currentPage}>{page}</PaginationItem>
        ))}

        { currentPage!==totalPages ? <PaginationItem onPageChange={onPageChange} page={currentPage+1}>Next</PaginationItem> : null }
        { currentPage!==totalPages ? <PaginationItem onPageChange={onPageChange} page={totalPages}>Last</PaginationItem> : null }
      </ul>
    );
  }
}

export default Pagination;