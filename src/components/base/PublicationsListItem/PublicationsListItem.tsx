import React from 'react';
import styles from '@/components/base/PublicationsListItem/PublicationsListItem.module.scss';
import { formatDateToReadableString } from '@/components/helpers/date';
import { Tag } from '@/components/base/Tag/Tag';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';

export type InterfacePublicationsListItemPropTypes = {
  date: string,
  tag?: string,
  title: string,
  link: {
    href: string,
  },
  pageLanguage: string,
}

export const PublicationsListItem = ({
  date,
  link,
  pageLanguage,
  tag,
  title,
}: InterfacePublicationsListItemPropTypes): React.JSX.Element => {
  const publicationDate = formatDateToReadableString({
    dateString: date,
    locale: pageLanguage,
  });

  const ariaLabel = '';

  return (
    <li
      className={styles.publicationsListItem}
    >
      <a
        aria-label={ariaLabel}
        href={link.href}
        className={styles.link}
      >
        <span className={styles.image}></span>
        <span className={styles.textContent}>
          {tag &&
            <Tag
              text={tag}
              colorTheme='secondary'
              className={styles.textContentTag}
            />
          }

          <SafeHtml
            as='span'
            className={styles.textContentTitle}
            html={title}
          />

          <span className={styles.textContentDate}>
            {publicationDate}
          </span>

        </span>
      </a>
    </li>
  );
};
