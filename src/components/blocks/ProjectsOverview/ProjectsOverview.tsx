import React from 'react';
import {
  InterfaceProjectOverviewBlock,
  ProjectDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { ProjectOverviewComponent } from '@/components/blocks/ProjectsOverview/ProjectsOverview.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';

export type InterfaceProjectsOverviewPropTypes = {
  tenant: string;
} & InterfaceProjectOverviewBlock;

export const ProjectsOverview = async (props: InterfaceProjectsOverviewPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const {
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'projectDetailPage',
    language: locale,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as ProjectDetailPage[];

  return (
    <ProjectOverviewComponent
      pages={pages}
      {...restProps}
    />
  );
};
