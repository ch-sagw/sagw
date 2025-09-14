import React from 'react';
import styles from '@/components/base/InputText/InputText.module.scss';
import { Icon } from '@/icons';

export type InterfaceInputTextPropTypes = {
  id: string;
  label: string;
  placeholder: string;
  errorText: string;
  name: string;
  required: boolean;
  defaultValue: string;
  type: 'email' | 'text';
};

export const InputText = ({
  id,
  label,
  placeholder,
  errorText,
  name,
  required,
  defaultValue,
  type,
}: InterfaceInputTextPropTypes): React.JSX.Element => (
  <div
    data-testid='input-text'
    className={styles.inputText}
  >
    <input
      className={styles.input}
      aria-describedby={id}
      aria-required={required}
      type={type}
      placeholder={placeholder}
      required={required}
      name={name}
      defaultValue={defaultValue}
    />
    <label
      className={styles.label}
      htmlFor={id}
    >{label}</label>

    {errorText &&
      <span
        className={styles.error}
        id={id}
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
