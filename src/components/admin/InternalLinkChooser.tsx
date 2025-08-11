'use server';

// import { Select } from '@payloadcms/ui';
import {
  CollectionSlug, UIFieldServerProps,
} from 'payload';
import { JSX } from 'react';
import type { Option } from '@payloadcms/ui/elements/ReactSelect/';
import { globalPages } from '@/config/availablePages';
import InternalLinkChooserClient from './InternalLinkChooserClient';

// Create select options for Global Pages
const getGlobalPageOptions = (props: UIFieldServerProps): Option[] => globalPages
  .map((page) => ({
    label: page,
    value: `global:${page}`,
  }))
  .filter((option) => option.value !== `global:${props.data.globalType}`);

const isLinkablePage = (page: any): page is { isLinkable: boolean; hero: { title: string } } => 'isLinkable' in page && page.hero !== undefined && typeof page.hero.title === 'string';

// Create select options for Collection Pages
const getCollectionPageOptions = async (props: UIFieldServerProps): Promise<Option[]> => {
  const collectionKeys = Object.keys(props.payload.collections) as CollectionSlug[];
  const options: Option[] = [];

  for await (const collection of collectionKeys) {
    const pageResults = await props.payload.find({
      collection,
      depth: 1,
    });

    pageResults.docs.forEach((pageResult): void => {
      if (isLinkablePage(pageResult)) {

        options.push({
          label: pageResult.hero.title,
          value: `${collection}/${pageResult.id}`,
        });
      }
    });

  }

  return options
    .filter((option) => option.value !== `${props.collectionSlug}/${props.data.id}`);
};

// Select component
const InternalLinkChooser = async (props: UIFieldServerProps): Promise<JSX.Element> => {
  const globalPageOptions = getGlobalPageOptions(props);
  const collectionPageOptions = await getCollectionPageOptions(props);

  // console.log(props.payload.globals);

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
