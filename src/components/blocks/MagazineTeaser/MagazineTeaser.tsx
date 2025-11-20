import React from 'react';
import {
  Config, InterfaceMagazineTeasersBlock,
} from '@/payload-types';
import { fetchMagazineDetailPages } from '@/data/fetch';
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

  const pages = await fetchMagazineDetailPages({
    language,
    limit: 4,
    tenant,
  });

  return (
    <MagazineTeaserComponent
      {...restProps}
      pages={pages}
      pageLanguage={language}
    />
  );
};
