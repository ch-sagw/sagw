'use client';

import React, { Fragment } from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Pagination/Pagination.module.scss';
import { PaginationItem } from '../PaginationItem/PaginationItem';
import { usePaginationMeasurements } from '@/hooks/usePaginationMeasurements';
import { useTranslations } from 'next-intl';

export type InterfacePaginationPropTypes = {
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
  className?: string;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: InterfacePaginationPropTypes): React.JSX.Element => {
  const i18nPagination = useTranslations('pagination');
  const {
    measurements,
    containerRef,
  } = usePaginationMeasurements();

  if (totalPages < 2) {
    return <Fragment></Fragment>;
  }

  const getPagesWithoutFillers = (maxItems: number): number[] => {
    const pages: number[] = [];

    // For small screens, show a sliding window around current page
    // Always try to show first and last if we have space
    const canShowFirstAndLast = maxItems >= 4;

    if (canShowFirstAndLast) {
      // Show first page, pages around current, and last page
      // Reserve 2 slots for first and last
      const middleSlots = maxItems - 2;
      const halfMiddle = Math.floor(middleSlots / 2);

      let start = Math.max(2, currentPage - halfMiddle);
      const end = Math.min(totalPages - 1, start + middleSlots - 1);

      // Adjust if we hit boundaries
      if (end === totalPages - 1) {
        start = Math.max(2, end - middleSlots + 1);
      }

      pages.push(1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    } else {
      // For very small screens, just show pages around current
      const halfWindow = Math.floor(maxItems / 2);
      let start = Math.max(1, currentPage - halfWindow);
      const end = Math.min(totalPages, start + maxItems - 1);

      // Adjust if we hit boundaries
      if (end === totalPages) {
        start = Math.max(1, end - maxItems + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const getPagesWithFillers = (maxItems: number): (number | 'filler')[] => {
    const pages: (number | 'filler')[] = [];

    // Always show first page
    pages.push(1);

    // Calculate how many middle pages we can show
    // We need:
    // 1 (first) + 1 (filler) + X (middle) + 1 (filler) + 1 (last) = maxItems
    // So X = maxItems - 4
    let middlePages = maxItems - 4;

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
    let end = Math.min(totalPages - 1, start + middlePages - 1);

    // Adjust if we hit the end boundary
    if (end === totalPages - 1) {
      start = Math.max(2, end - middlePages + 1);
    }

    // Check how many fillers we actually need
    const needsFillerBefore = start > 2;
    const needsFillerAfter = end < totalPages - 1;
    const actualFillers = Number(needsFillerBefore) + Number(needsFillerAfter);

    // If we only have 1 filler, we can fit 1 additional item
    if (actualFillers === 1) {
      middlePages += 1;

      // Recalculate with the additional item
      const halfMiddleNew = Math.floor(middlePages / 2);

      start = Math.max(2, currentPage - halfMiddleNew);
      end = Math.min(totalPages - 1, start + middlePages - 1);

      // Adjust if we hit the end boundary
      if (end === totalPages - 1) {
        start = Math.max(2, end - middlePages + 1);
      }
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

  const paginationClasses = cva([
    styles.pagination,
    className,
  ]);

  return (
    <nav
      ref={containerRef}
      className={paginationClasses()}
      aria-labelledby='pagination'
    >
      <h2
        id='pagination'
        className={styles.hiddenTitle}
      >
        {i18nPagination('hiddenPaginationTitle')}
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
