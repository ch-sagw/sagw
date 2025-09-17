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
    // 1. Small enough → just show all
    if (totalPages <= maxButtons + 2) {
      return Array.from({
        length: totalPages,
      }, (_, i) => i + 1);
    }

    const pages: (number | 'filler')[] = [];

    // reserve for first + last
    const windowSize = maxButtons - 2;
    const half = Math.floor(windowSize / 2);

    let start = currentPage - half;
    let end = currentPage + half;

    // 2. Clamp window
    if (start < 2) {
      start = 2;
      end = start + windowSize - 1;
    }
    if (end > totalPages - 1) {
      end = totalPages - 1;
      start = end - windowSize + 1;
    }

    // 3. Always first
    pages.push(1);

    // 4. Filler before
    if (start > 2) {
      if (start === 3) {

        // no filler if gap == 1
        pages.push(2);
      } else {
        pages.push('filler');
      }
    }

    // 5. Middle window
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // 6. Filler after
    if (end < totalPages - 1) {
      if (end === totalPages - 2) {

        // no filler if gap == 1
        pages.push(totalPages - 1);
      } else {
        pages.push('filler');
      }
    }

    // 7. Always last
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
