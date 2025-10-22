'use client';

import React, {
  useEffect, useRef,
} from 'react';
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

  const sectionRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const userPaginatedRef = useRef(false);

  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
  } = usePagination({
    items: children,
  });

  // scroll to top
  useEffect(() => {
    if (!userPaginatedRef.current) {
      return;
    }

    if (!sectionRef.current) {
      return;
    }

    const header = document.querySelector('header');
    const headerHeight = header
      ? header.getBoundingClientRect().height
      : 0;

    window.scrollTo({
      behavior: 'smooth',
      top: headerHeight,
    });
  }, [currentPage]);

  // observe the page, as soon as the first link is in viewport, focus it
  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    if (userPaginatedRef.current && listRef.current) {
      const firstListItem = listRef.current.querySelector('li');

      if (firstListItem) {
        observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
              const firstLink = firstListItem.querySelector('a') as HTMLElement | null;

              if (firstLink) {
                firstLink.focus({
                  preventScroll: true,
                });
              }
              observer?.disconnect();

              return;
            }
          }
        }, {
          root: null,
          rootMargin: '0px',
          threshold: [
            0.5,
            0.75,
            0.9,
          ],
        });

        observer.observe(firstListItem);
      }
    }

    return (): void => {
      observer?.disconnect();
    };
  }, [currentItems]);

  const handlePageChangeWithUserFlag = (page: number): void => {
    userPaginatedRef.current = true;
    handlePageChange(page);
  };

  return (
    <Section
      ref={sectionRef}
      className={styles.eventsNewsOverview}
      showTopLine={false}
      title={title}
      colorMode={colorMode}
    >

      <ul ref={listRef} className={styles.list}>
        {currentItems}
      </ul>

      <Pagination
        className={styles.pagination}
        totalPages={totalPages}
        currentPage={currentPage}
        paginationTitle={props.paginationTitle}
        onPageChange={handlePageChangeWithUserFlag}
      />
    </Section>
  );
};
