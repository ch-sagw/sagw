import React from 'react';
import {
  InterfaceProjectTeasersBlock,
  ProjectDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { ProjectsTeaserComponent } from './ProjectsTeaser.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';

export type InterfaceProjectsTeaserPropTypes = {
  tenant: string;
} & InterfaceProjectTeasersBlock;

export const ProjectsTeaser = async (props: InterfaceProjectsTeaserPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const {
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'projectDetailPage',
    language: locale,
    limit: 3,
    sort: 'createdAt',
    tenant,
  }) as ProjectDetailPage[];

  return (
    <ProjectsTeaserComponent
      {...restProps}
      pages={pages}
    />
  );
};
