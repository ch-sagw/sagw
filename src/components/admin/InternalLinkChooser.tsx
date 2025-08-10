'use server';

import React, { JSX } from 'react';
import type { UIFieldServerProps } from 'payload';
import type { Option } from '@payloadcms/ui/elements/ReactSelect/';
import InternalLinkChooserClient from '@/components/admin/InternalLinkChooserClient';
import {
  collectionPages,
  globalPages,
} from '@/config/availablePages';

// Create global page options (sync)
const getGlobalPageOptions = (): Option[] => globalPages.map((page) => ({
  label: page,
  value: `global:${page}`,
}));

// Async get collection page options from Payload API
const getCollectionPageOptions = async (props: UIFieldServerProps): Promise<Option[]> => {
  const options: Option[] = [];

  for await (const page of collectionPages) {
    const pageResults = await props.payload.find<typeof page, any>({
      collection: page,
      depth: 2,
    });

    pageResults.docs.forEach((doc) => {
      options.push({
        label: doc.hero.title,
        value: `${page}/${doc.id}`,
      });
    });
  }

  return options;
};

const InternalLinkChooser = async (props: UIFieldServerProps): Promise<JSX.Element> => {
  const globalPageOptions = getGlobalPageOptions();
  const collectionPageOptions = await getCollectionPageOptions(props);
  const options = [
    ...globalPageOptions,
    ...collectionPageOptions,
  ];

  return (
    <InternalLinkChooserClient
      options={options}
      value={props.value as Option | Option[] | undefined}
    // onChange={props.onChange}
    />
  );
};

export default InternalLinkChooser;
