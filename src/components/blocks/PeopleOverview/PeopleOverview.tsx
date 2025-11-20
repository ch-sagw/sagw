import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/PeopleOverview/PeopleOverview.module.scss';
// import { InterfacePeopleOverviewBlock } from '@/payload-types';

export type InterfacePeopleOverviewPropTypes = {
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

export const PeopleOverview = ({
  context,
  sampleProperty,
}: InterfacePeopleOverviewPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
