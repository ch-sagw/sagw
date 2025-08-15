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

const isLinkablePage = (page: any): page is { isLinkable: boolean; adminTitle: string } => fieldLinkablePageFieldName in page && typeof page[fieldAdminTitleFieldName] === 'string';

// convert camelCase/PascalCase to human readable string
const humanizeSlug = (slug: string): string => {
  const withSpaces = slug.replace(/(?:[A-Z])/gu, (match) => ` ${match}`);

  return withSpaces
    .split(' ')
    .map((word) => word.charAt(0)
      .toUpperCase() + word.slice(1))
    .join(' ');
};

// Create select options for Collection Pages
const getCollectionPageOptions = async (props: UIFieldServerProps): Promise<Option[]> => {
  const collectionKeys = Object.keys(props.payload.collections) as CollectionSlug[];
  const options: Option[] = [];

  for await (const collection of collectionKeys) {
    const pageResults = await props.payload.find({
      collection,
      depth: 3,
    });

    if (collection === 'network') {
      console.log(pageResults);
    }

    pageResults.docs.forEach((pageResult): void => {
      if (isLinkablePage(pageResult)) {

        options.push({
          label: pageResult[fieldAdminTitleFieldName],
          value: `${collection}/${pageResult.id}`,
        });
      }
    });
  }

  return options
    .filter((option) => option.value !== `${props.collectionSlug}/${props.data.id}`);
};

// Create select options for Global Pages
const getGlobalPagesOption = async (props: UIFieldServerProps): Promise<Option[]> => {
  const options: Option[] = [];

  for await (const globalPage of props.payload.globals.config) {
    const pageResult = await props.payload.findGlobal({
      depth: 1,
      slug: globalPage.slug,
    });

    if (Object.keys(pageResult)
      .includes(fieldLinkablePageFieldName)) {

      if (globalPage.slug !== props.data.globalType) {
        options.push({
          label: humanizeSlug(globalPage.slug),
          value: `global:${globalPage.slug}`,
        });
      }
    }
  }

  return options;
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
