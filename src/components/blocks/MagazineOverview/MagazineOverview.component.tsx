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
} & InterfaceMagazineOverviewBlock;

export const MagazineOverviewComponent = ({
  pages,
}: InterfaceMagazineOverviewComponentPropTypes): React.JSX.Element => {
  const allItems = pages.map((item) => {

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

            // TODO: generate proper url
            href: `${item.slug}/${item.id}`,
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
