'use client';

import React, { useRef } from 'react';
import styles from '@/components/base/PublicationsOverview/PublicationsOverview.module.scss';
import { Pagination } from '@/components/base/Pagination/Pagination';
import { ColorMode } from '@/components/base/types/colorMode';
import { Section } from '@/components/base/Section/Section';
import { usePagination } from '@/hooks/usePagination';
import {
  InterfaceNotificationPropTypes,
  Notification,
} from '@/components/base/Notification/Notification';
import { InterfaceFilterListPropTypes } from '@/components/base/FilterList/FilterList';

export type InterfacePublicationsOverviewPropTypes = {
  children: React.ReactNode;
  title: string;
  colorMode: ColorMode;
  filters?: {
    filterListItems: InterfaceFilterListPropTypes['filterListItems'],
    onValueChange?: InterfaceFilterListPropTypes['onValueChange'],
  };
  notification?: {
    title: InterfaceNotificationPropTypes['title'],
    text: InterfaceNotificationPropTypes['text'],
  }
  paginationTitle: string;
}

export const PublicationsOverview = (props: InterfacePublicationsOverviewPropTypes): React.JSX.Element => {
  const {
    title,
    colorMode,
    children,
    notification,
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
      className={styles.publicationsOverview}
      showTopLine={false}
      title={title}
      colorMode={colorMode}
    >

      {notification &&
        <Notification
          actionText={undefined}
          className={styles.notification}
          colorMode={colorMode}
          hideIcon={true}
          onAction={undefined}
          text={notification.text}
          title={notification.title}
          type='success'
        />
      }

      <ol ref={listRef} className={styles.publicationsList}>
        {currentItems}
      </ol>

      <Pagination
        className={styles.pagination}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Section>
  );
};

