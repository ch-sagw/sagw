import 'server-only';
import React from 'react';
import styles from '@/components/base/Button/Button.module.scss';

export type InterfaceButtonPropTypes = {
  text: string;
};

export const Button = ({
  text,
}: InterfaceButtonPropTypes): React.JSX.Element => (
  <button
    className={styles.button}
    data-testid='button'
  >
    {text}
  </button>
);
