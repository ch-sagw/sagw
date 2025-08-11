'use server';

// import { Select } from '@payloadcms/ui';
import { UIFieldServerProps } from 'payload';
import { JSX } from 'react';
import type { Option } from '@payloadcms/ui/elements/ReactSelect/';
import { SelectFromCollectionSlug } from 'node_modules/payload/dist/collections/config/types';
import {
  collectionPages, globalPages,
} from '@/config/availablePages';
import InternalLinkChooserClient from './InternalLinkChooserClient';

// Create select options for Global Pages
const getGlobalPageOptions = (): Option[] => globalPages.map((page) => ({
  label: page,
  value: `global:${page}`,
}));

// Create select options for Collection Pages
const getCollectionPageOptions = async (props: UIFieldServerProps): Promise<Option[]> => {
  const options: Option[] = [];

  for await (const page of collectionPages) {

    const pageResults = await props.payload.find<typeof page, SelectFromCollectionSlug<typeof page>>({
      collection: page,
      depth: 2,
    });

    pageResults.docs.forEach((doc) => {
      options.push({
        // WE CAN REMOVE doc.title in detail pages
        label: doc.hero.title,
        value: `${page}/${doc.id}`,
      });
    });
  }

  return options;
};

// Select component
const InternalLinkChooser = async (props: UIFieldServerProps): Promise<JSX.Element> => {
  const globalPageOptions = getGlobalPageOptions();
  const collectionPageOptions = await getCollectionPageOptions(props);

  const options = [
    {
      label: 'Global Pages',
      options: globalPageOptions.filter((option) => option.value !== `global:${props.data.globalType}`),
    },
    {
      label: 'Detail Pages',
      options: collectionPageOptions.filter((option) => option.value !== `${props.collectionSlug}/${props.data.id}`),
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
