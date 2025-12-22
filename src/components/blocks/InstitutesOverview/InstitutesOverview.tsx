import React from 'react';
import {
  InstituteDetailPage, InterfaceInstitutesOverviewBlock,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { InstituteOverviewComponent } from '@/components/blocks/InstitutesOverview/InstitutesOverview.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';

export type InterfaceInstitutesOverviewPropTypes = {
  tenant: string;
} & InterfaceInstitutesOverviewBlock;

export const InstitutesOverview = async (props: InterfaceInstitutesOverviewPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const {
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'instituteDetailPage',
    depth: 1,
    language: locale,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as InstituteDetailPage[];

  return (
    <InstituteOverviewComponent
      pages={pages}
      {...restProps}
    />
  );

};
