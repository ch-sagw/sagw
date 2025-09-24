import React, { useState } from 'react';
import { Button } from '@/components/base/Button/Button';
import styles from '@/components/base/NavigationItem/NavigationItem.module.scss';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Icon } from '@/icons';

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

export const NavigationItem = ({
  text,
  items,
  link,
}: InterfaceNavigationItemPropTypes): React.JSX.Element => {
  const breakpoint = useBreakpoint();

  const [
    levelExpanded,
    setLevelExpanded,
  ] = useState(false);

  const smallBreakpoint = breakpoint === 'zero' || breakpoint === 'small' || breakpoint === 'micro';

  const onLevel1Click = (): void => {
    setLevelExpanded(!levelExpanded);
  };

  return (
    <div className={styles.item}>
      <div className={styles.buttonWrapper}>

        {/* Render button */}
        {items &&
          <Button
            onClick={onLevel1Click}
            text={text}
            style={smallBreakpoint
              ? 'textBright'
              : 'text'
            }
            colorMode='dark'
            element='button'
            className={styles.buttonLevel1}
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

      {levelExpanded &&
        <ul className={styles.menu}>
          {items?.map((child, id) => (
            <Button
              key={id}
              text={child.text}
              style={smallBreakpoint
                ? 'textBright'
                : 'text'
              }
              colorMode='dark'
              element='link'
              href={child.link}
              className={styles.buttonLevel2}
            />
          ))}
        </ul>
      }
    </div >
  );
};
