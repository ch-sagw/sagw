'use client';

import styles from '@/components/blocks/InstitutesOverview/InstitutesOverview.module.scss';
import {
  Config, InstituteDetailPage, InterfaceInstitutesOverviewBlock,
} from '@/payload-types';
import React from 'react';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { rteToHtml } from '@/utilities/rteToHtml';

export type InterfaceInstituteOverviewComponentPropTypes = {
  pages: InstituteDetailPage[];
  language: Config['locale'];
} & InterfaceInstitutesOverviewBlock;

export const InstituteOverviewComponent = ({
  pages,
  language,
  moreInfoButtonText,
}: InterfaceInstituteOverviewComponentPropTypes): React.JSX.Element => {
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
      language={language}
      showPagination={true}
    >
      {allItems}
    </GenericOverview>
  );
};
