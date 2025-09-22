import 'server-only';
import React from 'react';
import styles from '@/components/base/Filter/Filter.module.scss';

export type InterfaceFilterPropTypes = {
  filterItems: {
    checked?: boolean;
    label?: string;
    value: string;
  }[];
  name: string;
  labelText: string;
};

export const Filter = ({
  filterItems,
  labelText,
  name,
}: InterfaceFilterPropTypes): React.JSX.Element => (
  <div>
    <ul className={styles.checkBoxList}>
      {filterItems.map((item: any, idx: number) => (
        <li key={idx}>
          <label>
            <input
              className={styles.checkBox}
              checked={item.checked ?? false}
              name={item.value ?? item}
              type='checkbox'
              value={item.value ?? item}
            />
            {item.label ?? item}
          </label>
        </li>
      ))}
    </ul>
    <label
      className={styles.filterSelectLabel}
    >
      <span
        className={styles.filterSelectLabelText}
      >
        {labelText}
      </span>
      <select
        className={styles.filterSelect}
        name={name}
      >
        {filterItems.map((item: any, idx: number) => (
          <option key={idx} value={item.value ?? item}>
            {item.label ?? item}
          </option>
        ))}
      </select>
    </label>
  </div>
);
