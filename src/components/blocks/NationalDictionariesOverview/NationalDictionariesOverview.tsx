import 'server-only';
import React from 'react';
import {
  InterfaceNationalDictionariesOverviewBlock,
  NationalDictionaryDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { NationalDictionaryOverviewComponent } from '@/components/blocks/NationalDictionariesOverview/NationalDictionariesOverview.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { prerenderPageLinks } from '@/utilities/prerenderPageLinks';

export type InterfaceNationalDictionariesOverviewPropTypes = {
  tenant: string;
} & InterfaceNationalDictionariesOverviewBlock;

export const NationalDictionariesOverview = async (props: InterfaceNationalDictionariesOverviewPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();
  const {
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'nationalDictionaryDetailPage',
    language: locale,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as NationalDictionaryDetailPage[];

  const urlMap = await prerenderPageLinks({
    locale,
    pages,
    payload,
  });

  return (
    <NationalDictionaryOverviewComponent
      pages={pages}
      pageUrls={urlMap}
      {...restProps}
    />
  );
};
