'use server';

// import { Select } from '@payloadcms/ui';
import {
  CollectionSlug, UIFieldServerProps,
} from 'payload';
import { JSX } from 'react';
import type { Option } from '@payloadcms/ui/elements/ReactSelect/';
import InternalLinkChooserClient from './InternalLinkChooserClient';
import { fieldLinkablePageFieldName } from '@/field-templates/linkablePage';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import { tenantsCollections } from '@/collections';

const collectionIsLinkablePage = (page: any): page is { isLinkable: boolean; adminTitle: string } => fieldLinkablePageFieldName in page && typeof page[fieldAdminTitleFieldName] === 'string';
const globalIsLinkablePage = (page: any): page is { isLinkable: boolean; adminTitle: string } => fieldLinkablePageFieldName in page &&
  typeof page[fieldAdminTitleFieldName] === 'string';

// TODO: only pages of same tenant should be linkable
// TODO: global, page.slug seams not available

// Create select options for Collection Pages
const getCollectionPageOptions = async (props: UIFieldServerProps): Promise<Option[]> => {
  const collectionKeys = Object.keys(tenantsCollections) as CollectionSlug[];
  const options: Option[] = [];

  for await (const collection of collectionKeys) {
    const collectionConfigObject = tenantsCollections[collection];

    if (!collectionConfigObject.isGlobal) {
      const pageResults = await props.payload.find({
        collection,
        depth: 1,
      });

      pageResults.docs.forEach((pageResult): void => {
        if (collectionIsLinkablePage(pageResult)) {
          options.push({
            label: pageResult[fieldAdminTitleFieldName],
            value: `${collection}/${pageResult.id}`,
          });
        }
      });
    }
  }

  return options
    .filter((option) => option.value !== `${props.collectionSlug}/${props.data.id}`);
};

// Create select options for Global Pages
const getGlobalPagesOption = async (props: UIFieldServerProps): Promise<Option[]> => {
  const collectionKeys = Object.keys(tenantsCollections) as CollectionSlug[];
  const options: Option[] = [];

  for await (const collection of collectionKeys) {
    const collectionConfigObject = tenantsCollections[collection];

    if (collectionConfigObject.isGlobal) {
      const pageResults = await props.payload.find({
        collection,
        depth: 1,
      });

      pageResults.docs.forEach((pageResult): void => {
        if (globalIsLinkablePage(pageResult)) {
          if (pageResult.id && pageResult[fieldAdminTitleFieldName]) {
            options.push({
              label: pageResult[fieldAdminTitleFieldName],
              value: `${collection}/${pageResult.id}`,
            });
          }
        }
      });
    }
  }

  return options
    .filter((option) => option.value !== `${props.collectionSlug}/${props.data.id}`);

};

// Select component
const InternalLinkChooser = async (props: UIFieldServerProps): Promise<JSX.Element> => {
  const globalPageOptions = await getGlobalPagesOption(props);
  const collectionPageOptions = await getCollectionPageOptions(props);

  const options = [
    {
      label: 'Global Pages',
      options: globalPageOptions,
    },
    {
      label: 'Detail Pages',
      options: collectionPageOptions,
    },
  ];

  return (
    <div>
      <InternalLinkChooserClient
        options={options}
        path={props.path}
      />
    </div>
  );
};

export default InternalLinkChooser;
