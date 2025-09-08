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
}

interface InterfaceFetchPages {
  slugs: InterfaceSlug[];
  department: string;
  collectionSlug: string;
  currentId: string | number | undefined;
}

const collectionIsLinkablePage = (page: any): page is { isLinkable: boolean; adminTitle: string, id: string } => fieldLinkablePageFieldName in page && typeof page[fieldAdminTitleFieldName] === 'string';

// fetch collection pages

const fetchPages = async ({
  slugs,
  department,
  collectionSlug,
  currentId,
}: InterfaceFetchPages): Promise<InterfaceGroupedOptions[]> => {
  const allOptions: InterfaceGroupedOptions[] = [];

  if (!slugs) {
    return allOptions;
  }

  for await (const slug of slugs) {
    const res = await fetch(`/api/${slug.slug}?where[department][equals]=${department}`);
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
          value: `${slug.slug}/${doc.id}`,
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
}: InternalLinkChooserClientProps): JSX.Element => {

  // hooks

  const {
    value, setValue,
    showError,
  } = useField<string | null>({
    path,
  });

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
        department: tenant,
        slugs,
      });

      setOptions([...opts]);

      setLoading(false);
    };

    if (tenantContext.selectedTenantID && collectionSlug) {
      /* eslint-disable @typescript-eslint/no-floating-promises */
      loadOptions(tenantContext.selectedTenantID as string);
      /* eslint-enable @typescript-eslint/no-floating-promises */

    }
  }, [
    collectionSlug,
    currentId,
    slugs,
    tenantContext.selectedTenantID,
  ]);

  const flatOptions = options.flatMap((group) => group.options);
  const selectedOption = flatOptions.find((opt) => opt.value === value);

  return (
    <div>
      <FieldLabel
        required={required}
        label='Link Target'
        htmlFor={`field-${path}`}
      />
      <Select
        options={options}
        value={selectedOption}
        isLoading={loading}
        inputId={`field-${path}`}
        onChange={(newValue) => {
          if (!newValue || Array.isArray(newValue)) {
            setValue(null);
          } else {
            setValue(newValue.value as string);
          }
        }}
        showError={showError}
        isClearable
      />
    </div>
  );
};

export default InternalLinkChooserClient;
