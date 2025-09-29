import 'server-only';
import React from 'react';
import styles from '@/components/base/FilterList/FilterList.module.scss';
import {
  Filter,
  InterfaceFilterPropTypes,
} from '../Filter/Filter';

export type InterfaceFilterListPropTypes = {
  filterListItems: any;
}

export const FilterList = ({
  filterListItems,
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
        />
      </li>
    ))}
  </ul>
);
