'use client';

import styles from '@/components/blocks/NationalDictionariesOverview/NationalDictionariesOverview.module.scss';
import {
  InterfaceNationalDictionariesOverviewBlock, NationalDictionaryDetailPage,
} from '@/payload-types';
import React from 'react';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { rteToHtml } from '@/utilities/rteToHtml';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';

export type InterfaceNationalDictionaryOverviewComponentPropTypes = {
  pages: NationalDictionaryDetailPage[];
} & InterfaceNationalDictionariesOverviewBlock;

export const NationalDictionaryOverviewComponent = ({
  pages,
  moreInfoButtonText,
}: InterfaceNationalDictionaryOverviewComponentPropTypes): React.JSX.Element => {
  const allItems = pages.map((item) => {

    const image = typeof item.overviewPageProps.image === 'string' || item.overviewPageProps.image === null
      ? undefined
      : item.overviewPageProps.image;

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
            text: rteToHtml(moreInfoButtonText),
            type: 'internal',
          },
        ]}
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
