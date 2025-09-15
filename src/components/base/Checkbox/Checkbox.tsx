'use client';

import React, { useState } from 'react';
import { cva } from 'cva';
import { Icon } from '@/icons';
import styles from '@/components/base/Checkbox/Checkbox.module.scss';
import {
  InterfaceRtePropTypes, Rte,
} from '@/components/base/Rte/Rte';

export type InterfaceCheckboxPropTypes = {
  value: string;
  name: string;
  label: InterfaceRtePropTypes['text'];
  checked: boolean;
  errorText: string;
  colorTheme: 'light' | 'dark';
  className?: string;
};

export const Checkbox = ({
  value,
  name,
  label,
  checked,
  errorText,
  colorTheme,
  className,
}: InterfaceCheckboxPropTypes): React.JSX.Element => {
  const [
    checkedState,
    setCheckedState,
  ] = useState(checked);

  const classes = cva([
    styles.checkbox,
    className,
  ], {
    variants: {
      colorTheme: {
        dark: [styles.dark],
        light: [styles.light],
      },
    },
  });

  const onInputChange = (): void => {
    setCheckedState(!checkedState);
  };

  return (
    <div className={classes({
      colorTheme,
    })}>
      <input
        className={styles.input}
        type='checkbox'
        name={name}
        id={value}
        checked={checkedState}
        onChange={onInputChange}
      />

      <Icon
        name='checked'
        className={styles.icon}
      />

      <label
        htmlFor={value}
        className={styles.label}
        data-testid='checkbox-label'
      >
        <Rte
          text={label}
          rteConfig='rte2'
        />
      </label>

      {errorText &&
        <span
          className={styles.error}
          id={name}
          aria-live='assertive'
          role='alert'
        >
          <Icon
            name='warning'
            className={styles.errorIcon}
          />
          <span>{errorText}</span>
        </span>
      }
    </div>
  );
};
