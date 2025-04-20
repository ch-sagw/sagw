'use client';

import React from 'react';
import { InterfaceButton } from '@/payload-types';
import styles from '@/components/Button/Button.module.scss';

export type InterfaceButtonPropTypes = {
  onClick?: () => void;
} & InterfaceButton;

export const Button = (props: InterfaceButtonPropTypes): React.JSX.Element => {
  const mode = props.primary
    ? styles['button--primary']
    : styles['button--secondary'];

  return (
    <button
      type='button'
      className={[
        styles['button'],
        styles[`button--${props.size}`],
        mode,
      ].join(' ')}
      onClick={props.onClick}
      {...props}
    >
      {props.label}
      <style jsx>{`
        button {
          background-color: ${props.backgroundColor};
        }
      `}</style>
    </button>
  );
};
