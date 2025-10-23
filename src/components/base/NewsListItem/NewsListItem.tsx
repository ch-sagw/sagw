import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/NewsListItem/NewsListItem.module.scss';
import { Icon } from '@/icons';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';

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

  const ariaLabel = `${title}. ${text}. ${date}`;

  return (
    <li
      className={itemClasses()}
      data-testid='newsListItem'
    >
      <a
        aria-label={ariaLabel}
        href={link}
        className={styles.link}
      >
        <div className={styles.textContent}>
          <SafeHtml
            className={styles.itemTitle}
            as='span'
            html={title}
          />

          <SafeHtml
            className={styles.itemText}
            as='span'
            html={text}
          />

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
