import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/FooterLogo/FooterLogo.module.scss';
import { InterfaceFooterLogo } from '@/payload-types';

export type InterfaceFooterLogoPropTypes = {
  sampleProperty: string;
  context: 'sampleContext'
} & InterfaceFooterLogo;

const sampleClasses = cva([styles.baseStyle], {
  variants: {
    context: {
      sampleContext: [styles.sampleContextStyle],
    },
  },
});

export const FooterLogo = ({
  context,
  sampleProperty,
}: InterfaceFooterLogoPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
