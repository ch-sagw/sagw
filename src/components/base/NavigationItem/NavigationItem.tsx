import 'server-only';
import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/NavigationItem/NavigationItem.module.scss';
import { InterfaceNavigationItem } from '@/payload-types';

export type InterfaceNavigationItemPropTypes = {
  sampleProperty: string;
  context: 'sampleContext'
} & InterfaceNavigationItem;

const sampleClasses = cva([styles.baseStyle], {
  variants: {
    context: {
      sampleContext: [styles.sampleContextStyle],
    },
  },
});

export const NavigationItem = ({
  context,
  sampleProperty,
}: InterfaceNavigationItemPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
