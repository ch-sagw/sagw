/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client';

import React, { useRef } from 'react';
import styles from '@/components/blocks/PublicationsOverview/PublicationsOverview.module.scss';
import { Pagination } from '@/components/base/Pagination/Pagination';
import { ColorMode } from '@/components/base/types/colorMode';
import { Section } from '@/components/base/Section/Section';
import { FilterList } from '@/components/base/FilterList/FilterList';
import { PublicationOverviewFilters } from '@/components/base/FilterList/FilterList.stories';
import { Notification } from '@/components/base/Notification/Notification';
import { usePagination } from '@/hooks/usePagination';
import { rteToHtml } from '@/utilities/rteToHtml';

export type InterfacePublicationsOverviewPropTypes = {
  children: React.ReactNode;
  title: string;
  colorMode: ColorMode;
  paginationTitle: string;
}

export const PublicationsOverview = (props: InterfacePublicationsOverviewPropTypes): React.JSX.Element => {
  const {
    title,
    colorMode,
    children,
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
      filterListItems={PublicationOverviewFilters.args.filterListItems}
      showTopLine={false}
      title={title}
      colorMode={colorMode}
    >
      <Notification
        actionText={undefined}
        className={styles.notification}
        colorMode={colorMode}
        hideIcon={true}
        onAction={undefined}
        text='test'
        title='test'
        type='success'
      />

      <ol
        className={styles.publicationsList}
        ref={listRef}
      >
        {currentItems}
      </ol>

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
