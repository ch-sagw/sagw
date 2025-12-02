import React from 'react';
import styles from '@/components/base/PublicationsListItem/PublicationsListItem.module.scss';
import { formatDateToReadableString } from '@/components/helpers/date';
import { Tag } from '@/components/base/Tag/Tag';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import {
  Image,
  InterfaceImagePropTypes,
} from '@/components/base/Image/Image';

export type InterfacePublicationsListItemPropTypes = {
  date: string,
  image: InterfaceImagePropTypes,
  tag?: string,
  title: string,
  link: {
    href: string,
  },
  pageLanguage: string,
}

export const PublicationsListItem = ({
  date,
  image,
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
      data-testid='publicationListItem'
    >
      <a
        aria-label={ariaLabel}
        href={link.href}
        className={styles.link}
      >
        <span className={styles.image}>
          <Image
            alt={image.alt}
            filename={image.filename ?? ''}
            focalX={image.focalX ?? undefined}
            focalY={image.focalY ?? undefined}
            height={170}
            loading={image.loading}
            url={image.url}
            variant={image.variant}
            width={120}
          />
        </span>
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
