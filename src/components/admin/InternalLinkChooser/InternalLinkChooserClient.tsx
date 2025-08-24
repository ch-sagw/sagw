'use client';

/*
TODO: issue on revalidation

Steps to reproduce:
- in rte2 field, mark a word, and click the link button
- in the overlay, choose internal link
- without filling in any value, click save

-->> the internalLinkChooser component seems to disappear, a regular
text field is rendered.

Similar issue? https://github.com/payloadcms/payload/issues/12138

*/

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
import { InterfaceTenantCollectionObject } from '@/collections';

interface InterfaceGroupedOptions {
  label: string;
  options: Option[];
}

interface InternalLinkChooserClientProps {
  currentId: string | number | undefined;
  path: string;
  data: any;
  collectionSlug: string;
  tenantsCollections: Record<string, InterfaceTenantCollectionObject>;
  required: boolean;
}

interface InterfaceFetchPages {
  tenantsCollections: Record<string, InterfaceTenantCollectionObject>;
  department: string;
  collectionSlug: string;
  currentId: string | number | undefined;
}

const collectionIsLinkablePage = (page: any): page is { isLinkable: boolean; adminTitle: string, id: string } => fieldLinkablePageFieldName in page && typeof page[fieldAdminTitleFieldName] === 'string';

const globalIsLinkablePage = (page: any): page is { isLinkable: boolean; adminTitle: string, id: string } => fieldLinkablePageFieldName in page &&
  typeof page[fieldAdminTitleFieldName] === 'string';

// fetch collection pages

const fetchCollectionPages = async ({
  tenantsCollections,
  department,
  collectionSlug,
  currentId,
}: InterfaceFetchPages): Promise<Option[]> => {
  const opts: Option[] = [];

  if (!tenantsCollections) {
    return opts;
  }

  for await (const collectionKey of Object.keys(tenantsCollections)) {
    const config = tenantsCollections[collectionKey];

    if (!config.isGlobal) {
      const res = await fetch(`/api/${collectionKey}?where[department][equals]=${department}`);
      const json = await res.json();

      for (const doc of json.docs) {
        let isNotCurrentPage = true;

        if (currentId) {
          isNotCurrentPage = `${collectionKey}/${doc.id}` !== `${collectionSlug}/${currentId}`;
        }

        if (collectionIsLinkablePage(doc) && isNotCurrentPage) {
          opts.push({
            label: doc[fieldAdminTitleFieldName],
            value: `${collectionKey}/${doc.id}`,
          });
        }
      }
    }
  }

  return opts;
};

// fetch global pages

const fetchGlobalPages = async ({
  tenantsCollections,
  department,
  collectionSlug,
  currentId,
}: InterfaceFetchPages): Promise<Option[]> => {
  const opts: Option[] = [];

  if (!tenantsCollections) {
    return opts;
  }

  for await (const collectionKey of Object.keys(tenantsCollections)) {
    const config = tenantsCollections[collectionKey];

    if (config.isGlobal) {
      const res = await fetch(`/api/${collectionKey}?where[department][equals]=${department}`);
      const json = await res.json();

      for (const doc of json.docs) {
        let isNotCurrentPage = true;

        if (currentId) {
          isNotCurrentPage = `${collectionKey}/${doc.id}` !== `${collectionSlug}/${currentId}`;
        }

        if (globalIsLinkablePage(doc) && isNotCurrentPage) {
          opts.push({
            label: doc[fieldAdminTitleFieldName],
            value: `${collectionKey}/${doc.id}`,
          });
        }
      }
    }
  }

  return opts;
};

// component

const InternalLinkChooserClient = ({
  currentId,
  path,
  data,
  collectionSlug,
  tenantsCollections,
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

  useEffect(() => {
    const loadOptions = async (): Promise<void> => {
      setLoading(true);
      const [
        globalOpts,
        collectionOpts,
      ] = await Promise.all([
        fetchGlobalPages({
          collectionSlug,
          currentId,
          department: data?.department,
          tenantsCollections,
        }),
        fetchCollectionPages({
          collectionSlug,
          currentId,
          department: data?.department,
          tenantsCollections,
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

    if (data?.department && collectionSlug) {
      loadOptions();
    }
  }, [
    data?.department,
    collectionSlug,
    currentId,
    tenantsCollections,
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
