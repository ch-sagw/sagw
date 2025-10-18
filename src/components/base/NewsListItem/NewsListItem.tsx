import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/NewsListItem/NewsListItem.module.scss';
import { Icon } from '@/icons';

export type InterfaceNewsListItemPropTypes = {
  title: string;
  text: string;
  date: string;
  link: string;
  className?: string;
};

export const NewsListItem = ({
  title,
  text,
  date,
  link,
  className,
}: InterfaceNewsListItemPropTypes): React.JSX.Element => {
  const itemClasses = cva([
    styles.item,
    className,
  ]);

  return (
    <li className={itemClasses()}>
      <a
        href={link}
        className={styles.link}
      >
        <div className={styles.textContent}>
          <span className={styles.itemTitle}>
            {title}
          </span>
          <span className={styles.itemText}>
            {text}
          </span>
          <span className={styles.itemDate}>
            {date}
          </span>
        </div>
        <Icon
          name='arrowRight'
          className={styles.itemIcon}
        />
      </a>
    </li>
  );
};
