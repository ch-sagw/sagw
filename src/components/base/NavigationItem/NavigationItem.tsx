import React from 'react';
import { cva } from 'cva';
import { Button } from '@/components/base/Button/Button';
import styles from '@/components/base/NavigationItem/NavigationItem.module.scss';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Icon } from '@/icons';
import { useExpandOnHover } from '@/hooks/useExpandOnHover';
import { useExpandOnClick } from '@/hooks/useExpandOnClick';

// --- Interfaces

type InterfaceNavigationItemChild = {
  text: string;
  link: string;
}

type InterfaceNavigationItemWithItems = {
  text: string;
  link?: never;
  items: InterfaceNavigationItemChild[];
  expandableId: number;
};

type InterfaceNavigationItemWithoutItems = {
  text: string;
  items?: never;
  link: string;
  expandableId?: never;
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
}: InterfaceNavigationItemPropTypes): React.JSX.Element => {
  // --- Hooks

  const {
    menuVisible,
    toggleButtonAutofocus: toggleButtonAutofocusFromHover,
    onToggleClick: onToggleClickFromHover,
    onMouseEnter,
    onMouseLeave,
  } = useExpandOnHover();

  const {
    activeElement,
    onToggleClick,
    toggleButtonAutofocus,
  } = useExpandOnClick();

  const breakpoint = useBreakpoint();

  const smallBreakpoint = breakpoint === 'zero' || breakpoint === 'small' || breakpoint === 'micro';

  // --- Render

  return (
    <div
      className={styles.expandableMenu}
      onMouseEnter={smallBreakpoint
        ? undefined
        : onMouseEnter}
      onMouseLeave={smallBreakpoint
        ? undefined
        : onMouseLeave
      }
    >
      <div className={styles.buttonWrapper}>

        {/* Render button */}
        {items &&
          <Button
            onClick={smallBreakpoint
              ? (): void => {
                onToggleClick(expandableId);
              }
              : onToggleClickFromHover
            }
            text={text}
            style={smallBreakpoint
              ? 'textBright'
              : 'text'
            }
            colorMode='dark'
            element='button'
            className={styles.buttonLevel1}
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
            style={smallBreakpoint
              ? 'textBright'
              : 'text'
            }
            colorMode='dark'
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

      <ul
        className={listClasses({
          active: smallBreakpoint && expandableId === activeElement,
          menuVisible: !smallBreakpoint && menuVisible,
        })}
        inert={smallBreakpoint
          ? expandableId !== activeElement
          : !menuVisible
        }
      >
        <div className={styles.listWrapper}>
          {items?.map((child, id) => (
            <li key={id}>
              <Button
                text={child.text}
                style={smallBreakpoint
                  ? 'textBright'
                  : 'text'
                }
                colorMode='dark'
                element='link'
                href={child.link}
                className={styles.item}
              />
            </li>
          ))}
        </div>
      </ul>
    </div >
  );
};
