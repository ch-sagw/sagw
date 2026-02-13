import 'server-only';
import React from 'react';
import {
  InstituteDetailPage, InterfaceInstitutesOverviewBlock,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { InstituteOverviewComponent } from '@/components/blocks/InstitutesOverview/InstitutesOverview.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { prerenderPageLinks } from '@/utilities/prerenderPageLinks';

export type InterfaceInstitutesOverviewPropTypes = {
  tenant: string;
} & InterfaceInstitutesOverviewBlock;

export const InstitutesOverview = async (props: InterfaceInstitutesOverviewPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();
  const {
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'instituteDetailPage',
    depth: 1,
    language: locale,
    limit: 0,
    sort: 'hero.title',
    tenant,
  }) as InstituteDetailPage[];

  const urlMap = await prerenderPageLinks({
    locale,
    pages,
    payload,
  });

  return (
    <InstituteOverviewComponent
      pages={pages}
      pageUrls={urlMap}
      {...restProps}
    />
  );

};
