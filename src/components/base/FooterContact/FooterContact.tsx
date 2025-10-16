import React, { Fragment } from 'react';
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
}: InterfaceFooterContactPropTypes): React.JSX.Element => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'CH',
      'addressLocality': 'Bern',
      'postalCode': '3001',
      'streetAddress': 'Laupenstrasse 7, Postfach',
    },
    'email': 'sagw@sagw.ch',
    'name': 'SAGW Schweizerische Akademie der Geistes- und Sozialwissenschaften',
    'telephone': '+41 31 306 92 50',
    'url': 'https://sagw.ch',
  };

  return (
    <Fragment>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          /* eslint-disable @typescript-eslint/naming-convention */
          __html: JSON.stringify(structuredData),
          /* eslint-enable @typescript-eslint/naming-convention */
        }}
      />

      <div
        className={sampleClasses({
          context: context ?? undefined,
        })}
      >
        {/* Name */}
        SAGW Schweizerische Akademie der Geistes- und Sozialwissenschaften

        {/* Address */}
        Haus der Akademien
        Laupenstrasse 7
        Postfach

        {/* ZIP and City */}
        CH-3001 Bern

        {/* Phone */}
        +41 31 306 92 50

        {/* Mail */}
        sagw@sagw.ch
      </div>
    </Fragment>
  );
};
