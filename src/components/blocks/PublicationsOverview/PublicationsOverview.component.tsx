'use client';

import React, {
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '@/components/blocks/PublicationsOverview/PublicationsOverview.module.scss';
import { Pagination } from '@/components/base/Pagination/Pagination';
import { ColorMode } from '@/components/base/types/colorMode';
import { Section } from '@/components/base/Section/Section';
import { usePagination } from '@/hooks/usePagination';
import {
  InterfacePublicationsListItemPropTypes,
  PublicationsListItem,
} from '@/components/base/PublicationsListItem/PublicationsListItem';
import {
  FilterList,
  InterfaceFilterListPropTypes,
} from '@/components/base/FilterList/FilterList';
import { InterfaceFilterItem } from '@/components/base/Filter/Filter';
import { useTranslations } from 'next-intl';

export type InterfacePublicationsOverviewPropTypes = {
  title: string;
  colorMode: ColorMode;
  filterItems: {
    topics: InterfaceFilterItem[];
    types: InterfaceFilterItem[];
  };
  paginationTitle: string;
  publicationItems: InterfacePublicationsListItemPropTypes[];
};

const PublicationsOverviewContent = ({
  title,
  colorMode,
  filterItems,
  publicationItems,
}: InterfacePublicationsOverviewPropTypes): React.JSX.Element => {

  const publicationFiltersLabels = useTranslations('publicationFilters');

  const sectionRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);
  const userPaginatedRef = useRef(false);
  const pageChangeRef = useRef<((page: number) => void) | null>(null);

  const [
    selectedTopic,
    setSelectedTopic,
  ] = useState<string>();
  const [
    selectedType,
    setSelectedType,
  ] = useState<string>();

  const allValueTopics = filterItems.topics[0].value;
  const allValueTypes = filterItems.types[0].value;

  const handleTopicChange = (value: string): void => {
    setSelectedTopic(value);
    pageChangeRef.current?.(1);
  };

  const handleTypeChange = (value: string): void => {
    setSelectedType(value);
    pageChangeRef.current?.(1);
  };

  // Prepare filter data
  const filterData: InterfaceFilterListPropTypes = {
    filterListItems: [
      {
        filterItems: filterItems.topics,
        labelText: publicationFiltersLabels('publicationTopicsLabel'),
        name: 'publication-topics',
        onValueChangeAction: handleTopicChange,
        type: 'staticSelect',
      },
      {
        filterItems: filterItems.types,
        labelText: publicationFiltersLabels('publicationTypesLabel'),
        name: 'publication-types',
        onValueChangeAction: handleTypeChange,
        type: 'staticSelect',
      },
    ],
  };

  // Filter publications (raw data)
  const filteredPublicationItems = useMemo(() => {
    if (selectedTopic && selectedTopic !== allValueTopics && !selectedType) {
      return publicationItems.filter((item) => item.categorization?.topic === selectedTopic);
    } else if (selectedType && selectedType !== allValueTypes && !selectedTopic) {
      return publicationItems.filter((item) => item.categorization?.type === selectedType);
    } else if (
      selectedTopic &&
      selectedType &&
      selectedTopic !== allValueTopics &&
      selectedType !== allValueTypes
    ) {
      return publicationItems.filter((item) => item.categorization?.topic === selectedTopic &&
        item.categorization?.type === selectedType);
    }

    return publicationItems;
  }, [
    publicationItems,
    selectedTopic,
    selectedType,
    allValueTopics,
    allValueTypes,
  ]);

  // Map filtered items to JSX array for pagination
  const renderedPublicationTeasers = useMemo<React.ReactNode[]>(() => filteredPublicationItems
    .filter((item): item is InterfacePublicationsListItemPropTypes => item !== null)
    .map((item) => (
      <PublicationsListItem
        key={item.id}
        categorization={item.categorization || undefined}
        date={item.date}
        image={item.image}
        tag={item.tag}
        title={item.title}
        link={item.link}
      />
    )), [filteredPublicationItems]);

  // Pagination hook
  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
  } = usePagination({
    items: renderedPublicationTeasers,
    listRef,
    sectionRef,
    userPaginatedRef,
  });

  // Update the page change ref
  useLayoutEffect(() => {
    pageChangeRef.current = handlePageChange;
  }, [handlePageChange]);

  return (
    <Section
      ref={sectionRef}
      className={styles.publicationsOverview}
      showTopLine={false}
      title={title}
      colorMode={colorMode}
      additionalStickyContent={<FilterList filterListItems={filterData.filterListItems} />}
    >
      {currentItems.length > 0
        ? (
          <ol ref={listRef} className={styles.publicationsList}>
            {currentItems}
          </ol>
        )
        : (
      // TODO create better error message
          <p>No matching results for the current filter settings</p>
        )}

      <Pagination
        className={styles.pagination}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Section>
  );
};

export const PublicationsOverview = (props: InterfacePublicationsOverviewPropTypes): React.JSX.Element => (
  <Suspense fallback={<div></div>}>
    <PublicationsOverviewContent {...props} />
  </Suspense>
);
