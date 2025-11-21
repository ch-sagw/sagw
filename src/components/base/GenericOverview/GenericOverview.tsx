'use client';

import { Pagination } from '@/components/base/Pagination/Pagination';
import { usePagination } from '@/hooks/usePagination';
import React, {
  Fragment, useRef,
} from 'react';
import styles from '@/components/base/GenericOverview/GenericOverview.module.scss';
import { Config } from '@/payload-types';

export type InterfaceGenericOverview = {
  showPagination: boolean;
  children: React.ReactNode;
  language: Config['locale'];
};

export const GenericOverview = ({
  children,
  showPagination,
  language,
}: InterfaceGenericOverview): React.JSX.Element => {
  const listRef = useRef<HTMLOListElement | null>(null);
  const userPaginatedRef = useRef(false);

  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
  } = usePagination({
    items: children,
    listRef,
    sectionRef: listRef,
    userPaginatedRef,
  });

  return (
    <Fragment>
      <ul
        ref={listRef}
        className={styles.list}
      >
        {showPagination
          ? currentItems
          : children
        }
      </ul>

      {showPagination &&
        <Pagination
          className={styles.pagination}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          language={language}
        />
      }
    </Fragment>
  );
};
