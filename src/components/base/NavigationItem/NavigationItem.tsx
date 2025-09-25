import React from 'react';
import { cva } from 'cva';
import { Button } from '@/components/base/Button/Button';
import styles from '@/components/base/NavigationItem/NavigationItem.module.scss';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Icon } from '@/icons';
import { useExpandOnHover } from '@/hooks/useExpandOnHover';

// --- Interfaces

type InterfaceNavigationItemChild = {
  text: string;
  link: string;
}

type InterfaceNavigationItemWithItems = {
  text: string;
  link: string;
  items?: never;
};

type InterfaceNavigationItemWithoutItems = {
  text: string;
  items: InterfaceNavigationItemChild[];
  link?: never;
};

export type InterfaceNavigationItemPropTypes =
  | InterfaceNavigationItemWithItems
  | InterfaceNavigationItemWithoutItems;

// --- Classes

const listClasses = cva([styles.list], {
  variants: {
    menuVisible: {
      false: null,
      true: [styles.visible],
    },
  },
});

// --- Component

export const NavigationItem = ({
  text,
  items,
  link,
}: InterfaceNavigationItemPropTypes): React.JSX.Element => {
  // --- Hooks

  const {
    menuVisible,
    toggleButtonAutofocus,
    toggleMenu,
    onToggleClick,
    onMouseEnter,
    onMouseLeave,
  } = useExpandOnHover();

  const breakpoint = useBreakpoint();

  const smallBreakpoint = breakpoint === 'zero' || breakpoint === 'small' || breakpoint === 'micro';

  // --- Render

  return (
    <div
      className={styles.expandableMenu}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.buttonWrapper}>

        {/* Render button */}
        {items &&
          <Button
            onClick={onToggleClick}
            text={text}
            style={smallBreakpoint
              ? 'textBright'
              : 'text'
            }
            colorMode='dark'
            element='button'
            className={styles.buttonLevel1}
            ariaExpanded={menuVisible}
            autoFocus={toggleButtonAutofocus}
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
            className={styles.icon}
          />
        }

      </div>

      <ul
        className={listClasses({
          menuVisible,
        })}
        inert={!menuVisible}
      >
        <div className={styles.listWrapper}>
          {items?.map((child, id) => (
            <li key={id}>
              <Button
                onClick={() => {
                  toggleMenu({
                    show: false,
                  });
                }}
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
