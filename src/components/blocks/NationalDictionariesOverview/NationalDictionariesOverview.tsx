import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/NationalDictionariesOverview/NationalDictionariesOverview.module.scss';
// import { InterfaceNationalDictionariesOverviewBlock } from '@/payload-types';

export type InterfaceNationalDictionariesOverviewPropTypes = {
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

export const NationalDictionariesOverview = ({
  context,
  sampleProperty,
}: InterfaceNationalDictionariesOverviewPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
