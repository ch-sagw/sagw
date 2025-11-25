import React from 'react';
import {
  Config, InterfaceProjectOverviewBlock,
  ProjectDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { ProjectOverviewComponent } from '@/components/blocks/ProjectsOverview/ProjectsOverview.component';

export type InterfaceProjectsOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceProjectOverviewBlock;

export const ProjectsOverview = async (props: InterfaceProjectsOverviewPropTypes): Promise<React.JSX.Element> => {
  const {
    language,
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'projectDetailPage',
    language,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as ProjectDetailPage[];

  return (
    <ProjectOverviewComponent
      pages={pages}
      pageLanguage={language}
      {...restProps}
    />
  );
};
