import 'server-only';
import React from 'react';

import styles from './__name__.module.scss';

export interface Interface__name__Props {
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const __name__ = ({
  size = 'medium',
  ...props
}: Interface__name__Props): React.JSX.Element => {

  console.log('__name__ did render');

  return (
    <button
      type='button'
      className={[
        styles['button'],
        styles[`button--${size}`],
      ].join(' ')}
      {...props}
    >
      Button
    </button>
  );
};
