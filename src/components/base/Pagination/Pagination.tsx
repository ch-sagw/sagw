'use client';

import React, { Fragment } from 'react';
import styles from '@/components/base/Pagination/Pagination.module.scss';
import { PaginationItem } from '../PaginationItem/PaginationItem';
import { useBreakpoint } from '@/hooks/useBreakpoint';

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
  const bp = useBreakpoint();

  if (totalPages < 2) {
    return <Fragment></Fragment>;
  }

  /* eslint-disable sort-keys */
  const maxNumberOfButtons: Record<typeof bp, number> = {
    zero: 4,
    micro: 4,
    small: 4,
    medium: 6,
    large: 5,
    wide: 7,
    ultra: 7,
  };

  const maxButtons = maxNumberOfButtons[bp];

  const buildPagesFromRange = (start: number, end: number): (number | 'filler')[] => {
    const pages: (number | 'filler')[] = [];

    pages.push(1);

    if (start > 2) {
      pages.push('filler');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push('filler');
    }

    pages.push(totalPages);

    return pages;
  };

  const getPages = (): (number | 'filler')[] => {

    // If everything fits -> show all pages
    if (totalPages <= maxButtons) {
      return Array.from({
        length: totalPages,
      }, (_, i) => i + 1);
    }

    // #####
    // Special small-viewport behavior: zero / micro / small
    // Show a contiguous sliding range of numbers (no fillers)
    // #####
    if (bp === 'zero' || bp === 'micro' || bp === 'small') {
      const rangeSize = Math.min(maxButtons, totalPages);
      const maxStart = Math.max(1, totalPages - rangeSize + 1);
      const rawStart = currentPage - 1;
      const start = Math.min(Math.max(1, rawStart), maxStart);

      return Array.from({
        length: rangeSize,
      }, (_, i) => start + i);
    }

    // #####
    // General logic for larger viewports
    // #####
    const maxMiddleRange = Math.min(totalPages - 2, Math.max(1, maxButtons - 2));

    const tryFind = (rangeSize: number, requirePrevNext: boolean): (number | 'filler')[] | null => {
      // center-like start
      let start = currentPage - Math.floor(rangeSize / 2);

      if (start < 2) {
        start = 2;
      }
      const maxStart = Math.max(2, totalPages - rangeSize);

      if (start > maxStart) {
        start = maxStart;
      }
      let end = start + rangeSize - 1;

      if (requirePrevNext) {
        if (start > currentPage - 1) {
          start = Math.max(2, currentPage - 1);
          end = start + rangeSize - 1;
        }
        if (end < currentPage + 1) {
          end = Math.min(totalPages - 1, currentPage + 1);
          start = end - rangeSize + 1;
        }
        if (start < 2) {
          start = 2;
        }
        if (end > totalPages - 1) {
          end = totalPages - 1;
        }
      }

      const beforeFiller = start > 2
        ? 1
        : 0;
      const afterFiller = end < totalPages - 1
        ? 1
        : 0;
      const totalItems = 2 + rangeSize + beforeFiller + afterFiller;

      if (totalItems <= maxButtons) {
        return buildPagesFromRange(start, end);
      }

      return null;
    };

    for (let rangeSize = maxMiddleRange; rangeSize >= 1; rangeSize--) {
      if (rangeSize >= 3) {
        const candidate = tryFind(rangeSize, true);

        if (candidate) {
          return candidate;
        }
      }
    }

    for (let rangeSize = maxMiddleRange; rangeSize >= 1; rangeSize--) {
      const candidate = tryFind(rangeSize, false);

      if (candidate) {
        return candidate;
      }
    }

    return ([
      1,
      'filler',
      currentPage,
      'filler',
      totalPages,
    ] as (number | 'filler')[])
      .slice(0, maxButtons);
  };

  const pages = getPages();

  return (
    <nav
      className={styles.pagination}
      aria-labelledby='pagination'
    >
      <h2 id='pagination' className={styles.hiddenTitle}>{paginationTitle}</h2>

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
