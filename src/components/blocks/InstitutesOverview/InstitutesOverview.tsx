import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/InstitutesOverview/InstitutesOverview.module.scss';
// import { InterfaceInstitutesOverviewBlock } from '@/payload-types';

export type InterfaceInstitutesOverviewPropTypes = {
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

export const InstitutesOverview = ({
  context,
  sampleProperty,
}: InterfaceInstitutesOverviewPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
