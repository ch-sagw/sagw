import React from 'react';
import {
  InterfaceMagazineTeasersBlock,
  MagazineDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { MagazineTeaserComponent } from './MagazineTeaser.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';

export type InterfaceMagazineTeaserPropTypes = {
  tenant: string;
} & InterfaceMagazineTeasersBlock;

export const MagazineTeaser = async (props: InterfaceMagazineTeaserPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const {
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'magazineDetailPage',
    language: locale,
    limit: 4,
    sort: 'createdAt',
    tenant,
  }) as MagazineDetailPage[];

  return (
    <MagazineTeaserComponent
      {...restProps}
      pages={pages}
    />
  );
};
