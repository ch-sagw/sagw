'use client';

import { JSX } from 'react';
import { reduceFieldsToValues } from 'payload/shared';
import { useAllFormFields } from '@payloadcms/ui';

const BreadcrumbField = (): JSX.Element | null => {
  const [formFields] = useAllFormFields();
  const formData = reduceFieldsToValues(formFields, true) as Record<string, unknown>;

  const crumbs = Array.isArray(formData?.breadcrumb)
    ? (formData.breadcrumb as Record<string, unknown>[])
    : [];

  if (!crumbs.length) {
    return null;
  }

  const parts = crumbs
    .map((c) => {
      const val = c?.namede;

      return typeof val === 'string' && val.trim().length > 0
        ? val.trim()
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

