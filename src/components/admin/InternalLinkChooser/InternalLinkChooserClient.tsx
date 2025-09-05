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
import { InterfaceSlug } from '@/collections/Pages';

interface InterfaceGroupedOptions {
  label: string;
  options: Option[];
}

interface InternalLinkChooserClientProps {
  currentId: string | number | undefined;
  path: string;
  collectionSlug: string;
  setsSlugs: InterfaceSlug[];
  singletonSlugs: InterfaceSlug[];
  required: boolean;
}

interface InterfaceFetchPages {
  slugs: InterfaceSlug[];
  department: string;
  collectionSlug: string;
  currentId: string | number | undefined;
}

const collectionIsLinkablePage = (page: any): page is { isLinkable: boolean; adminTitle: string, id: string } => fieldLinkablePageFieldName in page && typeof page[fieldAdminTitleFieldName] === 'string';

const globalIsLinkablePage = (page: any): page is { isLinkable: boolean; adminTitle: string, id: string } => fieldLinkablePageFieldName in page &&
  typeof page[fieldAdminTitleFieldName] === 'string';

// fetch collection pages

const fetchCollectionPages = async ({
  slugs,
  department,
  collectionSlug,
  currentId,
}: InterfaceFetchPages): Promise<Option[]> => {
  const opts: Option[] = [];

  if (!slugs) {
    return opts;
  }

  for await (const slug of slugs) {
    const res = await fetch(`/api/${slug.slug}?where[department][equals]=${department}`);
    const json = await res.json();

    for (const doc of json.docs) {
      let isNotCurrentPage = true;

      if (currentId) {
        isNotCurrentPage = `${slug.slug}/${doc.id}` !== `${collectionSlug}/${currentId}`;
      }

      if (collectionIsLinkablePage(doc) && isNotCurrentPage) {
        opts.push({
          label: doc[fieldAdminTitleFieldName],
          value: `${slug.slug}/${doc.id}`,
        });
      }
    }
  }

  return opts;
};

// fetch global pages

const fetchGlobalPages = async ({
  slugs,
  department,
  collectionSlug,
  currentId,
}: InterfaceFetchPages): Promise<Option[]> => {
  const opts: Option[] = [];

  if (!slugs) {
    return opts;
  }

  for await (const slug of slugs) {
    const res = await fetch(`/api/${slug.slug}?where[department][equals]=${department}`);
    const json = await res.json();

    for (const doc of json.docs) {
      let isNotCurrentPage = true;

      if (currentId) {
        isNotCurrentPage = `${slug.slug}/${doc.id}` !== `${collectionSlug}/${currentId}`;
      }

      if (globalIsLinkablePage(doc) && isNotCurrentPage) {
        opts.push({
          label: doc[fieldAdminTitleFieldName],
          value: `${slug.slug}/${doc.id}`,
        });
      }
    }
  }

  return opts;
};

// component

const InternalLinkChooserClient = ({
  currentId,
  path,
  collectionSlug,
  setsSlugs,
  singletonSlugs,
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
      const [
        globalOpts,
        collectionOpts,
      ] = await Promise.all([
        fetchGlobalPages({
          collectionSlug,
          currentId,
          department: tenant,
          slugs: singletonSlugs,
        }),
        fetchCollectionPages({
          collectionSlug,
          currentId,
          department: tenant,
          slugs: setsSlugs,
        }),
      ]);

      setOptions([
        {
          label: 'Global Pages',
          options: globalOpts,
        },
        {
          label: 'Detail Pages',
          options: collectionOpts,
        },
      ]);

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
    setsSlugs,
    singletonSlugs,
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
