'use client';

import React, { useRef } from 'react';
import styles from '@/components/blocks/NetworkTeaser/NetworkTeaser.module.scss';
import {
  InterfaceNetworkTeasersBlock, NetworkCategory,
} from '@/payload-types';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rteToHtml } from '@/utilities/rteToHtml';
import {
  Filter, InterfaceFilterItem,
} from '@/components/base/Filter/Filter';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import slugify from 'slugify';
import { Section } from '@/components/base/Section/Section';
import { Pagination } from '@/components/base/Pagination/Pagination';
import { usePagination } from '@/hooks/usePagination';

export type InterfaceNetworkTeaserPropTypes = {} & InterfaceNetworkTeasersBlock;

const allValue = 'all';

const prepareFilterItems = (items: NetworkCategory[], labelAll: string): InterfaceFilterItem[] => {
  const filterItems = items.map((item) => ({
    checked: false,
    label: rte1ToPlaintext(item.name),
    value: item.id,
  }));

  filterItems.unshift({
    checked: true,
    label: labelAll,
    value: allValue,
  });

  return filterItems;
};

const getUniqueCategoriesOfItems = (items: InterfaceNetworkTeasersBlock['items'], labelAll: string): InterfaceFilterItem[] => {
  const categories = items.items
    .map((item) => item.category)
    .filter((c) => typeof c === 'object' && c !== null);

  const uniqueCategories = [
    ...new Map(categories.map((c) => [
      c.id,
      c,
    ]))
      .values(),
  ];

  return prepareFilterItems(uniqueCategories, labelAll);
};

export const NetworkTeaser = ({
  filter,
  items,
}: InterfaceNetworkTeaserPropTypes): React.JSX.Element => {
  const filterItems = getUniqueCategoriesOfItems(items, rte1ToPlaintext(filter.allCheckboxText));
  const plainTitle = rte1ToPlaintext(filter.title);
  const filterName = slugify(plainTitle, {
    lower: true,
    strict: true,
    trim: true,
  });

  const sectionRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);
  const userPaginatedRef = useRef(false);

  const allItems = items.items.map((item, key) => (
    <SafeHtml
      key={key}
      as='li'
      html={rteToHtml(item.title)}
    />
  ));

  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
  } = usePagination({
    items: allItems,
    listRef,
    sectionRef,
    userPaginatedRef,
  });

  return (
    <div
      className={styles.projectTeser}
    >
      <Section
        title={rteToHtml(filter.title)}
        colorMode='white'
        additionalStickyContent={
          <Filter
            type='transformativeSelect'
            labelText={plainTitle}
            name={filterName}
            filterItems={filterItems}
            className={styles.filter}
          />
        }
      >
        <ul>
          {currentItems}
        </ul>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}

          // TODO
          paginationTitle='Pagination'
        />

      </Section>

    </div>
  );
};
