import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/MagazineOverview/MagazineOverview.module.scss';
// import { InterfaceMagazineOverviewBlock } from '@/payload-types';

export type InterfaceMagazineOverviewPropTypes = {
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

export const MagazineOverview = ({
  context,
  sampleProperty,
}: InterfaceMagazineOverviewPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
