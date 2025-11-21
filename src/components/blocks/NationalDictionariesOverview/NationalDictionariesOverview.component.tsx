'use client';

import styles from '@/components/blocks/NationalDictionariesOverview/NationalDictionariesOverview.module.scss';
import {
  Config, InterfaceNationalDictionariesOverviewBlock, NationalDictionaryDetailPage,
} from '@/payload-types';
import React from 'react';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { rteToHtml } from '@/utilities/rteToHtml';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';

export type InterfaceNationalDictionaryOverviewComponentPropTypes = {
  pages: NationalDictionaryDetailPage[];
  pageLanguage: Config['locale'];
} & InterfaceNationalDictionariesOverviewBlock;

export const NationalDictionaryOverviewComponent = ({
  pages,
  pageLanguage,
  moreInfoButtonText,
}: InterfaceNationalDictionaryOverviewComponentPropTypes): React.JSX.Element => {
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
          text: rteToHtml(moreInfoButtonText),
          type: 'internal',
        },
      ]}
      pageLanguage={pageLanguage}
      type='generic'
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
