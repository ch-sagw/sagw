import React, { useState } from 'react';
import styles from '@/components/base/Toggle/Toggle.module.scss';

export type InterfaceTogglePropTypes = {
  labelOff: string;
  labelOn: string;
  value: string;
  name: string;
  checked: boolean;
  hiddenLabel: string;
};

export const Toggle = ({
  labelOff,
  labelOn,
  value,
  name,
  checked,
  hiddenLabel,
}: InterfaceTogglePropTypes): React.JSX.Element => {
  const [
    checkedState,
    setCheckedState,
  ] = useState(checked);

  const onInputChange = (): void => {
    setCheckedState(!checkedState);
  };

  return (
    <div
      className={styles.toggle}
      data-testid='toggle'
    >
      <input
        className={styles.input}
        type='checkbox'
        name={name}
        value={name}
        id={value}
        onChange={onInputChange}
        checked={checkedState}
      />

      <label
        className={styles.label}
        htmlFor={value}
      >
        <span className={styles.hiddenLabel}>{hiddenLabel}</span>
        <span className={styles.labelOff} aria-hidden='true'>{labelOff}</span>
        <span className={styles.labelOn} aria-hidden='true'>{labelOn}</span>
      </label>
    </div>
  );
};
