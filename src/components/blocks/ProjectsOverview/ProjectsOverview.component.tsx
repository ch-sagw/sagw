'use client';

import {
  Config, InterfaceProjectOverviewBlock, ProjectDetailPage,
} from '@/payload-types';
import React from 'react';
import styles from '@/components/blocks/ProjectsOverview/ProjectsOverview.module.scss';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import { rteToHtml } from '@/utilities/rteToHtml';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';

export type InterfaceProjectsOverviewComponentPropTypes = {
  pages: ProjectDetailPage[];
  pageLanguage: Config['locale'];
} & InterfaceProjectOverviewBlock;

export const ProjectOverviewComponent = ({
  pages,
  pageLanguage,
}: InterfaceProjectsOverviewComponentPropTypes): React.JSX.Element => {
  const allItems = pages.map((item) => (
    <GenericTeaser
      className={styles.item}
      key={item.id}
      title={rteToHtml(item.hero.title)}
      texts={[rteToHtml(item.overviewPageProps.teaserText)]}
      links={[
        {

          // TODO: generate proper url
          href: `${item.slug}/${item.id}`,
          text: rteToHtml(item.overviewPageProps.linkText),
          type: 'internal',
        },
      ]}
      pageLanguage={pageLanguage}
      type='project'
    />
  ));

  return (
    <GenericOverview
      showPagination={true}
      language={pageLanguage}
    >
      {allItems}
    </GenericOverview>
  );
};
