import 'server-only';
import React from 'react';
import styles from '@/components/base/Metanav/Metanav.module.scss';

export type InterfaceMetanavPropTypes = {
  items: string[],
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
        {item}
      </li>
    ))}
  </ul>
);
