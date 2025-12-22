'use client';

import styles from '@/components/blocks/InstitutesOverview/InstitutesOverview.module.scss';
import {
  InstituteDetailPage, InterfaceInstitutesOverviewBlock,
} from '@/payload-types';
import React from 'react';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { rteToHtml } from '@/utilities/rteToHtml';

export type InterfaceInstituteOverviewComponentPropTypes = {
  pages: InstituteDetailPage[];
} & InterfaceInstitutesOverviewBlock;

export const InstituteOverviewComponent = ({
  pages,
  moreInfoButtonText,
}: InterfaceInstituteOverviewComponentPropTypes): React.JSX.Element => {
  const allItems = pages.map((item) => {

    const image = typeof item.overviewPageProps.image === 'string'
      ? undefined
      : item.overviewPageProps.image;

    return (
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
        image={image}
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
