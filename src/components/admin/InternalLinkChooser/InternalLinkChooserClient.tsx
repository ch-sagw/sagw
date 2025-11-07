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

    if (groupOptions.length > 0) {
      allOptions.push({
        label: slug.displayName,
        options: groupOptions,
      });
    }

  }

  return allOptions;
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

    const loadOptions = async (tenant: string): Promise<void> => {
      setLoading(true);
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

    if (selectedTenantID && collectionSlug) {
      /* eslint-disable @typescript-eslint/no-floating-promises */
      loadOptions(selectedTenantID as string);
      /* eslint-enable @typescript-eslint/no-floating-promises */

    } else {
      // If no tenant is selected, set loading to false and options to empty
      setLoading(false);
      setOptions([]);
    }
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
    <div>
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
        getOptionValue={(option: Option) => {
          // Return a unique string identifier for React Select's internal use
          if (typeof option.value === 'object' && option.value !== null && 'slug' in option.value && 'id' in option.value) {
            return `${option.value.slug}/${option.value.id}`;
          }

          return String(option.value);
        }}
        onChange={(newValue) => {
          if (!newValue || Array.isArray(newValue)) {
            setSlugValue(null);
            setIdValue(null);
          } else {
            const valueObj = newValue.value as { slug: string; id: string } | string;

            if (typeof valueObj === 'object' && valueObj !== null && 'slug' in valueObj && 'id' in valueObj) {
              const slug = String(valueObj.slug || '');
              const id = String(valueObj.id || '');

              // Set nested fields separately for group fields
              setIdValue(id);
              setSlugValue(slug);
            } else {
              setSlugValue(null);
              setIdValue(null);
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
