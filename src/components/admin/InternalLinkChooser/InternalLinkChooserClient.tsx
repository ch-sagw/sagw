'use client';

import React, {
  JSX, useEffect, useState,
} from 'react';
import {
  FieldLabel,
  Select,
  useField,
} from '@payloadcms/ui';
import type { Option } from '@payloadcms/ui/elements/ReactSelect/';
import { fieldLinkablePageFieldName } from '@/field-templates/linkablePage';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client';
import { InterfaceSlug } from '@/collections/Pages/pages';
import { generatePagePath } from '@/utilities/generatePagePath';
import {
  Config, InterfaceBreadcrumb,
} from '@/payload-types';
import { locales } from '@/i18n/locales';
import { extractLinkDataFromPage } from '@/utilities/extractLinkDataFromPage';

type LocalizedString = Partial<Record<Config['locale'], string>>;

interface InterfaceGroupedOptions {
  label: string;
  options: Option[];
}

interface InternalLinkChooserClientProps {
  currentId: string | number | undefined;
  path: string;
  collectionSlug: string;
  slugs: InterfaceSlug[];
  required: boolean;
  label?: string;
  description?: string;
  readOnly?: boolean;
}

interface InterfaceFetchPages {
  slugs: InterfaceSlug[];
  tenant: string;
  collectionSlug: string;
  currentId: string | number | undefined;
}

const collectionIsLinkablePage = (page: any): page is { isLinkable: boolean; adminTitle: string, id: string } => fieldLinkablePageFieldName in page && typeof page[fieldAdminTitleFieldName] === 'string';

// fetch collection pages

const fetchPages = async ({
  slugs,
  tenant,
  collectionSlug,
  currentId,
}: InterfaceFetchPages): Promise<InterfaceGroupedOptions[]> => {
  const allOptions: InterfaceGroupedOptions[] = [];

  if (!slugs) {
    return allOptions;
  }

  for await (const slug of slugs) {
    const res = await fetch(`/api/${slug.slug}?where[tenant][equals]=${tenant}&where[_status][equals]=published&limit=0`);
    const json = await res.json();
    const groupOptions: Option[] = [];

    if (json.docs) {
      for (const doc of json.docs) {
        let isNotCurrentPage = true;

        if (currentId) {
          isNotCurrentPage = `${slug.slug}/${doc.id}` !== `${collectionSlug}/${currentId}`;
        }

        if (collectionIsLinkablePage(doc) && isNotCurrentPage) {
          groupOptions.push({
            label: doc[fieldAdminTitleFieldName],
            value: {
              id: doc.id,
              slug: slug.slug,
            },
          });
        }
      }
    }

    if (groupOptions.length > 0) {
      allOptions.push({
        label: slug.displayName,
        options: groupOptions,
      });
    }

  }

  return allOptions;
};

// Fetch page data (breadcrumb, slug, tenant) for path generation
const fetchPageDataForPath = async ({
  collectionSlug,
  documentId,
}: {
  collectionSlug: string;
  documentId: string;
}): Promise<{
  breadcrumb: InterfaceBreadcrumb;
  slug: LocalizedString;
  tenant: string | null;
} | null> => {
  try {
    // Fetch page with locale 'all' to get all locale data
    // Use depth=1 to populate tenant relation
    const res = await fetch(`/api/${collectionSlug}/${documentId}?locale=all&depth=1`);

    if (!res.ok) {
      return null;
    }

    const pageData = await res.json();

    if (!pageData || !pageData.id) {
      return null;
    }

    return extractLinkDataFromPage({
      pageData,
    });
  } catch (error) {
    console.error(`Error fetching page data for ${collectionSlug}/${documentId}:`, error);

    return null;
  }
};

/**
 * Generate and set paths for all locales
 */
const generateAndSetPaths = async ({
  collectionSlug,
  documentId,
  tenantId,
  setPathDeValue,
  setPathFrValue,
  setPathItValue,
  setPathEnValue,
}: {
  collectionSlug: string;
  documentId: string;
  tenantId: string | null;
  setPathDeValue: (value: string | null) => void;
  setPathFrValue: (value: string | null) => void;
  setPathItValue: (value: string | null) => void;
  setPathEnValue: (value: string | null) => void;
}): Promise<void> => {
  if (!tenantId) {
    return;
  }

  const pageData = await fetchPageDataForPath({
    collectionSlug,
    documentId,
  });

  if (!pageData) {
    // Clear paths if page data couldn't be fetched
    setPathDeValue(null);
    setPathFrValue(null);
    setPathItValue(null);
    setPathEnValue(null);

    return;
  }

  for (const locale of locales) {
    const generatedPath = generatePagePath({
      breadcrumb: pageData.breadcrumb,
      locale,
      pageSlug: pageData.slug,
      tenant: pageData.tenant,
    });

    switch (locale) {
      case 'de':
        setPathDeValue(generatedPath || null);
        break;
      case 'fr':
        setPathFrValue(generatedPath || null);
        break;
      case 'it':
        setPathItValue(generatedPath || null);
        break;
      case 'en':
        setPathEnValue(generatedPath || null);
        break;
      default:
        // Unknown locale
        break;
    }
  }
};

// component

const InternalLinkChooserClient = ({
  currentId,
  path,
  collectionSlug,
  slugs,
  required,
  label,
  description,
  readOnly = false,
}: InternalLinkChooserClientProps): JSX.Element => {

  // hooks
  // For group fields, use nested paths
  const {
    value: slugValue,
    setValue: setSlugValue,
  } = useField<string | null>({
    path: `${path}.slug`,
  });

  const {
    value: idValue,
    setValue: setIdValue,
  } = useField<string | null>({
    path: `${path}.documentId`,
  });

  const {
    setValue: setPathDeValue,
  } = useField<string | null>({
    path: `${path}.pathde`,
  });

  const {
    setValue: setPathFrValue,
  } = useField<string | null>({
    path: `${path}.pathfr`,
  });

  const {
    setValue: setPathItValue,
  } = useField<string | null>({
    path: `${path}.pathit`,
  });

  const {
    setValue: setPathEnValue,
  } = useField<string | null>({
    path: `${path}.pathen`,
  });

  const {
    showError,
  } = useField({
    path,
  });

  // Combine slug and documentId into object
  const value = (slugValue && idValue)
    ? {
      id: idValue,
      slug: slugValue,
    }
    : null;

  // state

  const [
    options,
    setOptions,
  ] = useState<InterfaceGroupedOptions[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // effects
  const tenantContext = useTenantSelection();

  useEffect(() => {

    const loadOptions = async (tenant: string | null): Promise<void> => {
      setLoading(true);

      if (!tenant || !collectionSlug) {
        // If no tenant is selected, set loading to false and options to empty
        setOptions([]);
        setLoading(false);

        return;
      }

      const opts = await fetchPages({
        collectionSlug,
        currentId,
        slugs,
        tenant,
      });

      setOptions([...opts]);
      setLoading(false);
    };

    const selectedTenantID = tenantContext?.selectedTenantID;

    /* eslint-disable @typescript-eslint/no-floating-promises */
    loadOptions(selectedTenantID as string | null);
    /* eslint-enable @typescript-eslint/no-floating-promises */
  }, [
    collectionSlug,
    currentId,
    slugs,
    tenantContext?.selectedTenantID,
  ]);

  const flatOptions = options.flatMap((group) => group.options);

  // Find matching option by comparing slug and id
  const selectedOption = flatOptions.find((opt) => {
    if (typeof opt.value === 'object' && opt.value !== null && 'slug' in opt.value && 'id' in opt.value) {
      return opt.value.slug === value?.slug && opt.value.id === value?.id;
    }

    return false;
  });

  return (
    <div style={{
      marginBlockEnd: 'var(--spacing-field)',
    }}>
      <FieldLabel
        required={required}
        label={label}
        htmlFor={`field-${path}`}
      />
      <Select
        options={options}
        value={selectedOption}
        isLoading={loading}
        inputId={`field-${path}`}
        disabled={readOnly}
        getOptionValue={(option: Option) => {
          // Return a unique string identifier for React Select's internal use
          if (typeof option.value === 'object' && option.value !== null && 'slug' in option.value && 'id' in option.value) {
            return `${option.value.slug}/${option.value.id}`;
          }

          return String(option.value);
        }}
        onChange={async (newValue) => {
          if (readOnly) {
            return;
          }

          if (!newValue || Array.isArray(newValue)) {
            setSlugValue(null);
            setIdValue(null);
            setPathDeValue(null);
            setPathFrValue(null);
            setPathItValue(null);
            setPathEnValue(null);
          } else {
            const valueObj = newValue.value as { slug: string; id: string } | string;

            if (typeof valueObj === 'object' && valueObj !== null && 'slug' in valueObj && 'id' in valueObj) {
              const slug = String(valueObj.slug || '');
              const id = String(valueObj.id || '');

              // Set nested fields separately for group fields
              setIdValue(id);
              setSlugValue(slug);

              // Generate and store paths for all locales
              const selectedTenantID = tenantContext?.selectedTenantID as string | null;

              await generateAndSetPaths({
                collectionSlug: slug,
                documentId: id,
                setPathDeValue,
                setPathEnValue,
                setPathFrValue,
                setPathItValue,
                tenantId: selectedTenantID,
              });
            } else {
              setSlugValue(null);
              setIdValue(null);
              setPathDeValue(null);
              setPathFrValue(null);
              setPathItValue(null);
              setPathEnValue(null);
            }
          }
        }}
        showError={showError}
        isClearable
      />

      {description && (
        <div style={{
          color: 'var(--theme-elevation-400)',
          fontSize: '13px',
          marginBottom: '0.5rem',
          marginTop: '5px',
        }}>
          {description}
        </div>
      )}
    </div>
  );
};

export default InternalLinkChooserClient;
