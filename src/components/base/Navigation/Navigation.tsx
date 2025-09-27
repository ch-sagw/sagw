import React, {
  useCallback, useEffect, useState,
} from 'react';
import { cva } from 'cva';
import {
  InterfaceNavigationItemPropTypes, NavigationItem,
} from '@/components/base/NavigationItem/NavigationItem';
import { ColorMode } from '@/components/base/types/colorMode';
import styles from '@/components/base/Navigation/Navigation.module.scss';

// --- Interfaces

export type InterfaceHoveredItemCallbackType = Record<string, number | undefined>;

export type InterfaceNavigationPropTypes = {
  sections: InterfaceNavigationItemPropTypes[];
  footer: boolean;
  className?: string;
  colorMode: ColorMode;
  hoveredItemCallback?: (item: InterfaceHoveredItemCallbackType) => void;
  navMaxHeightCallback?: (maxHeight: number) => void;
};

// --- Component

export const Navigation = ({
  sections,
  footer,
  className,
  colorMode,
  hoveredItemCallback,
  navMaxHeightCallback,
}: InterfaceNavigationPropTypes): React.JSX.Element => {

  // --- State

  const [
    itemsState,
    setItemsState,
  ] = useState<number | undefined>(undefined);

  const [
    heights,
    setHeights,
  ] = useState<Record<number, number>>({});

  // --- Effects

  useEffect(() => {
    const maxHeight = Math.max(...Object.values(heights));

    if (navMaxHeightCallback) {
      navMaxHeightCallback(maxHeight);
    }
  }, [
    heights,
    navMaxHeightCallback,
  ]);

  // --- Callbacks

  const handleHeightChange = useCallback((id: number, height: number) => {
    setHeights((prev) => ({
      ...prev,
      [id]: height,
    }));

  }, []);

  // --- Classes

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

  // --- Render

  return (
    <nav
      className={classes({
        footer,
      })}
    >
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
                  description: section.description,
                  expandableId: section.expandableId as NonNullable<typeof section.expandableId>,
                  hoveredItemCallback: (item: number | undefined): void => {

                    if (section.expandableId && hoveredItemCallback) {
                      const returnObject: InterfaceHoveredItemCallbackType = {};

                      returnObject[section.expandableId] = item;
                      hoveredItemCallback(returnObject);
                    }
                  },
                  items: section.items as NonNullable<typeof section.items>,
                  onExpand: (expandKey: number | undefined): void => {
                    if (expandKey !== undefined) {
                      setItemsState(expandKey);
                    }
                  },
                  onHeightChange: handleHeightChange,
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
