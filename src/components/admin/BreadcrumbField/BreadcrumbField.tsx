'use client';

import {
  JSX, useEffect, useMemo, useRef, useState,
} from 'react';
import { reduceFieldsToValues } from 'payload/shared';
import {
  useAllFormFields, useLocale,
} from '@payloadcms/ui';
import { fieldParentSelectorFieldName } from '@/field-templates/parentSelector';
import type { Config } from '@/payload-types';

type LocalizedString = Partial<Record<Config['locale'], string | null>>;

type BreadcrumbItem = {
  documentId: string;
  name: LocalizedString;
  slug: LocalizedString;
};

type ParentPageRef = {
  slug?: string;
  documentId?: string;
} | null | undefined;

const parentRefKey = (ref: ParentPageRef): string => {
  if (!ref || typeof ref !== 'object') {
    return '';
  }

  return `${ref.slug ?? ''}::${ref.documentId ?? ''}`;
};

// Previews the breadcrumb that would render in the frontend for the
// currently selected parentPage reference. Breadcrumbs are no longer
// persisted, so we compute them on the fly via a small admin endpoint.
const BreadcrumbField = (): JSX.Element | null => {
  const [formFields] = useAllFormFields();
  const formData = reduceFieldsToValues(formFields, true) as Record<string, unknown>;
  const locale = useLocale();

  const parentPage = formData?.[fieldParentSelectorFieldName] as ParentPageRef;
  const parentKey = parentRefKey(parentPage);

  const [
    crumbs,
    setCrumbs,
  ] = useState<BreadcrumbItem[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();

    if (!parentPage || typeof parentPage !== 'object' || !parentPage.slug || !parentPage.documentId) {
      abortRef.current = null;

      return undefined;
    }

    const controller = new AbortController();

    abortRef.current = controller;

    const fetchPreview = async (): Promise<void> => {
      try {
        const response = await fetch('/api/admin/breadcrumb-preview', {
          body: JSON.stringify({
            parentPage,
          }),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          signal: controller.signal,
        });

        if (!response.ok) {
          setCrumbs([]);

          return;
        }

        const data = await response.json() as { breadcrumb?: BreadcrumbItem[] };

        setCrumbs(Array.isArray(data.breadcrumb)
          ? data.breadcrumb
          : []);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setCrumbs([]);
        }
      }
    };

    fetchPreview()
      .catch(() => {
        // handled above
      });

    return (): void => {
      controller.abort();
    };
    // parentKey changes with parentPage; safe single-source key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentKey]);

  // If the parent gets cleared, reset the preview without writing state in
  // the effect body that fetches.
  useEffect(() => {
    if (!parentPage || typeof parentPage !== 'object' || !parentPage.slug || !parentPage.documentId) {
      setCrumbs([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentKey]);

  const parts = useMemo(() => {
    const [currentLocale] = ((locale?.code as string) || 'de').split('-');
    const preferredLocale = (currentLocale as Config['locale']) ?? 'de';
    const fallbackOrder: Config['locale'][] = [
      preferredLocale,
      'de',
      'fr',
      'it',
      'en',
    ];

    return crumbs
      .map((c) => {
        const value = fallbackOrder
          .map((key) => c?.name?.[key])
          .find((v) => typeof v === 'string' && v.trim().length > 0) as string | undefined;

        return value
          ? value.trim()
          : null;
      })
      .filter((v): v is string => Boolean(v));
  }, [
    crumbs,
    locale?.code,
  ]);

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
        padding: '8px 15px',
      }}>{parts.join(' -> ')}</div>
      <p style={{
        color: 'var(--theme-elevation-400)',
        fontSize: '13px',
        marginBottom: '0.5rem',
        marginTop: '5px',
      }}>This is a preview of the breadcrumb as it would render in the frontend.</p>
    </div>
  );
};

export default BreadcrumbField;
