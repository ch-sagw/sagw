import React from 'react';
import styles from '@/components/base/FooterContact/FooterContact.module.scss';
import type {
  Organization, WithContext,
} from 'schema-dts';
import { SafeHtml } from '../SafeHtml/SafeHtml';

export type InterfaceFooterContactPropTypes = {
  title: {
    plain: string;
    rte: string;
  };
  address1: {
    plain: string;
    rte: string;
  };
  countryCode: string;
  zip: string;
  city: string;
  url: string;
  imageUrl: string;
  address2?: {
    plain: string;
    rte: string;
  };
  poBox?: string;
  phone?: string;
  mail?: string;
  className?: string;
};

const constructStructuredData = ({
  title,
  address1,
  countryCode,
  zip,
  city,
  url,
  imageUrl,
  address2,
  poBox,
  phone,
  mail,
}: InterfaceFooterContactPropTypes): WithContext<Organization> => {
  let streetAddress = address1.plain;

  if (address2?.plain) {
    streetAddress += `, ${address2.plain}`;
  }

  if (poBox) {
    streetAddress += `, ${poBox}`;
  }

  const data: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': countryCode,
      'addressLocality': city,
      'postalCode': zip,
      streetAddress,
    },
    'email': mail ?? undefined,
    'image': imageUrl,
    'name': title.plain,
    'telephone': phone || undefined,
    url,
  };

  return data;
};

export const FooterContact = (props: InterfaceFooterContactPropTypes): React.JSX.Element => {
  const {
    title,
    address1,
    countryCode,
    zip,
    city,
    address2,
    poBox,
    phone,
    mail,
    className,
  } = props;

  return (
    <div className={`${styles.footer} ${className}`}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          /* eslint-disable @typescript-eslint/naming-convention */
          __html: JSON.stringify(constructStructuredData(props)),
          /* eslint-enmdisable @typescript-eslint/naming-convention */
        }}
      />
      <div
        className={styles.content}
      >
        {/* Name */}
        <SafeHtml
          as='p'
          className={styles.title}
          html={title.rte}
        />

        {/* Address */}
        <p className={styles.address}>
          <SafeHtml
            as='span'
            html={address1.rte}
          />

          {address2 &&
            <SafeHtml
              as='span'
              html={address2.rte}
            />
          }

          {poBox &&
            <span>{poBox}</span>
          }

          <SafeHtml
            as='span'
            html={`${countryCode}-${zip} ${city}`}
          />
        </p>

        {/* Contact */}
        <p className={styles.contact}>
          {phone &&
            <a href={`tel:${phone}`}>{phone}</a>
          }

          {mail &&
            <a href={`mailto:${mail}`}>{mail}</a>
          }
        </p>
      </div>
    </div>
  );
};
