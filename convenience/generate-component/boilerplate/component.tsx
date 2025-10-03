import React from 'react';
import { cva } from 'cva';
import styles from '@/components/__componentFolder__/__name__/__name__.module.scss';
import { Interface__name__ } from '@/payload-types';

export type Interface__name__PropTypes = {
  sampleProperty: string;
  context: 'sampleContext'
} & Interface__name__;

const sampleClasses = cva([styles.baseStyle], {
  variants: {
    context: {
      sampleContext: [styles.sampleContextStyle],
    },
  },
});

export const __name__ = ({
  context,
  sampleProperty,
}: Interface__name__PropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
