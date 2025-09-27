import React, { useEffect } from 'react';
import { cva } from 'cva';
import { Button } from '@/components/base/Button/Button';
import styles from '@/components/base/NavigationItem/NavigationItem.module.scss';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Icon } from '@/icons';
import { useExpandOnHover } from '@/hooks/useExpandOnHover';
import { useExpandOnClick } from '@/hooks/useExpandOnClick';
import { ColorMode } from '@/components/base/types/colorMode';

// --- Interfaces

type InterfaceNavigationItemChild = {
  text: string;
  link: string;
}

type InterfaceNavigationItemWithItems = {
  text: string;
  description?: string;
  link?: never;
  items: InterfaceNavigationItemChild[];
  expandableId: number;
  footer?: boolean;
  className?: string;
  setExpanded: number | undefined;
  onExpand: (key: number | undefined) => void;
  colorMode: ColorMode;
  hoveredItemCallback?: (item: number | undefined) => void;
  onHeightChange?: (id: number, height: number) => void;
};

type InterfaceNavigationItemWithoutItems = {
  text: string;
  description?: never;
  items?: never;
  link: string;
  expandableId?: never;
  footer?: boolean;
  className?: string;
  setExpanded?: never;
  onExpand?: never;
  colorMode: ColorMode;
  hoveredItemCallback?: never;
  onHeightChange?: never;
};

export type InterfaceNavigationItemPropTypes =
  | InterfaceNavigationItemWithItems
  | InterfaceNavigationItemWithoutItems;

// --- Classes

const listClasses = cva([styles.list], {
  variants: {
    active: {
      false: '',
      true: styles.active,
    },
    menuVisible: {
      false: null,
      true: [styles.visible],
    },
  },
});

const iconClasses = cva([styles.icon], {
  variants: {
    active: {
      false: '',
      true: styles.active,
    },
  },
});

// --- Component

export const NavigationItem = ({
  text,
  items,
  link,
  expandableId,
  footer,
  className,
  setExpanded,
  onExpand,
  colorMode,
  hoveredItemCallback,
  description,
  onHeightChange,
}: InterfaceNavigationItemPropTypes): React.JSX.Element => {

  // --- Hooks

  const {
    menuVisible,
    toggleButtonAutofocus: toggleButtonAutofocusFromHover,
    onToggleClick: onToggleClickFromHover,
    onMouseEnter,
    onMouseLeave,
    expandableRef,
    measureElementHeight,
    lastReported,
  } = useExpandOnHover();

  const {
    activeElement,
    onToggleClick,
    toggleButtonAutofocus,
    setActiveElement,
  } = useExpandOnClick();

  const breakpoint = useBreakpoint();

  const smallBreakpoint = breakpoint === 'zero' || breakpoint === 'small' || breakpoint === 'micro' || breakpoint === 'medium';

  // --- Effects

  // report hovered item to parent
  useEffect(() => {
    const nextValue = menuVisible
      ? expandableId
      : undefined;

    if (hoveredItemCallback && nextValue !== lastReported.current) {
      hoveredItemCallback(nextValue);
      lastReported.current = nextValue;
    }
  }, [
    menuVisible,
    expandableId,
    hoveredItemCallback,
    lastReported,
  ]);

  // react to changes on setExpanded prop
  useEffect(() => {
    setActiveElement(setExpanded);
  }, [
    setExpanded,
    setActiveElement,
  ]);

  // keep track of expanded heights
  useEffect(() => {
    if (!expandableRef.current || expandableId === undefined) {
      return;
    }

    const height = measureElementHeight(expandableRef.current);

    onHeightChange?.(expandableId, height);
  }, [
    expandableId,
    onHeightChange,
    items,
    expandableRef,
    measureElementHeight,
  ]);

  // --- Classes

  const menuClasses = cva([
    styles.expandableMenu,
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

  let level1AriaCurrent;

  if (smallBreakpoint) {
    if (expandableId === activeElement) {
      level1AriaCurrent = true;
    }
  } else {
    if (menuVisible) {
      level1AriaCurrent = true;
    }
  }

  return (
    <div
      className={menuClasses({
        footer,
      })}
      onMouseEnter={smallBreakpoint
        ? undefined
        : (): void => {
          if (!footer) {
            onMouseEnter();
          }
        }}
      onMouseLeave={smallBreakpoint
        ? undefined
        : (): void => {
          if (!footer) {
            onMouseLeave();
          }
        }
      }
      onClick={(smallBreakpoint && expandableId
        ? (): void => {
          onToggleClick(expandableId);

          if (expandableId !== undefined) {
            const nextState = expandableId === activeElement
              ? undefined
              : expandableId;

            onExpand?.(nextState);
          }
        }
        : onToggleClickFromHover
      )}
    >
      <div
        className={styles.buttonWrapper}
      >

        {/* In the footer large viewport we don't want buttons or links */}
        {items && (footer && !smallBreakpoint) &&
          <p className={styles.footerColumnTitle}>{text}</p>
        }

        {/* Render button */}
        {items && !(footer && !smallBreakpoint) &&
          <Button
            text={text}
            style={smallBreakpoint || footer
              ? 'textBright'
              : 'text'
            }
            colorMode={colorMode}
            element='button'
            className={styles.buttonLevel1}
            ariaCurrent={level1AriaCurrent}
            ariaDescription={description || undefined}
            ariaExpanded={smallBreakpoint
              ? expandableId === activeElement
              : menuVisible
            }
            autoFocus={smallBreakpoint
              ? toggleButtonAutofocus
              : toggleButtonAutofocusFromHover
            }
          />
        }

        {/* Render link */}
        {!items &&
          <Button
            text={text}
            style={smallBreakpoint || footer
              ? 'textBright'
              : 'text'
            }
            colorMode={colorMode}
            element='link'
            href={link}
            className={styles.buttonLevel1}
          />
        }

        {(smallBreakpoint && items) &&
          <Icon
            name='caretDown'
            className={iconClasses({
              active: expandableId === activeElement,
            })}
          />
        }

      </div>

      {/* Expandable content */}
      <div
        ref={expandableRef}
        className={listClasses({
          active: smallBreakpoint && expandableId === activeElement,
          menuVisible: !smallBreakpoint && menuVisible,
        })}
        inert={smallBreakpoint
          ? expandableId !== activeElement
          : !menuVisible && !footer
        }
      >
        <ul
          className={styles.listWrapper}
          aria-label={items && (footer && !smallBreakpoint)
            ? text
            : undefined
          }
        >
          {items?.map((child, id) => (
            <li key={id}>
              <Button
                text={child.text}
                style={footer
                  ? 'textSmall'
                  : 'text'
                }
                colorMode={colorMode}
                element='link'
                href={child.link}
                className={styles.item}
              />
            </li>
          ))}
        </ul>
      </div>
    </div >
  );
};
