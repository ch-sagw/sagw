import React from 'react';
import { cva } from 'cva';
import styles from '@/components/global/Footer/Footer.module.scss';
import { InterfaceFooter } from '@/payload-types';

export type InterfaceFooterPropTypes = {
  sampleProperty: string;
  context: 'sampleContext'
} & InterfaceFooter;

const sampleClasses = cva([styles.baseStyle], {
  variants: {
    context: {
      sampleContext: [styles.sampleContextStyle],
    },
  },
});

export const Footer = ({
  context,
  sampleProperty,
}: InterfaceFooterPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
