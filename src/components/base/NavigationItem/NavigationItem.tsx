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
  footer?: boolean;
};

type InterfaceNavigationItemWithoutItems = {
  text: string;
  items?: never;
  link: string;
  expandableId?: never;
  footer?: boolean;
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

  const smallBreakpoint = breakpoint === 'zero' || breakpoint === 'small' || breakpoint === 'micro' || breakpoint === 'medium';

  // --- Classes

  const menuClasses = cva([styles.expandableMenu], {
    variants: {
      footer: {
        false: '',
        true: styles.footer,
      },
    },
  });

  // --- Render

  return (
    <div
      className={menuClasses({
        footer,
      })}
      onMouseEnter={smallBreakpoint
        ? undefined
        : onMouseEnter}
      onMouseLeave={smallBreakpoint
        ? undefined
        : onMouseLeave
      }
      onClick={(smallBreakpoint && expandableId
        ? (): void => {
          onToggleClick(expandableId);
        }
        : onToggleClickFromHover
      )}
    >
      <div
        className={styles.buttonWrapper}
      >

        {/* Render button */}
        {items &&
          <Button
            text={text}
            style={smallBreakpoint || footer
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
            style={smallBreakpoint || footer
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

      {/* Expandable content */}
      <ul
        className={listClasses({
          active: smallBreakpoint && expandableId === activeElement,
          menuVisible: !smallBreakpoint && menuVisible,
        })}
        inert={smallBreakpoint
          ? expandableId !== activeElement
          : !menuVisible && !footer
        }
      >
        <div className={styles.listWrapper}>
          {items?.map((child, id) => (
            <li key={id}>
              <Button
                text={child.text}
                style={footer
                  ? 'textSmall'
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
