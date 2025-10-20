'use client';

import React from 'react';
import styles from '@/components/base/EventsNewsOverview/EventsNewsOverview.module.scss';
import { Pagination } from '@/components/base/Pagination/Pagination';
import { ColorMode } from '@/components/base/types/colorMode';
import { Section } from '@/components/base/Section/Section';
import { usePagination } from '@/hooks/usePagination';

export type InterfaceEventsNewsOverviewPropTypes = {
  children: React.ReactNode;
  title: string;
  colorMode: ColorMode;
  paginationTitle: string;
}

export const EventsNewsOverview = (props: InterfaceEventsNewsOverviewPropTypes): React.JSX.Element => {
  const {
    title,
    colorMode,
    children,
  } = props;

  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
  } = usePagination({
    items: children,
  });

  return (
    <Section
      className={styles.eventsNewsOverview}
      showTopLine={false}
      title={title}
      colorMode={colorMode}
    >

      <ul className={styles.list}>
        {currentItems}
      </ul>

      <Pagination
        className={styles.pagination}
        totalPages={totalPages}
        currentPage={currentPage}
        paginationTitle={props.paginationTitle}
        onPageChange={handlePageChange}
      />
    </Section>
  );
};
