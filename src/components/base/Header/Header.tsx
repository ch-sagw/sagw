import 'server-only';
import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Header/Header.module.scss';
import { InterfaceHeader } from '@/payload-types';

export type InterfaceHeaderPropTypes = {
  sampleProperty: string;
  context: 'sampleContext'
} & InterfaceHeader;

const sampleClasses = cva([styles.baseStyle], {
  variants: {
    context: {
      sampleContext: [styles.sampleContextStyle],
    },
  },
});

export const Header = ({
  context,
  sampleProperty,
}: InterfaceHeaderPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
