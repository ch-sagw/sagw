import React from 'react';
import {
  Config, InstituteDetailPage, InterfaceInstitutesOverviewBlock,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { InstituteOverviewComponent } from '@/components/blocks/InstitutesOverview/InstitutesOverview.componet';

export type InterfaceInstitutesOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceInstitutesOverviewBlock;

export const InstitutesOverview = async (props: InterfaceInstitutesOverviewPropTypes): Promise<React.JSX.Element> => {
  const {
    language,
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'instituteDetailPage',
    language,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as InstituteDetailPage[];

  return (
    <InstituteOverviewComponent
      pages={pages}
      language={language}
      {...restProps}
    />
  );

};
