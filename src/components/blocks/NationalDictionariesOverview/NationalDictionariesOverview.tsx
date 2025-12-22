import React from 'react';
import {
  InterfaceNationalDictionariesOverviewBlock,
  NationalDictionaryDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { NationalDictionaryOverviewComponent } from '@/components/blocks/NationalDictionariesOverview/NationalDictionariesOverview.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';

export type InterfaceNationalDictionariesOverviewPropTypes = {
  tenant: string;
} & InterfaceNationalDictionariesOverviewBlock;

export const NationalDictionariesOverview = async (props: InterfaceNationalDictionariesOverviewPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const {
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'nationalDictionaryDetailPage',
    depth: 1,
    language: locale,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as NationalDictionaryDetailPage[];

  return (
    <NationalDictionaryOverviewComponent
      pages={pages}
      {...restProps}
    />
  );
};
