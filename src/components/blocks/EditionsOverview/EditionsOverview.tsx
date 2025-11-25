import React from 'react';
import styles from '@/components/blocks/EditionsOverview/EditionsOverview.module.scss';
import {
  Config,
  InterfaceEditionsOverviewBlock,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';

export type InterfaceEditionsOverviewPropTypes = {
  language: Config['locale'];
} & InterfaceEditionsOverviewBlock;

export const EditionsOverview = ({
  items,
  language,
}: InterfaceEditionsOverviewPropTypes): React.JSX.Element => {
  const allItems = items.items.map((item) => (
    <GenericTeaser
      className={styles.item}
      key={item.id}
      title={rteToHtml(item.title)}
      texts={[rteToHtml(item.text)]}
      links={[
        {
          href: item.externalLink,
          type: 'external',
        },
      ]}
      pageLanguage={language}
      type='network'
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
