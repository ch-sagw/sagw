import React from 'react';
import {
  Config, InterfaceProjectOverviewBlock,
  ProjectDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import styles from '@/components/blocks/ProjectsOverview/ProjectsOverview.module.scss';
import { rteToHtml } from '@/utilities/rteToHtml';

export type InterfaceProjectsOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceProjectOverviewBlock;

export const ProjectsOverview = async (props: InterfaceProjectsOverviewPropTypes): Promise<React.JSX.Element> => {
  const {
    language,
    tenant,
  } = props;

  const pages = await fetchDetailPages({
    collection: 'projectDetailPage',
    language,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as ProjectDetailPage[];

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
      pageLanguage={language}
      type='project'
    />
  ));

  return (
    <GenericOverview
      showPagination={true}
      language={language}
    >
      {allItems}
    </GenericOverview>
  );
};
