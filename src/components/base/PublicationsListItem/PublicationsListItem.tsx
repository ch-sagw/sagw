import React from 'react';
import styles from '@/components/base/PublicationsListItem/PublicationsListItem.module.scss';
import { formatDateToReadableString } from '@/components/helpers/date';
import { Tag } from '@/components/base/Tag/Tag';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import {
  Image,
  InterfaceImagePropTypes,
} from '@/components/base/Image/Image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  PublicationTopic,
  PublicationType,
} from '@/payload-types';

export type InterfacePublicationsListItemPropTypes = {
  categorization: {
    topic?: string | PublicationTopic,
    type?: string | PublicationType,
  },
  date: string,
  id?: string | number,
  image: InterfaceImagePropTypes,
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

  console.log('tag in PublicationsListItem');
  console.log(tag);

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
        <span className={styles.image}>
          <Image
            alt={image.alt}
            filename={image.filename ?? null}
            focalX={image.focalX ?? undefined}
            focalY={image.focalY ?? undefined}
            height={170}
            loading={image.loading}
            url={image.url ?? null}
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
      </Link>
    </li>
  );
};
