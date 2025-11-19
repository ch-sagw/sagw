import React from 'react';
import {
  Config, InterfaceProjectTeasersBlock,
} from '@/payload-types';
import { fetchProjectDetailPages } from '@/data/fetch';
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

  const pages = await fetchProjectDetailPages({
    language,
    limit: 3,
    tenant,
  });

  return (
    <ProjectsTeaserComponent
      {...restProps}
      pages={pages}
    />
  );
};
