import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/News/News.module.scss';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { Pagination } from '@/components/base/Pagination/Pagination';

interface InterfaceNewsItem {
  title: string;
  text: string;
  date: string;
  link: string;
}

interface InterfaceNewsBasePropTypes {
  items: InterfaceNewsItem[];
  title: string;
  type: 'teaser' | 'overview';
}

interface InterfaceNewsTeaserPropTypes {
  allLink?: {
    text: string;
    href: string;
  }
}

interface InterfaceNewsOverviewPropTypes {
  pagination: {
    totalPages: number;
    currentPage: number;
    paginationTitle: string;
    onPageChange?: (page: number) => void;
  }
}

export type InterfaceNewsPropTypes =
  | (InterfaceNewsBasePropTypes &
    InterfaceNewsOverviewPropTypes & {
      type: 'overview';
    })
  | (InterfaceNewsBasePropTypes &
    InterfaceNewsTeaserPropTypes & {
      type: 'teaser';
    });

const sectionClasses = cva([styles.news], {
  variants: {
    type: {
      overview: [styles.overview],
      teaser: [styles.teaser],
    },
  },
});

export const News = (props: InterfaceNewsPropTypes): React.JSX.Element => {
  const {
    items,
    title,
    type,
  } = props;

  return (
    <section
      className={sectionClasses({
        type,
      })}
    >
      <h2 className={styles.title}>{title}</h2>

      <ul className={styles.list}>
        {items.map((item, key) => (
          <li
            key={key}
            className={styles.item}
          >
            <a
              href={item.link}
              className={styles.link}
            >
              <div className={styles.textContent}>
                <span className={styles.itemTitle}>
                  {item.title}
                </span>
                <span className={styles.itemText}>
                  {item.text}
                </span>
                <span className={styles.itemDate}>
                  {item.date}
                </span>
              </div>
              <Icon
                name='arrowRight'
                className={styles.itemIcon}
              />
            </a>
          </li>
        ))}
      </ul>

      {type === 'teaser' && props.allLink &&
        <Button
          style='text'
          colorMode='light'
          element='link'
          href={props.allLink.href}
          className={styles.allLink}
          text={props.allLink.text}
          iconInlineStart={'arrowRight' as keyof typeof Icon}
        />
      }

      {type === 'overview' &&
        <Pagination
          totalPages={props.pagination.totalPages}
          currentPage={props.pagination.currentPage}
          paginationTitle={props.pagination.paginationTitle}
          onPageChange={props.pagination.onPageChange}
        />
      }
    </section>
  );
};
