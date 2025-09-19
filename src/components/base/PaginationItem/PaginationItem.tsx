import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/PaginationItem/PaginationItem.module.scss';

export type InterfacePaginationItemPropTypes =
  | {
    type: 'number';
    number: number;
    onClick: () => void;
    active?: boolean;
  }
  | {
    type: 'filler';
  };

export const PaginationItem = (props: InterfacePaginationItemPropTypes): React.JSX.Element => {
  const classes = cva([styles.paginationItem], {
    variants: {
      active: {
        false: null,
        true: [styles.active],
      },
      type: {
        filler: null,
        number: [styles.number],
      },
    },
  });

  if (props.type === 'number') {
    const {
      active,
      number,
      onClick,
      type,
    } = props;

    const additionalAttributes: Record<string, string> = {};

    if (active) {
      additionalAttributes['aria-current'] = 'page';
    }

    return (
      <button
        className={classes({
          active,
          type,
        })}
        onClick={onClick}
        {...additionalAttributes}
      >{number}</button>
    );
  }

  const {
    type,
  } = props;

  return (
    <span
      className={classes({
        type,
      })}
      aria-hidden={true}
    >...</span>
  );
};
