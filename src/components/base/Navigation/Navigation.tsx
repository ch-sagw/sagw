// TODO:
// - if item is opened, close others

import React, { useState } from 'react';
import { cva } from 'cva';
import {
  InterfaceNavigationItemPropTypes, NavigationItem,
} from '@/components/base/NavigationItem/NavigationItem';
import styles from '@/components/base/Navigation/Navigation.module.scss';

export type InterfaceNavigationPropTypes = {
  sections: InterfaceNavigationItemPropTypes[];
  footer: boolean;
};

export const Navigation = ({
  sections,
  footer,
}: InterfaceNavigationPropTypes): React.JSX.Element => {
  const [
    itemsState,
    setItemsState,
  ] = useState<number | undefined>(undefined);

  const classes = cva([styles.nav], {
    variants: {
      footer: {
        false: '',
        true: styles.footer,
      },
    },
  });

  return (
    <nav className={classes({
      footer,
    })}>
      {sections.map((section: InterfaceNavigationItemPropTypes, key: number) => (
        <NavigationItem
          className={styles.item}
          key={key}
          text={section.text}
          footer={section.footer}
          {...('items' in section
            ? {
              expandableId: section.expandableId as NonNullable<typeof section.expandableId>,
              items: section.items as NonNullable<typeof section.items>,
              onExpand: (expandKey: number | undefined): void => {
                if (expandKey !== undefined) {
                  setItemsState(expandKey);
                }
              },
              setExpanded: itemsState === key
                ? itemsState
                : undefined,
            }
            : {
              link: section.link as NonNullable<typeof section.link>,
            })}
        />
      ))}
    </nav>
  );
};
