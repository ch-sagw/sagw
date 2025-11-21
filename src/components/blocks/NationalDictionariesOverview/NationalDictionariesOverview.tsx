import React from 'react';
import {
  Config, InterfaceNationalDictionariesOverviewBlock,
  NationalDictionaryDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { NationalDictionaryOverviewComponent } from '@/components/blocks/NationalDictionariesOverview/NationalDictionariesOverview.component';

export type InterfaceNationalDictionariesOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceNationalDictionariesOverviewBlock;

export const NationalDictionariesOverview = async (props: InterfaceNationalDictionariesOverviewPropTypes): Promise<React.JSX.Element> => {
  const {
    language,
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'nationalDictionaryDetailPage',
    language,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as NationalDictionaryDetailPage[];

  return (
    <NationalDictionaryOverviewComponent
      pageLanguage={language}
      pages={pages}
      {...restProps}
    />
  );
};
