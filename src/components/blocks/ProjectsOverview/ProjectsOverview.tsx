import 'server-only';
import React from 'react';
import { InterfaceProjectOverviewBlock } from '@/payload-types';
import { fetchProjectsPages } from '@/data/fetch';
import { ProjectOverviewComponent } from '@/components/blocks/ProjectsOverview/ProjectsOverview.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { prerenderPageLinks } from '@/utilities/prerenderPageLinks';

export type InterfaceProjectsOverviewPropTypes = {
  tenant: string;
} & InterfaceProjectOverviewBlock;

export const ProjectsOverview = async (props: InterfaceProjectsOverviewPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();
  const {
    tenant,
    ...restProps
  } = props;

  const pages = await fetchProjectsPages({
    locale,
    tenant,
  });

  const urlMap = await prerenderPageLinks({
    locale,
    pages,
    payload,
  });

  return (
    <ProjectOverviewComponent
      pages={pages}
      pageUrls={urlMap}
      {...restProps}
    />
  );
};
