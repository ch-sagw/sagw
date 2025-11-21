'use client';

import React, { useRef } from 'react';
import styles from '@/components/base/EventsNewsOverview/EventsNewsOverview.module.scss';
import { Pagination } from '@/components/base/Pagination/Pagination';
import { ColorMode } from '@/components/base/types/colorMode';
import { Section } from '@/components/base/Section/Section';
import { usePagination } from '@/hooks/usePagination';
import { Config } from '@/payload-types';

export type InterfaceEventsNewsOverviewPropTypes = {
  children: React.ReactNode;
  title: string;
  colorMode: ColorMode;
  pageLanguage: Config['locale'];
}

export const EventsNewsOverview = (props: InterfaceEventsNewsOverviewPropTypes): React.JSX.Element => {
  const {
    title,
    colorMode,
    children,
    pageLanguage,
  } = props;

  const sectionRef = useRef<HTMLElement | null>(null);
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
    sectionRef,
    userPaginatedRef,
  });

  return (
    <Section
      ref={sectionRef}
      className={styles.eventsNewsOverview}
      showTopLine={false}
      title={title}
      colorMode={colorMode}
    >

      <ol ref={listRef} className={styles.list}>
        {currentItems}
      </ol>

      <Pagination
        className={styles.pagination}
        totalPages={totalPages}
        currentPage={currentPage}
        language={pageLanguage}
        onPageChange={handlePageChange}
      />
    </Section>
  );
};
