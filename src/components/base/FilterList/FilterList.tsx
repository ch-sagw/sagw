'use client';

import React from 'react';
import styles from '@/components/base/FilterList/FilterList.module.scss';
import {
  Filter,
  InterfaceFilterPropTypes,
} from '@/components/base/Filter/Filter';

export type InterfaceFilterListPropTypes = {
  filterListItems: any;
  onValueChange?: (selectedValue: string) => void;
}

export const FilterList = ({
  filterListItems,
  onValueChange,
}: InterfaceFilterListPropTypes): React.JSX.Element => (
  <ul
    className={styles.filterList}
    data-test-id='filter-list'
  >
    {filterListItems.map((
      filter: InterfaceFilterPropTypes,
      id: number,
    ) => (
      <li
        className={styles.filterListItem}
        key={id}
      >
        <Filter
          filterItems={filter.filterItems}
          labelText={filter.labelText}
          name={filter.name}
          type={filter.type}
          onValueChange={onValueChange}
        />
      </li>
    ))}
  </ul>
);
