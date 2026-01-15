import React from 'react';
import styles from '@/components/base/PublicationsListItem/PublicationsListItem.module.scss';
import { formatDateToReadableString } from '@/components/helpers/date';
import { Tag } from '@/components/base/Tag/Tag';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  Image as ImageType,
  PublicationTopic,
  PublicationType,
} from '@/payload-types';
import { Image } from '@/components/base/Image/Image';
import { ImageVariant } from '@/components/base/types/imageVariant';

export type InterfacePublicationsListItemPropTypes = {
  categorization: {
    topic?: string | PublicationTopic,
    type?: string | PublicationType,
  },
  date: string,
  id?: string | number,
  image?: ImageType | undefined;
  tag?: string,
  title: string,
  link: {
    href: string,
  },
}

export const PublicationsListItem = ({
  date,
  image,
  link,
  tag,
  title,
}: InterfacePublicationsListItemPropTypes): React.JSX.Element => {
  const locale = useLocale();

  const publicationDate = formatDateToReadableString({
    dateString: date,
    locale,
  });

  const ariaLabel = '';
  const imageVariant = 'publicationTeaser';

  return (
    <li
      className={styles.publicationsListItem}
      data-testid='publicationListItem'
    >
      <Link
        aria-label={ariaLabel}
        href={link.href}
        className={styles.link}
        prefetch={true}
      >
        {typeof image === 'object' && image.url
          ? (
            <span className={styles.image}>
              <Image
                alt={image.alt}
                filename={image.filename || ''}
                focalX={image.focalX || 50}
                focalY={image.focalY || 50}
                height={170}
                loading='lazy'
                url={image.url}
                variant={imageVariant as ImageVariant}
                width={120}
              />
            </span>
          )
          : null
        }
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
      </Link>
    </li>
  );
};
