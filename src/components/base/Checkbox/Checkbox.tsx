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
  colorMode: 'white' | 'dark';
  className?: string;
  autofocus?: boolean;
};

export const Checkbox = ({
  value,
  name,
  label,
  checked,
  errorText,
  colorMode,
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

  useEffect(() => {
    setCheckedState(checked);
  }, [checked]);

  const classes = cva([
    styles.checkbox,
    className,
  ], {
    variants: {
      colorMode: {
        dark: [styles.dark],
        white: null,
      },
    },
  });

  const onInputChange = (): void => {
    setCheckedState(!checkedState);
  };

  return (
    <div className={classes({
      colorMode,
    })}>
      <input
        ref={checkboxRef}
        aria-describedby={
          errorText
            ? name
            : undefined
        }
        aria-invalid={Boolean(errorText)}
        className={styles.input}
        type='checkbox'
        name={name}
        id={name}
        checked={checkedState}
        onChange={onInputChange}
        value={value}
      />

      <Icon
        name='checked'
        className={styles.icon}
      />

      <label
        htmlFor={name}
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
