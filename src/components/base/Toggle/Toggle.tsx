import React, {
  useEffect, useState,
} from 'react';
import styles from '@/components/base/Toggle/Toggle.module.scss';
import { SafeHtml } from '../SafeHtml/SafeHtml';

export type InterfaceTogglePropTypes = {
  labelOff: string;
  labelOn: string;
  value: string;
  name: string;
  checked: boolean;
  hiddenLabel: string;
  onChange?: (checked: boolean) => void;
};

export const Toggle = ({
  labelOff,
  labelOn,
  value,
  name,
  checked,
  hiddenLabel,
  onChange,
}: InterfaceTogglePropTypes): React.JSX.Element => {
  const [
    checkedState,
    setCheckedState,
  ] = useState(checked);

  useEffect(() => {
    setCheckedState(checked);
  }, [checked]);

  const onInputChange = (): void => {
    const newChecked = !checkedState;

    setCheckedState(newChecked);
    onChange?.(newChecked);
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

        <SafeHtml
          as='span'
          className={styles.labelOff}
          aria-hidden='true'
          html={labelOff}
        />

        <SafeHtml
          as='span'
          className={styles.labelOn}
          aria-hidden='true'
          html={labelOn}
        />

      </label>
    </div>
  );
};
