'use client';

import React, {
  useEffect,
  useRef,
} from 'react';
import { cva } from 'cva';
import styles from '@/components/base/InputText/InputText.module.scss';
import { ColorMode } from '@/components/base/types/colorMode';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { FormError } from '@/components/base/FormError/FormError';

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
  const inputId = `input-${name}`;
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
      <SafeHtml
        as='label'
        className={styles.label}
        htmlFor={inputId}
        html={label}
      />

      {Boolean(errorText) &&
        <FormError
          errorId={`error-${inputId}`}
          errorText={errorText}
          colorMode={colorMode}
        />
      }
    </div >
  );
};
