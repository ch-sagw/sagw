import React from 'react';
import styles from '@/components/base/Metanav/Metanav.module.scss';
import { Button } from '@/components/base/Button/Button';
import { ColorMode } from '@/components/base/types/colorMode';
import { Config } from '@/payload-types';

export type InterfaceMetanavItem = {
  text: string;
  link: string;
  target: '_self' | '_blank';
}

type InterfaceMetanavItemButton = {
  text: string;
  clickCallback: () => void;
}

export type InterfaceMetanavPropTypes = {
  items: (InterfaceMetanavItem | InterfaceMetanavItemButton)[],
  className?: string,
  colorMode: ColorMode;
  pageLanguage: Config['locale'];
};

export const Metanav = ({
  items,
  className,
  colorMode,
  pageLanguage,
}: InterfaceMetanavPropTypes): React.JSX.Element => (
  <ul className={`${styles.metanav} ${className} ${styles[colorMode]}`}>
    {items.map((item, key: number) => (
      <li
        key={key}
      >
        {'link' in item && 'target' in item &&
          <Button
            className={styles.item}
            text={item.text}
            style='textSmall'
            colorMode={colorMode}
            element='link'
            href={item.link}
            pageLanguage={pageLanguage}
            target={item.target === '_blank'
              ? item.target
              : undefined}
          />
        }

        {'clickCallback' in item &&
          <Button
            className={styles.item}
            text={item.text}
            style='textSmall'
            colorMode={colorMode}
            element='button'
            onClick={item.clickCallback}
            ariaHasPopUp={true}
          />
        }
      </li>
    ))}
  </ul>
);
