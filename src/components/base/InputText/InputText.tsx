'use client';

import React, {
  useEffect,
  useId, useRef,
} from 'react';
import { cva } from 'cva';
import styles from '@/components/base/InputText/InputText.module.scss';
import { Icon } from '@/icons';
import { ColorMode } from '@/components/base/types/colorMode';

export type BaseProps = {
  label: string;
  placeholder: string;
  errorText: string;
  name: string;
  required: boolean;
  defaultValue: string;
  colorMode: ColorMode;
  className?: string;
  autofocus?: boolean;
};

type InputProps = BaseProps & {
  type: 'email' | 'text';
};

type TextareaProps = BaseProps & {
  type: 'textarea';
};

export type InterfaceInputTextPropTypes = InputProps | TextareaProps;

export const InputText = ({
  label,
  placeholder,
  errorText,
  name,
  required,
  defaultValue,
  type,
  colorMode,
  className,
  autofocus,
}: InterfaceInputTextPropTypes): React.JSX.Element => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autofocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autofocus]);

  const classes = cva([
    styles.inputText,
    className,
  ], {
    variants: {
      colorMode: {
        dark: [styles.dark],
        light: null,
        white: null,
      },
      type: {
        text: [styles.text],
        textarea: [styles.textarea],
      },
    },
  });

  const Elem: React.ElementType = type === 'textarea'
    ? 'textarea'
    : 'input';

  return (
    <div
      data-testid='input-text'
      className={classes({
        colorMode,
        type: type === 'text' || type === 'email'
          ? 'text'
          : 'textarea',
      })}
    >
      <Elem
        ref={inputRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
        className={styles.input}
        aria-describedby={
          errorText
            ? `error-${inputId}`
            : undefined
        }
        aria-invalid={Boolean(errorText)}
        aria-required={required}
        placeholder={placeholder}
        required={required}
        name={name}
        defaultValue={defaultValue}
        aria-label={label}
        id={inputId}
        {...(type === 'textarea'
          ? {
            rows: 1,
          }
          : {
            type,
          })}
      />
      <label
        className={styles.label}
        htmlFor={inputId}
      >{label}</label>

      {errorText &&
        <span
          className={styles.error}
          id={`error-${inputId}`}
        >
          <Icon
            name='warning'
            className={styles.icon}
          />
          <span>{errorText}</span>
        </span>
      }
    </div >
  );
};
