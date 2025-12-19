import 'server-only';
import React from 'react';
import styles from '@/components/blocks/EditionsOverview/EditionsOverview.module.scss';
import { InterfaceEditionsOverviewBlock } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';

export type InterfaceEditionsOverviewPropTypes = {} & InterfaceEditionsOverviewBlock;

export const EditionsOverview = ({
  items,
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
          text: rteToHtml(items.linkText),
          type: 'external',
        },
      ]}
      type='network'
    />
  ));

  return (
    <GenericOverview
      showPagination={true}
    >
      {allItems}
    </GenericOverview>
  );
};
