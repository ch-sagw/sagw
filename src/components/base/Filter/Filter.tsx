'use client';

import React, { useState } from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Filter/Filter.module.scss';
import { Icon } from '@/icons';

interface InterfaceFilterItem {
  amount?: number;
  checked?: boolean;
  label?: string;
  value: string;
}

export type InterfaceFilterPropTypes = {
  filterItems: InterfaceFilterItem[];
  labelText: string;
  name: string;
  type: 'staticSelect' | 'transformativeSelect'
  onValueChange?: (selectedValue: string) => void;
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
  onValueChange,
}: InterfaceFilterPropTypes): React.JSX.Element => {
  const [initiallySelectedItem] = filterItems.filter((item) => item.checked);

  const [
    selectedItem,
    setSelectedItem,
  ] = useState<string | undefined>(initiallySelectedItem?.value || undefined);

  const handleChange = (value: string): void => {
    setSelectedItem(value);
    onValueChange?.(value);
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
            {filterItems.map((item: InterfaceFilterItem, id: number) => {
              const inputId = `${name}-${id}`;

              return (
                <li
                  className={styles.radioButtonListItem}
                  key={id}
                >
                  <input
                    className={styles.radioButton}
                    checked={selectedItem === item.value}
                    name={name}
                    id={inputId}
                    type='radio'
                    value={item.value ?? item}
                    onChange={() => handleChange(item.value)}
                  />
                  <label htmlFor={inputId}>
                    {item.label}
                    {item.amount !== undefined && <>&nbsp;({item.amount})</>}
                  </label>
                </li>
              );
            })}
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
            onChange={(evt) => onValueChange?.(evt.target.value)}
          >
            {filterItems.map((item: any, id: number) => (
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
