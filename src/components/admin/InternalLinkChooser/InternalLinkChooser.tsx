'use server';

// import { Select } from '@payloadcms/ui';
import {
  CollectionSlug, PaginatedDocs, UIFieldServerProps,
} from 'payload';
import { JSX } from 'react';
import type { Option } from '@payloadcms/ui/elements/ReactSelect/';
import InternalLinkChooserClient from '@/components/admin/InternalLinkChooser/InternalLinkChooserClient';
import { fieldLinkablePageFieldName } from '@/field-templates/linkablePage';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import { tenantsCollections } from '@/collections';

const collectionIsLinkablePage = (page: any): page is { isLinkable: boolean; adminTitle: string, id: string } => fieldLinkablePageFieldName in page && typeof page[fieldAdminTitleFieldName] === 'string';
const globalIsLinkablePage = (page: any): page is { isLinkable: boolean; adminTitle: string, id: string } => fieldLinkablePageFieldName in page &&
  typeof page[fieldAdminTitleFieldName] === 'string';

const findPage = (collection: CollectionSlug, props: UIFieldServerProps): Promise<PaginatedDocs<any>> => props.payload.find({
  collection,
  depth: 1,
  where: {
    department: {
      equals: props.data.department,
    },
  },
});

// Create select options for Collection Pages
const getCollectionPageOptions = async (props: UIFieldServerProps): Promise<Option[]> => {
  const collectionKeys = Object.keys(tenantsCollections) as CollectionSlug[];
  const options: Option[] = [];

  for await (const collection of collectionKeys) {
    const collectionConfigObject = tenantsCollections[collection];

    if (!collectionConfigObject.isGlobal) {
      const pageResults = await findPage(collection, props);

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

  console.log(props.data.department);

  for await (const collection of collectionKeys) {
    const collectionConfigObject = tenantsCollections[collection];

    if (collectionConfigObject.isGlobal) {
      const pageResults = await findPage(collection, props);

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

const zenodoTest = async (): Promise<void> => {

  const results = await fetch(`https://zenodo.org/api/records/14366030?access_token=${process.env.ZENODO_TOKEN}`);

  const resultJson = await results.json();

  console.log(resultJson);

};

// Select component
const InternalLinkChooser = async (props: UIFieldServerProps): Promise<JSX.Element> => {
  const globalPageOptions = await getGlobalPagesOption(props);
  const collectionPageOptions = await getCollectionPageOptions(props);

  await zenodoTest();

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
