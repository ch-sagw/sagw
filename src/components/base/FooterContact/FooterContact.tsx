import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/FooterContact/FooterContact.module.scss';
import { InterfaceFooterContact } from '@/payload-types';

export type InterfaceFooterContactPropTypes = {
  sampleProperty: string;
  context: 'sampleContext'
} & InterfaceFooterContact;

const sampleClasses = cva([styles.baseStyle], {
  variants: {
    context: {
      sampleContext: [styles.sampleContextStyle],
    },
  },
});

export const FooterContact = ({
  context,
  sampleProperty,
}: InterfaceFooterContactPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
