import 'server-only';
import React from 'react';
import styles from '@/components/base/Metanav/Metanav.module.scss';
import { Button } from '@/components/base/Button/Button';

type InterfaceMetanavItem = {
  text: string;
  link: string;
  target: '_self' | '_blank';
}

export type InterfaceMetanavPropTypes = {
  items: InterfaceMetanavItem[],
  className?: string,
};

export const Metanav = ({
  items,
  className,
}: InterfaceMetanavPropTypes): React.JSX.Element => (
  <ul className={`${styles.metanav} ${className}`}>
    {items.map((item, key: number) => (
      <li
        key={key}
      >
        <Button
          className={styles.item}
          text={item.text}
          style='textSmall'
          colorMode='dark'
          element='link'
          href={item.link}
          target={item.target === '_blank'
            ? item.target
            : undefined}
        />
      </li>
    ))}
  </ul>
);
