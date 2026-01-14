'use client';

import styles from '@/components/blocks/InstitutesOverview/InstitutesOverview.module.scss';
import {
  InstituteDetailPage, InterfaceInstitutesOverviewBlock,
} from '@/payload-types';
import React from 'react';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { rteToHtml } from '@/utilities/rteToHtml';

export type InterfaceInstituteOverviewComponentPropTypes = {
  pages: InstituteDetailPage[];
  pageUrls: Record<string, string>;
} & InterfaceInstitutesOverviewBlock;

export const InstituteOverviewComponent = ({
  pages,
  pageUrls,
  moreInfoButtonText,
}: InterfaceInstituteOverviewComponentPropTypes): React.JSX.Element => {
  const allItems = pages.map((item) => {
    const href = pageUrls[item.id] || `/${item.id}`;

    const image = typeof item.overviewPageProps.image === 'string'
      ? undefined
      : item.overviewPageProps.image;

    return (
      <GenericTeaser
        className={styles.item}
        key={item.id}
        title={rteToHtml(item.hero.title)}
        texts={[rteToHtml(item.overviewPageProps.teaserText)]}
        links={[
          {
            href,
            text: rteToHtml(moreInfoButtonText),
            type: 'internal',
          },
        ]}
        image={image}
        type='institute'
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
