import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/FooterContact/FooterContact.module.scss';
import { InterfaceFooterContact } from '@/payload-types';

export type InterfaceFooterContactPropTypes = {
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
}: InterfaceFooterContactPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
    itemScope
    itemType='https://schema.org/Organization'
  >
    {/* Name */}
    <span itemProp='name'>
      SAGW Schweizerische Akademie der Geistes- und Sozialwissenschaften
    </span>

    {/* Address */}
    <div itemProp='address' itemScope itemType='https://schema.org/PostalAddress'>
      <span itemProp='streetAddress'>
        Haus der Akademien<br />
        Laupenstrasse 7<br />
        Postfach
      </span>
      <span itemProp='postalCode'>3001</span>
      <span itemProp='addressLocality'>Bern</span>
      <span itemProp='addressCountry'>CH</span>
    </div>

    {/* Phone */}
    <span itemProp='telephone'>+41 31 306 92 50</span>

    {/* Mail */}
    <span itemProp='email'>sagw@sagw.ch</span>

    {/* Logo */}
    <span itemProp='image' content='https://sagw.ch/logo.svg' style={{
      display: 'none',
    }}>SAGW Logo</span>
  </div>
);
