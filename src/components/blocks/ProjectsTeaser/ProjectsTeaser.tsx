import React from 'react';
import {
  Config, InterfaceProjectTeasersBlock,
  ProjectDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { ProjectsTeaserComponent } from './ProjectsTeaser.component';

export type InterfaceProjectsTeaserPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceProjectTeasersBlock;

export const ProjectsTeaser = async (props: InterfaceProjectsTeaserPropTypes): Promise<React.JSX.Element> => {
  const {
    language,
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'projectDetailPage',
    language,
    limit: 3,
    sort: 'createdAt',
    tenant,
  }) as ProjectDetailPage[];

  return (
    <ProjectsTeaserComponent
      {...restProps}
      pages={pages}
      pageLanguage={language}
    />
  );
};
