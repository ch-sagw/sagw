'use client';

import React from 'react';

// import './button.scss';
import styles from '@/components/Button/Button.module.scss';

export interface InterfaceButtonProps {
  primary?: boolean;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  label: string;
  onClick?: () => void;
}

export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: InterfaceButtonProps): React.JSX.Element => {
  const mode = primary
    ? styles['button--primary']
    : styles['button--secondary'];

  return (
    <button
      type='button'
      className={[
        styles['button'],
        styles[`button--${size}`],
        mode,
      ].join(' ')}
      {...props}
    >
      {label}
      <style jsx>{`
        button {
          background-color: ${backgroundColor};
        }
      `}</style>
    </button>
  );
};
