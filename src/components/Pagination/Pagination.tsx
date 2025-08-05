import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = currentPage - half;
      let end = currentPage + half;

      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      }

      if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisiblePages + 1;
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.navButton}
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          disabled={page === '...'}
          className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.navButton}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
