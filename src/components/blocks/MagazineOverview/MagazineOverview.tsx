import React from 'react';
import {
  InterfaceMagazineOverviewBlock,
  MagazineDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { MagazineOverviewComponent } from '@/components/blocks/MagazineOverview/MagazineOverview.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';

export type InterfaceMagazineOverviewPropTypes = {
  tenant: string;
} & InterfaceMagazineOverviewBlock;

export const MagazineOverview = async (props: InterfaceMagazineOverviewPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const {
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'magazineDetailPage',
    language: locale,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as MagazineDetailPage[];

  return (
    <MagazineOverviewComponent
      pages={pages}
      {...restProps}
    />
  );

};
