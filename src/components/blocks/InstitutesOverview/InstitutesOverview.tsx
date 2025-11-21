import React from 'react';
import {
  Config, InstituteDetailPage, InterfaceInstitutesOverviewBlock,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import styles from '@/components/blocks/InstitutesOverview/InstitutesOverview.module.scss';
import { rteToHtml } from '@/utilities/rteToHtml';

export type InterfaceInstitutesOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceInstitutesOverviewBlock;

export const InstitutesOverview = async (props: InterfaceInstitutesOverviewPropTypes): Promise<React.JSX.Element> => {
  const {
    language,
    tenant,
    moreInfoButtonText,
  } = props;

  const pages = await fetchDetailPages({
    collection: 'instituteDetailPage',
    language,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as InstituteDetailPage[];

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
      image={typeof item.overviewPageProps.image === 'object'
        ? item.overviewPageProps.image.id
        : item.overviewPageProps.image
      }
      pageLanguage={language}
      type='institute'
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
