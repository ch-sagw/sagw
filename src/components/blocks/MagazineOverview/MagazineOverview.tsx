import React from 'react';
import {
  Config, InterfaceMagazineOverviewBlock,
  MagazineDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { MagazineOverviewComponent } from '@/components/blocks/MagazineOverview/MagazineOverview.component';

export type InterfaceMagazineOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceMagazineOverviewBlock;

export const MagazineOverview = async (props: InterfaceMagazineOverviewPropTypes): Promise<React.JSX.Element> => {
  const {
    language,
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'magazineDetailPage',
    language,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as MagazineDetailPage[];

  return (
    <MagazineOverviewComponent
      pages={pages}
      pageLanguage={language}
      {...restProps}
    />
  );

};
