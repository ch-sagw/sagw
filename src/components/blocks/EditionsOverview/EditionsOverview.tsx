import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/EditionsOverview/EditionsOverview.module.scss';
// import { InterfaceEditionsOverviewBlock } from '@/payload-types';

export type InterfaceEditionsOverviewPropTypes = {
  sampleProperty: string;
  context: 'sampleContext'
} & any;

const sampleClasses = cva([styles.baseStyle], {
  variants: {
    context: {
      sampleContext: [styles.sampleContextStyle],
    },
  },
});

export const EditionsOverview = ({
  context,
  sampleProperty,
}: InterfaceEditionsOverviewPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
