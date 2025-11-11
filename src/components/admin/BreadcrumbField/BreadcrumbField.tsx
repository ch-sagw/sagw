'use client';

import { JSX } from 'react';
import { reduceFieldsToValues } from 'payload/shared';
import {
  useAllFormFields, useLocale,
} from '@payloadcms/ui';

const BreadcrumbField = (): JSX.Element | null => {
  const [formFields] = useAllFormFields();
  const formData = reduceFieldsToValues(formFields, true) as Record<string, unknown>;
  const locale = useLocale();

  const crumbs = Array.isArray(formData?.breadcrumb)
    ? (formData.breadcrumb as Record<string, unknown>[])
    : [];

  if (!crumbs.length) {
    return null;
  }

  // determine current admin locale via Payload hook (fallback to 'de')
  const [currentLocale] = ((locale?.code as string) || 'de').split('-');

  const localeToNameField: Record<string, 'namede' | 'namefr' | 'nameit' | 'nameen'> = {
    de: 'namede',
    en: 'nameen',
    fr: 'namefr',
    it: 'nameit',
  };

  const preferredField = localeToNameField[currentLocale] ?? 'namede';
  const fallbackOrder: ('namede' | 'namefr' | 'nameit' | 'nameen')[] = [
    preferredField,
    'namede',
    'namefr',
    'nameit',
    'nameen',
  ];

  const parts = crumbs
    .map((c) => {
      const value = fallbackOrder
        .map((key) => (c?.[key] as unknown))
        .find((v) => typeof v === 'string' && v.trim().length > 0) as string | undefined;

      return value
        ? value.trim()
        : null;
    })
    .filter((v): v is string => Boolean(v));

  if (!parts.length) {
    return null;
  }

  return (
    <div>
      <p style={{
        color: 'var(--theme-elevation-800)',
        fontSize: '13px',
        paddingBlockEnd: '5px',
      }}>Breadcrumb</p>
      <div style={{
        background: 'var(--theme-elevation-100)',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 'var(--style-radius-s)',
        fontSize: '13px',
        marginTop: 4,
        padding: '8px 15px',
      }}>{parts.join(' -> ')}</div>
    </div>
  );
};

export default BreadcrumbField;

