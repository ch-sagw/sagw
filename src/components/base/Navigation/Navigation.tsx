import React, {
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { cva } from 'cva';
import {
  InterfaceNavigationItemPropTypes, NavigationItem,
} from '@/components/base/NavigationItem/NavigationItem';
import { ColorMode } from '@/components/base/types/colorMode';
import styles from '@/components/base/Navigation/Navigation.module.scss';
import { useTranslations } from 'next-intl';

// --- Interfaces

export type InterfaceHoveredItemCallbackType = Record<string, string | undefined>;

export type InterfaceNavigationPropTypes = {
  sections: InterfaceNavigationItemPropTypes[];
  footer: boolean;
  className?: string;
  colorMode: ColorMode;
  hoveredItemCallback?: (item: InterfaceHoveredItemCallbackType) => void;
  navMaxHeightCallback?: (maxHeight: number) => void;
  onHoverItemWithoutChildren?: () => void;

  /**
   * Optional controlled mode: the parent owns which item is expanded.
   * When `onExpandedItemChange` is provided, `expandedItem` is used instead
   * of the internal state and `undefined` is forwarded so the parent knows
   * when no item is expanded anymore.
   */
  expandedItem?: string;
  onExpandedItemChange?: (id: string | undefined) => void;
};

// --- Component

export const Navigation = forwardRef<HTMLElement, InterfaceNavigationPropTypes>(({
  sections,
  footer,
  className,
  colorMode,
  hoveredItemCallback,
  navMaxHeightCallback,
  onHoverItemWithoutChildren,
  expandedItem,
  onExpandedItemChange,
}, ref) => {

  // --- State

  const [
    itemsState,
    setItemsState,
  ] = useState<string | undefined>(undefined);

  const isControlled = onExpandedItemChange !== undefined;
  const currentExpanded = isControlled
    ? expandedItem
    : itemsState;

  const [
    heights,
    setHeights,
  ] = useState<Record<string, number>>({});

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

  const handleHeightChange = useCallback((id: string, height: number) => {
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

  const i18nA11y = useTranslations('landmarks');
  let ariaLabel = i18nA11y('mainNavigation');

  if (footer) {
    ariaLabel = i18nA11y('footerNavigation');
  }

  // --- Render
  return (
    <nav
      aria-label={ariaLabel}
      ref={ref}
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
                  expandableId: section.expandableId as NonNullable<typeof section.expandableId>,
                  hoveredItemCallback: (item: string | undefined): void => {

                    if (section.expandableId && hoveredItemCallback) {
                      const returnObject: InterfaceHoveredItemCallbackType = {};

                      returnObject[section.expandableId] = item;
                      hoveredItemCallback(returnObject);
                    }
                  },
                  items: section.items as NonNullable<typeof section.items>,
                  onExpand: (expandKey: string | undefined): void => {
                    if (isControlled) {
                      onExpandedItemChange(expandKey);
                    } else if (expandKey !== undefined) {
                      setItemsState(expandKey);
                    }
                  },
                  onHeightChange: handleHeightChange,
                  setExpanded: currentExpanded === section.expandableId
                    ? currentExpanded
                    : undefined,
                }
                : {
                  hoveredItemCallback: (item: string | undefined): void => {
                    // For items without children,
                    // call the special callback to collapse header
                    if (item === 'hovered' && onHoverItemWithoutChildren) {
                      onHoverItemWithoutChildren();
                    }
                  },
                  link: section.link as NonNullable<typeof section.link>,
                })}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
});

Navigation.displayName = 'Navigation';
