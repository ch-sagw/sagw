'use client';

import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import styles from '@/components/blocks/MagazineOverview/MagazineOverview.module.scss';
import { getFirstImageIdOfMagazinePage } from '@/components/helpers/magazineImage';
import {
  Config, InterfaceMagazineOverviewBlock, MagazineDetailPage,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import React from 'react';

export type InterfaceMagazineOverviewComponentPropTypes = {
  pages: MagazineDetailPage[];
  pageLanguage: Config['locale'];
} & InterfaceMagazineOverviewBlock;

export const MagazineOverviewComponent = ({
  pages,
  pageLanguage,
}: InterfaceMagazineOverviewComponentPropTypes): React.JSX.Element => {
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
          type: 'internal',
        },
      ]}
      image={getFirstImageIdOfMagazinePage(item)}
      pageLanguage={pageLanguage}
      type='magazine'
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
