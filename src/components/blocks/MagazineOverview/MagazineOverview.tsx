import 'server-only';
import React from 'react';
import { InterfaceMagazineOverviewBlock } from '@/payload-types';
import { fetchMagazinePages } from '@/data/fetch';
import { MagazineOverviewComponent } from '@/components/blocks/MagazineOverview/MagazineOverview.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { prerenderPageLinks } from '@/utilities/prerenderPageLinks';

export type InterfaceMagazineOverviewPropTypes = {
  tenant: string;
} & InterfaceMagazineOverviewBlock;

export const MagazineOverview = async (props: InterfaceMagazineOverviewPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();
  const {
    tenant,
    ...restProps
  } = props;

  const pages = await fetchMagazinePages({
    locale,
    tenant,
  });

  const urlMap = await prerenderPageLinks({
    locale,
    pages,
    payload,
  });

  return (
    <MagazineOverviewComponent
      pages={pages}
      pageUrls={urlMap}
      {...restProps}
    />
  );

};
