import React, { useId } from 'react';
import { cva } from 'cva';
import styles from '@/components/base/InputText/InputText.module.scss';
import { Icon } from '@/icons';

export type BaseProps = {
  label: string;
  placeholder: string;
  errorText: string;
  name: string;
  required: boolean;
  defaultValue: string;
  colorTheme: 'light' | 'dark';
  className?: string;
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
  colorTheme,
  className,
}: InterfaceInputTextPropTypes): React.JSX.Element => {
  const inputId = useId();

  const classes = cva([
    styles.inputText,
    className,
  ], {
    variants: {
      colorTheme: {
        dark: [styles.dark],
        light: [styles.light],
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
        colorTheme,
        type: type === 'text' || type === 'email'
          ? 'text'
          : 'textarea',
      })}
    >
      <Elem
        className={styles.input}
        aria-describedby={inputId}
        aria-required={required}
        placeholder={placeholder}
        required={required}
        name={name}
        defaultValue={defaultValue}
        aria-label={label}
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
          id={inputId}
          aria-live='assertive'
          role='alert'
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
