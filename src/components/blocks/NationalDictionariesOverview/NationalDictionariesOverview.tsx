import React from 'react';
import {
  Config, InterfaceNationalDictionariesOverviewBlock,
  NationalDictionaryDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import styles from '@/components/blocks/NationalDictionariesOverview/NationalDictionariesOverview.module.scss';
import { rteToHtml } from '@/utilities/rteToHtml';

export type InterfaceNationalDictionariesOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceNationalDictionariesOverviewBlock;

export const NationalDictionariesOverview = async (props: InterfaceNationalDictionariesOverviewPropTypes): Promise<React.JSX.Element> => {
  const {
    language,
    tenant,
    moreInfoButtonText,
  } = props;

  const pages = await fetchDetailPages({
    collection: 'nationalDictionaryDetailPage',
    language,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as NationalDictionaryDetailPage[];

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
      pageLanguage={language}
      type='generic'
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
