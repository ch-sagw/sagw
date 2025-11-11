import React from 'react';
import styles from '@/components/base/PublicationTeaserItem/PublicationTeaserItem.module.scss';
import { formatDateToReadableString } from '@/components/helpers/date';
import { Tag } from '@/components/base/Tag/Tag';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';

export type InterfacePublicationTeaserItemPropTypes = {
  date: string,
  image: string,
  tag?: string,
  text: string,
  link: {
    href: string,
  },
  pageLanguage: string,
}

export const PublicationTeaserItem = ({
  date,
  link,
  pageLanguage,
  tag,
  text,
}: InterfacePublicationTeaserItemPropTypes): React.JSX.Element => {
  const publicationDate = formatDateToReadableString({
    dateString: date,
    locale: pageLanguage,
  });

  const ariaLabel = '';

  return (
    <li
      className={styles.publicationTeaserItem}
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
            html={text}
          />

          <span className={styles.textContentDate}>
            {publicationDate}
          </span>

        </span>
      </a>
    </li>
  );
};
