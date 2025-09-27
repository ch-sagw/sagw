import React, { useState } from 'react';
import { cva } from 'cva';
import {
  InterfaceNavigationItemPropTypes, NavigationItem,
} from '@/components/base/NavigationItem/NavigationItem';
import { ColorMode } from '@/components/base/types/colorMode';
import styles from '@/components/base/Navigation/Navigation.module.scss';

export type InterfaceNavigationPropTypes = {
  sections: InterfaceNavigationItemPropTypes[];
  footer: boolean;
  className?: string;
  colorMode: ColorMode;
};

export const Navigation = ({
  sections,
  footer,
  className,
  colorMode,
}: InterfaceNavigationPropTypes): React.JSX.Element => {
  const [
    itemsState,
    setItemsState,
  ] = useState<number | undefined>(undefined);

  const classes = cva([
    styles.nav,
    className,
    styles[colorMode],
  ], {
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
      <ul className={styles.list}>
        {sections.map((section: InterfaceNavigationItemPropTypes, key: number) => (
          <li key={key}>
            <NavigationItem
              colorMode={colorMode}
              className={styles.item}
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
          </li>
        ))}
      </ul>
    </nav>
  );
};
