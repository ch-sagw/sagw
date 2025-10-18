'use client';

import React, { Fragment } from 'react';
import styles from '@/components/base/Pagination/Pagination.module.scss';
import { PaginationItem } from '../PaginationItem/PaginationItem';
import { usePaginationMeasurements } from '@/hooks/usePaginationMeasurements';

export type InterfacePaginationPropTypes = {
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
  paginationTitle: string;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  paginationTitle,
}: InterfacePaginationPropTypes): React.JSX.Element => {
  const {
    measurements,
  } = usePaginationMeasurements();

  if (totalPages < 2) {
    return <Fragment></Fragment>;
  }

  const getPagesWithoutFillers = (maxItems: number): number[] => {
    if (maxItems === 1) {
      return [currentPage];
    }

    if (maxItems === 2) {
      // Show current and next page
      if (currentPage < totalPages) {
        return [
          currentPage,
          currentPage + 1,
        ];
      }

      return [
        currentPage - 1,
        currentPage,
      ];
    }

    if (maxItems === 3) {
      // Show current, current+1, and last page
      if (currentPage < totalPages) {
        return [
          currentPage,
          currentPage + 1,
          totalPages,
        ];
      }

      return [
        currentPage - 1,
        currentPage,
        totalPages,
      ];
    }

    if (maxItems === 4) {
      // Show current-1, current, current+1, and last page
      if (currentPage > 1 && currentPage < totalPages) {
        return [
          currentPage - 1,
          currentPage,
          currentPage + 1,
          totalPages,
        ];
      }
      if (currentPage === 1) {
        return [
          currentPage,
          currentPage + 1,
          currentPage + 2,
          totalPages,
        ];
      }

      return [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        totalPages,
      ];
    }

    if (maxItems === 5) {
      // Show first page, current-1, current, current+1, and last page
      if (currentPage > 1 && currentPage < totalPages) {
        return [
          1,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          totalPages,
        ];
      }
      if (currentPage === 1) {
        return [
          1,
          currentPage + 1,
          currentPage + 2,
          currentPage + 3,
          totalPages,
        ];
      }

      return [
        1,
        currentPage - 3,
        currentPage - 1,
        currentPage,
        totalPages,
      ];
    }

    if (maxItems === 6) {
      // Show first page, current-1, current, current+1, current+2,
      // and last page
      if (currentPage > 1 && currentPage < totalPages - 1) {
        return [
          1,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2,
          totalPages,
        ];
      }
      if (currentPage === 1) {
        return [
          1,
          currentPage + 1,
          currentPage + 2,
          currentPage + 3,
          currentPage + 4,
          totalPages,
        ];
      }
      if (currentPage === totalPages) {
        return [
          1,
          currentPage - 4,
          currentPage - 2,
          currentPage - 1,
          currentPage,
          totalPages,
        ];
      }

      return [
        1,
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        totalPages,
      ];
    }

    return [currentPage];
  };

  const getPagesWithFillers = (maxItems: number): (number | 'filler')[] => {
    const pages: (number | 'filler')[] = [];

    // Always show first page
    pages.push(1);

    // Calculate how many middle pages we can show
    // We need:
    // 1 (first) + 1 (filler) + X (middle) + 1 (filler) + 1 (last) = maxItems
    // So X = maxItems - 4
    const middlePages = maxItems - 4;

    if (middlePages <= 0) {
      // Fallback if not enough space
      return [
        1,
        'filler',
        currentPage,
        'filler',
        totalPages,
      ];
    }

    // Calculate the range around current page
    const halfMiddle = Math.floor(middlePages / 2);
    let start = Math.max(2, currentPage - halfMiddle);
    const end = Math.min(totalPages - 1, start + middlePages - 1);

    // Adjust if we hit the end boundary
    if (end === totalPages - 1) {
      start = Math.max(2, end - middlePages + 1);
    }

    // Add filler before middle pages if needed
    if (start > 2) {
      pages.push('filler');
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add filler after middle pages if needed
    if (end < totalPages - 1) {
      pages.push('filler');
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const getPages = (): (number | 'filler')[] => {
    const {
      maxItems,
    } = measurements;

    // If everything fits -> show all pages
    if (totalPages <= maxItems) {
      return Array.from({
        length: totalPages,
      }, (_, i) => i + 1);
    }

    // If 7 or more items fit, use fillers logic
    if (maxItems >= 7) {
      return getPagesWithFillers(maxItems);
    }

    // If 6 or fewer items fit, use no-fillers logic
    return getPagesWithoutFillers(maxItems);
  };

  const pages = getPages();

  return (
    <nav
      className={styles.pagination}
      aria-labelledby='pagination'
    >
      <h2
        id='pagination'
        className={styles.hiddenTitle}
      >
        {paginationTitle}
      </h2>

      <ol className={styles.list}>
        {pages.map((p, key) => (p === 'filler'
          ? (
            <li key={`filler-${key}`}>
              <PaginationItem type='filler' />
            </li>
          )
          : (
            <li key={`page-${p}`}>
              <PaginationItem
                type='number'
                number={p}
                active={p === currentPage}
                onClick={() => onPageChange?.(p)}
              />
            </li>
          )))}
      </ol>
    </nav>
  );

};
