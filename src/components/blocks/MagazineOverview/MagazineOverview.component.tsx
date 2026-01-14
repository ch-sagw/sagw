'use client';

import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import styles from '@/components/blocks/MagazineOverview/MagazineOverview.module.scss';
import { InterfaceMagazineOverviewBlock } from '@/payload-types';
import { InterfaceMagazineDetailPageWithImage } from '@/components/blocks/MagazineOverview/MagazineOverview';
import { rteToHtml } from '@/utilities/rteToHtml';
import React from 'react';

export type InterfaceMagazineOverviewComponentPropTypes = {
  pages: InterfaceMagazineDetailPageWithImage[];
  pageUrls: Record<string, string>;
} & InterfaceMagazineOverviewBlock;

export const MagazineOverviewComponent = ({
  pages,
  pageUrls,
}: InterfaceMagazineOverviewComponentPropTypes): React.JSX.Element => {
  const allItems = pages.map((item) => {
    const href = pageUrls[item.id] || `/${item.id}`;

    const image = typeof item.image === 'string'
      ? undefined
      : item.image;

    return (
      <GenericTeaser
        className={styles.item}
        image={image}
        key={item.id}
        title={rteToHtml(item.hero.title)}
        texts={[rteToHtml(item.overviewPageProps.teaserText)]}
        links={[
          {
            href,
            type: 'internal',
          },
        ]}
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
