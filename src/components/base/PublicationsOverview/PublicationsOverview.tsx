'use client';

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '@/components/base/PublicationsOverview/PublicationsOverview.module.scss';
import { Pagination } from '@/components/base/Pagination/Pagination';
import { ColorMode } from '@/components/base/types/colorMode';
import { Section } from '@/components/base/Section/Section';
import { usePagination } from '@/hooks/usePagination';
import {
  InterfaceNotificationPropTypes,
  Notification,
} from '@/components/base/Notification/Notification';
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
  filterItems: InterfaceFilterItem[][],
  notification?: {
    title: InterfaceNotificationPropTypes['title'],
    text: InterfaceNotificationPropTypes['text'],
  }
  paginationTitle: string;
  publicationItems: InterfacePublicationsListItemPropTypes[];
}

export const PublicationsOverview = (props: InterfacePublicationsOverviewPropTypes): React.JSX.Element => {
  const {
    title,
    colorMode,
    filterItems,
    notification,
    publicationItems,
  } = props;

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

  const handleTopicChange = (value: string): void => {
    setSelectedTopic(value);
    pageChangeRef.current?.(1);
  };

  const handleTypeChange = (value: string): void => {
    setSelectedType(value);
    pageChangeRef.current?.(1);
  };

  console.log(filterItems);

  const allValueTopics = filterItems[1][0].value;
  const allValueTypes = filterItems[0][0].value;

  // Prepare the filter list items
  const filterData: InterfaceFilterListPropTypes = {
    filterListItems: [
      {
        filterItems: filterItems[1],
        labelText: publicationFiltersLabels('publicationTopicsLabel'),
        name: 'publication-topics',
        onValueChangeAction: handleTopicChange,
        type: 'staticSelect',
      },
      {
        filterItems: filterItems[0],
        labelText: publicationFiltersLabels('publicationTypesLabel'),
        name: 'publication-types',
        onValueChangeAction: handleTypeChange,
        type: 'staticSelect',
      },
    ],
  };

  const renderedPublicationTeasers = useMemo(() => {
    let currentTeaserData: InterfacePublicationsListItemPropTypes[] = [];

    console.log('renderedPublicationTeasers');
    console.log(`allValueTopics ${allValueTopics}`);
    console.log(`selectedTopic ${selectedTopic}`);
    console.log(`selectedType ${selectedType}`);

    if (
      selectedTopic !== undefined &&
      selectedTopic !== allValueTopics &&
      !selectedType
    ) {
      // Return Publications filtered by topic
      currentTeaserData = publicationItems.filter((item) => {

        console.log('1');

        if (item.categorization?.topic !== null) {
          return item.categorization?.topic === selectedTopic;
        }

        return false;
      });
    } else if (
      selectedType !== undefined &&
      selectedType !== allValueTypes &&
      !selectedTopic
    ) {
      // Return Publications filtered by type
      currentTeaserData = publicationItems.filter((item) => {

        console.log('2');

        if (item.categorization?.type !== null) {
          return item.categorization?.type === selectedType;
        }

        return false;
      });
    } else if (
      selectedType !== undefined &&
      selectedTopic !== undefined &&
      selectedType !== allValueTypes &&
      selectedTopic !== allValueTopics
    ) {
      // Return Publications filtered by type and topic
      currentTeaserData = publicationItems.filter((item) => {
        console.log('3');
        if (item.categorization?.type !== null) {
          return (
            item.categorization?.type === selectedType &&
            item.categorization?.topic === selectedTopic
          );
        }

        return false;
      });
    } else {
      console.log('4');
      // If no topic or type is selected, we return the full set
      currentTeaserData = publicationItems;
    }

    console.log(currentTeaserData);

    // Render PublicationsListItems
    const currentRenderedPublicationTeasers = currentTeaserData.map((item) => (
      <PublicationsListItem
        categorization={item.categorization || undefined}
        date={item.date}
        image={item.image}
        key={item.id}
        tag={item.tag}
        title={item.title}
        link={item.link}
      />
    ));

    return currentRenderedPublicationTeasers;

  }, [
    allValueTopics,
    allValueTypes,
    publicationItems,
    selectedTopic,
    selectedType,
  ]);

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

  useEffect(() => {
    pageChangeRef.current = handlePageChange;
  }, [handlePageChange]);

  return (
    <Section
      ref={sectionRef}
      className={styles.publicationsOverview}
      showTopLine={false}
      title={title}
      colorMode={colorMode}
      additionalStickyContent={
        <FilterList
          filterListItems={filterData.filterListItems}
        />
      }
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

      <ol
        ref={listRef}
        className={styles.publicationsList}
      >
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

