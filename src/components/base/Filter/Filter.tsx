'use client';

import React, { useState } from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Filter/Filter.module.scss';
import { Icon } from '@/icons';

export type InterfaceFilterPropTypes = {
  filterItems: {
    amount?: number;
    checked?: boolean;
    label?: string;
    value: string;
  }[];
  labelText: string;
  name: string;
  type: 'staticSelect' | 'transformativeSelect'
};

const classes = cva([styles.filter], {
  variants: {
    type: {
      staticSelect: [styles.filterStaticSelect],
      transformativeSelect: [styles.filterTransformativeSelect],
    },
  },
});

export const Filter = ({
  filterItems,
  labelText,
  name,
  type,
}: InterfaceFilterPropTypes): React.JSX.Element => {
  const [
    items,
    setItems,
  ] = useState(filterItems);

  const handleChange = (value: string): void => {
    const updatedFilterItems = filterItems.map((item) => ({
      ...item,
      checked: item.value === value,
    }));

    setItems(updatedFilterItems);
  };

  return (
    <div
      className={classes({
        type,
      })}
      data-testid='filter'
    >
      {type === 'transformativeSelect' && (
        <div
          className={styles.radioButtonListWrapper}
        >
          <ul
            className={styles.radioButtonList}
            data-testid='filter-radio-button-list'
          >
            {items.map((item: any, id: number) => (
              <li key={id}>
                <label>
                  <input
                    className={styles.checkBox}
                    checked={item.checked ?? false}
                    name={name}
                    type='radio'
                    value={item.value ?? item}
                    onChange={() => handleChange(item.value)}
                  />
                  {item.label}
                  {item.amount !== undefined && <>&nbsp;({item.amount})</>}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div
        className={styles.selectWrapper}
      >
        <label
          className={styles.filterSelectLabel}
        >
          <span
            className={styles.filterSelectLabelText}
          >
            {labelText}
          </span>
          <Icon
            name='caretDown'
            className={styles.filterSelectLabelIcon}
          />
          <select
            className={styles.filterSelect}
            data-testid='filter-select'
            name={name}
          >
            {items.map((item: any, id: number) => (
              <option key={id} value={item.value ?? item}>
                {item.label}{item.amount !== undefined && ` (${item.amount})`}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};
