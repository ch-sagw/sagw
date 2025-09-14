import React, { useId } from 'react';
import styles from '@/components/base/InputText/InputText.module.scss';
import { Icon } from '@/icons';

export type InterfaceInputTextPropTypes = {
  label: string;
  placeholder: string;
  errorText: string;
  name: string;
  required: boolean;
  defaultValue: string;
  type: 'email' | 'text';
};

export const InputText = ({
  label,
  placeholder,
  errorText,
  name,
  required,
  defaultValue,
  type,
}: InterfaceInputTextPropTypes): React.JSX.Element => {
  const inputId = useId();

  return (
    <div
      data-testid='input-text'
      className={styles.inputText}
    >
      <input
        className={styles.input}
        aria-describedby={inputId}
        aria-required={required}
        type={type}
        placeholder={placeholder}
        required={required}
        name={name}
        defaultValue={defaultValue}
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
