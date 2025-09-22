import 'server-only';
import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Navigation/Navigation.module.scss';
import { InterfaceNavigation } from '@/payload-types';

export type InterfaceNavigationPropTypes = {
  sampleProperty: string;
  context: 'sampleContext'
} & InterfaceNavigation;

const sampleClasses = cva([styles.baseStyle], {
  variants: {
    context: {
      sampleContext: [styles.sampleContextStyle],
    },
  },
});

export const Navigation = ({
  context,
  sampleProperty,
}: InterfaceNavigationPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
