'use client';

import React, {
  useEffect, useRef, useState,
} from 'react';
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
  autofocus?: boolean;
};

export const Checkbox = ({
  value,
  name,
  label,
  checked,
  errorText,
  colorTheme,
  className,
  autofocus,
}: InterfaceCheckboxPropTypes): React.JSX.Element => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  const [
    checkedState,
    setCheckedState,
  ] = useState(checked);

  useEffect(() => {
    if (autofocus && checkboxRef.current) {
      checkboxRef.current.focus();
    }
  }, [autofocus]);

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
        ref={checkboxRef}
        aria-describedby={
          errorText
            ? value
            : undefined
        }
        aria-invalid={Boolean(errorText)}
        className={styles.input}
        type='checkbox'
        name={name}
        id={value}
        checked={checkedState}
        onChange={onInputChange}
        value={value}
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
