import React from 'react';
// import styles from '@/components/base/InputText/InputText.module.scss';

export type InterfaceInputTextPropTypes = {
  id: string;
  label: string;
  placeholder: string;
  errorText: string;
  name: string;
  required: boolean;
  defaultValue: string;
};

export const InputText = ({
  id,
  label,
  placeholder,
  errorText,
  name,
  required,
  defaultValue,
}: InterfaceInputTextPropTypes): React.JSX.Element => (
  <div data-testid='input-text'>
    <input
      aria-describedby={id}
      aria-required={required}
      type='text'
      placeholder={placeholder}
      required={required}
      name={name}
      defaultValue={defaultValue}
    />
    <label
      htmlFor={id}
    >{label}</label>
    <span
      id={id}
      aria-live='assertive'
      role='alert'
    >{errorText}</span>
  </div>
);
