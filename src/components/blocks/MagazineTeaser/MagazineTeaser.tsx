import React from 'react';
import {
  Config, InterfaceMagazineTeasersBlock,
  MagazineDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { MagazineTeaserComponent } from './MagazineTeaser.component';

export type InterfaceMagazineTeaserPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceMagazineTeasersBlock;

export const MagazineTeaser = async (props: InterfaceMagazineTeaserPropTypes): Promise<React.JSX.Element> => {
  const {
    language,
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'magazineDetailPage',
    language,
    limit: 4,
    sort: 'createdAt',
    tenant,
  }) as MagazineDetailPage[];

  return (
    <MagazineTeaserComponent
      {...restProps}
      pages={pages}
      pageLanguage={language}
    />
  );
};
