'use client';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { cva } from 'cva';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import styles from '@/components/base/Radios/Radios.module.scss';
import { ColorMode } from '@/components/base/types/colorMode';
import { FormError } from '@/components/base/FormError/FormError';

interface InterfaceRadioItem {
  value: string;
  label: string;
  checked?: boolean;
}

export type InterfaceRadiosPropTypes = {
  colorTheme: ColorMode;
  name: string;
  items: InterfaceRadioItem[];
  errorText: string;
  descriptionLabel: string;
  className?: string;
  autofocus?: boolean;
};

export const Radios = ({
  className,
  colorTheme,
  name,
  items,
  errorText,
  descriptionLabel,
  autofocus,
}: InterfaceRadiosPropTypes): React.JSX.Element => {
  const [initiallyChecked] = items.filter((item) => item.checked);

  const [
    checkedItem,
    setCheckedItem,
  ] = useState(initiallyChecked?.value || undefined);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const blockId = `radio-${name}`;

  useEffect(() => {
    if (autofocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autofocus]);

  const classes = cva([
    styles.radios,
    className,
  ], {
    variants: {
      colorTheme: {
        dark: [styles.dark],
        light: [styles.light],
        white: [styles.white],
      },
    },
  });

  return (
    <fieldset
      className={classes({
        colorTheme,
      })}
      aria-describedby={
        errorText
          ? `error-${blockId}`
          : undefined
      }
      aria-invalid={Boolean(errorText)}
    >
      <SafeHtml
        as='legend'
        className={styles.descriptionLabel}
        html={descriptionLabel}
      />

      {items.map((item) => (
        <div
          key={item.value}
          className={styles.radio}
        >
          <input
            ref={inputRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
            checked={item.value === checkedItem}
            className={styles.input}
            type='radio'
            name={name}
            onChange={() => {
              setCheckedItem(item.value);
            }}
            value={item.value}
            id={`${name}-${item.value}`}
          />
          <SafeHtml
            as='label'
            className={styles.label}
            htmlFor={`${name}-${item.value}`}
            html={item.label}
          />
        </div>
      ))}

      {Boolean(errorText) &&
        <FormError
          errorId={`error-${blockId}`}
          errorText={errorText}
          colorMode={colorTheme}
        />
      }
    </fieldset>
  );
};
