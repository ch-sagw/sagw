import React from 'react';
import {
  Config, InterfaceMagazineOverviewBlock,
  MagazineDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import styles from '@/components/blocks/MagazineOverview/MagazineOverview.module.scss';
import { rteToHtml } from '@/utilities/rteToHtml';
import { getFirstImageIdOfMagazinePage } from '@/components/helpers/magazineImage';

export type InterfaceMagazineOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceMagazineOverviewBlock;

export const MagazineOverview = async (props: InterfaceMagazineOverviewPropTypes): Promise<React.JSX.Element> => {
  const {
    language,
    tenant,
  } = props;

  const pages = await fetchDetailPages({
    collection: 'magazineDetailPage',
    language,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as MagazineDetailPage[];

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
      pageLanguage={language}
      type='magazine'
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
