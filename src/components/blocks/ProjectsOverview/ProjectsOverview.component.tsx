'use client';

import {
  InterfaceProjectOverviewBlock, ProjectDetailPage,
} from '@/payload-types';
import React from 'react';
import styles from '@/components/blocks/ProjectsOverview/ProjectsOverview.module.scss';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import { rteToHtml } from '@/utilities/rteToHtml';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';

export type InterfaceProjectsOverviewComponentPropTypes = {
  pages: ProjectDetailPage[];
  pageUrls: Record<string, string>;
} & InterfaceProjectOverviewBlock;

export const ProjectOverviewComponent = ({
  pages,
  pageUrls,
}: InterfaceProjectsOverviewComponentPropTypes): React.JSX.Element => {
  const allItems = pages.map((item) => {
    const href = pageUrls[item.id] || `/${item.id}`;

    return (
      <GenericTeaser
        className={styles.item}
        key={item.id}
        title={rteToHtml(item.hero.title)}
        texts={[rteToHtml(item.overviewPageProps.teaserText)]}
        links={[
          {
            href,
            text: rteToHtml(item.overviewPageProps.linkText),
            type: 'internal',
          },
        ]}
        type='project'
      />
    );
  });

  return (
    <GenericOverview
      showPagination={true}
    >
      {allItems}
    </GenericOverview>
  );
};
