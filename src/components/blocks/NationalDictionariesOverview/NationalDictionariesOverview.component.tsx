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
  pageUrls: Record<string, string>;
} & InterfaceNationalDictionariesOverviewBlock;

export const NationalDictionaryOverviewComponent = ({
  pages,
  pageUrls,
  moreInfoButtonText,
}: InterfaceNationalDictionaryOverviewComponentPropTypes): React.JSX.Element => {
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
            text: rteToHtml(moreInfoButtonText),
            type: 'internal',
          },
        ]}
        type='generic'
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
