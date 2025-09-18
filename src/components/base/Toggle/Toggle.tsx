import 'server-only';
import React, { useState } from 'react';
import styles from '@/components/base/Toggle/Toggle.module.scss';

export type InterfaceTogglePropTypes = {
  labelOff: string;
  labelOn: string;
  value: string;
  name: string;
  checked: boolean;
};

export const Toggle = ({
  labelOff,
  labelOn,
  value,
  name,
  checked,
}: InterfaceTogglePropTypes): React.JSX.Element => {
  const [
    checkedState,
    setCheckedState,
  ] = useState(checked);

  const onInputChange = (): void => {
    setCheckedState(!checkedState);
  };

  return (
    <div className={styles.toggle}>
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
        <span className={styles.labelOff}>{labelOff}</span>
        <span className={styles.labelOn}>{labelOn}</span>
      </label>
    </div>
  );
};
