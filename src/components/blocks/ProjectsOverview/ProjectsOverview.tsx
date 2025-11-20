import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/ProjectsOverview/ProjectsOverview.module.scss';
// import { InterfaceProjectsOverview } from '@/payload-types';

export type InterfaceProjectsOverviewPropTypes = {
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

export const ProjectsOverview = ({
  context,
  sampleProperty,
}: InterfaceProjectsOverviewPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
