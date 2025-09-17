import React, { Fragment } from 'react';
import styles from '@/components/base/Pagination/Pagination.module.scss';
import { PaginationItem } from '../PaginationItem/PaginationItem';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export type InterfacePaginationPropTypes = {
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: InterfacePaginationPropTypes): React.JSX.Element => {
  const bp = useBreakpoint();

  if (totalPages < 2) {
    return <Fragment></Fragment>;
  }

  /* eslint-disable sort-keys */
  const maxNumberOfButtons: Record<typeof bp, number> = {
    zero: 3,
    micro: 5,
    small: 5,
    medium: 7,
    large: 7,
    wide: 9,
    ultra: 9,
  };

  const maxButtons = maxNumberOfButtons[bp];

  const getPages = (): (number | 'filler')[] => {
    const totalNumberButtons = Math.min(totalPages, maxButtons);

    // If total pages fit within number buttons → show all
    if (totalPages <= totalNumberButtons) {
      return Array.from({
        length: totalPages,
      }, (_, i) => i + 1);
    }

    const pages: (number | 'filler')[] = [];

    // reserve for first + last
    const windowSize = totalNumberButtons - 2;
    const half = Math.floor(windowSize / 2);

    let start = currentPage - half;
    let end = currentPage + half;

    // Clamp window
    if (start < 2) {
      start = 2;
      end = start + windowSize - 1;
    }
    if (end > totalPages - 1) {
      end = totalPages - 1;
      start = end - windowSize + 1;
    }

    // Always first
    pages.push(1);

    // Filler before
    if (start > 2) {
      pages.push('filler');
    }

    // Middle window
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Filler after
    if (end < totalPages - 1) {
      pages.push('filler');
    }

    // Always last
    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <div
      className={styles.pagination}
    >
      {pages.map((p, idx) => (p === 'filler'
        ? (
          <PaginationItem key={`f-${idx}`} type='filler' />
        )
        : (
          <PaginationItem
            key={p}
            type='number'
            number={p}
            active={p === currentPage}
            onClick={() => onPageChange?.(p)}
          />
        )))}
    </div>
  );

};
