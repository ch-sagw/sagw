import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/NewsSection/NewsSection.module.scss';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';

interface InterfaceNewsSectionItem {
  title: string;
  text: string;
  date: string;
  link: string;
}

interface InterfaceNewsSectionBasePropTypes {
  items: InterfaceNewsSectionItem[];
  title: string;
  type: 'teaser' | 'overview';
}

interface InterfaceNewsSectionTeaserPropTypes {
  allLink: {
    text: string;
    href: string;
  }
}

export type InterfaceNewsSectionPropTypes =
  | (InterfaceNewsSectionBasePropTypes & {
    type: 'overview';
  })
  | (InterfaceNewsSectionBasePropTypes &
    InterfaceNewsSectionTeaserPropTypes & {
      type: 'teaser';
    });

const sectionClasses = cva([styles.newsSection], {
  variants: {
    type: {
      overview: [styles.overview],
      teaser: [styles.teaser],
    },
  },
});

export const NewsSection = (props: InterfaceNewsSectionPropTypes): React.JSX.Element => {
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

      {type === 'teaser' &&
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
    </section>
  );
};
