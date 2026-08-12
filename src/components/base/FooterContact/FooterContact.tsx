'use client';

import React, { useState } from 'react';
import styles from '@/components/base/FooterContact/FooterContact.module.scss';
import type {
  Organization, WithContext,
} from 'schema-dts';
import { useTranslations } from 'next-intl';
import { SafeHtml } from '../SafeHtml/SafeHtml';
import { Button } from '@/components/base/Button/Button';
import {
  InterfaceResolveMailtoAction, openMailto,
} from '@/components/helpers/writeEmail';

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
  // The email address itself is intentionally never passed to (or
  // rendered by) this component. It is resolved on click through the
  // resolveMailto server action (passed down as a prop, so this
  // component stays renderable in Storybook without bundling payload).
  hasMail?: boolean;
  resolveMailtoAction?: InterfaceResolveMailtoAction;
  tenantId?: string;
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
    hasMail,
    resolveMailtoAction,
    tenantId,
    className,
  } = props;

  const internalI18nContact = useTranslations('contact');
  const [
    isMailLoading,
    setIsMailLoading,
  ] = useState(false);

  const handleMailClick = async (): Promise<void> => {
    if (!tenantId) {
      return;
    }

    setIsMailLoading(true);

    try {
      await openMailto({
        action: resolveMailtoAction,
        input: {
          source: 'footer',
          tenantId,
        },
      });
    } finally {
      setIsMailLoading(false);
    }
  };

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

          {hasMail && tenantId &&
            <Button
              className={styles.mailButton}
              element='button'
              colorMode='dark'
              style='text'
              text={internalI18nContact('writeEmail')}
              isLoading={isMailLoading}
              onClick={(): Promise<void> => handleMailClick()}
            />
          }
        </p>
      </div>
    </div>
  );
};
