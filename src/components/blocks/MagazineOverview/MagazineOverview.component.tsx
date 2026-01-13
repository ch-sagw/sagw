'use client';

import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import styles from '@/components/blocks/MagazineOverview/MagazineOverview.module.scss';
import { getFirstImageIdOfMagazinePage } from '@/components/helpers/magazineImage';
import {
  InterfaceMagazineOverviewBlock, MagazineDetailPage,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import React from 'react';

export type InterfaceMagazineOverviewComponentPropTypes = {
  pages: MagazineDetailPage[];
  pageUrls: Record<string, string>;
} & InterfaceMagazineOverviewBlock;

export const MagazineOverviewComponent = ({
  pages,
  pageUrls,
}: InterfaceMagazineOverviewComponentPropTypes): React.JSX.Element => {
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
            type: 'internal',
          },
        ]}
        image={getFirstImageIdOfMagazinePage(item)}
        type='magazine'
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
