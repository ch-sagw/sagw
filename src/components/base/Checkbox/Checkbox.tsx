'use client';

import React, {
  useEffect, useRef, useState,
} from 'react';
import { cva } from 'cva';
import { Icon } from '@/icons';
import styles from '@/components/base/Checkbox/Checkbox.module.scss';
import { ColorMode } from '@/components/base/types/colorMode';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { FormError } from '@/components/base/FormError/FormError';

export type InterfaceCheckboxPropTypes = {
  value: string;
  name: string;
  label: string;
  checked: boolean;
  errorText: string;
  colorMode: ColorMode;
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
  const checkboxId = `checkbox-${name}`;
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
        light: null,
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
            ? `error-${checkboxId}`
            : undefined
        }
        aria-invalid={Boolean(errorText)}
        className={styles.input}
        type='checkbox'
        name={name}
        id={checkboxId}
        checked={checkedState}
        onChange={onInputChange}
        value={value}
      />

      <Icon
        name='checked'
        className={styles.icon}
      />

      <label
        htmlFor={checkboxId}
        className={styles.label}
        data-testid='checkbox-label'
      >
        <SafeHtml
          as='span'
          html={label}
        />
      </label>

      {Boolean(errorText) &&
        <FormError
          errorId={`error-${checkboxId}`}
          errorText={errorText}
          colorMode={colorMode}
        />
      }
    </div>
  );
};
