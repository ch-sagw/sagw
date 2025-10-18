import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/EventsListItem/EventsListItem.module.scss';
import { Icon } from '@/icons';
import {
  formatDateRangeToReadableString, formatDateToObject,
} from '@/components/helpers/date';
import { Tag } from '@/components/base/Tag/Tag';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';

export type InterfaceEventsListItemPropTypes = {
  text: string;
  link: {
    target: '_self' | '_blank';
    href: string;
  };
  pageLanguage: string;
  dateStart: string;
  dateEnd?: string;
  location?: string;
  language?: string;
  tag?: string;
  time?: string;
  className?: string;
};

export const EventsListItem = ({
  text,
  link,
  dateStart,
  dateEnd,
  location,
  language,
  tag,
  time,
  pageLanguage,
  className,
}: InterfaceEventsListItemPropTypes): React.JSX.Element => {
  const itemClasses = cva([
    styles.item,
    className,
  ]);

  // Date - Time - Location - Language

  let subtitle = formatDateRangeToReadableString({
    endString: dateEnd || dateStart,
    locale: pageLanguage,
    startString: dateStart,
  });

  if (time) {
    subtitle += ` — ${time}`;
  }

  if (location) {
    subtitle += ` — ${location}`;
  }

  if (language) {
    subtitle += ` — ${language}`;
  }

  const startDateObject = formatDateToObject({
    dateString: dateStart,
    locale: pageLanguage,
  });

  return (
    <li className={itemClasses()}>
      <a
        href={link.href}
        className={styles.link}
      >

        {/* TAG */}
        {tag &&
          <Tag
            text={tag}
            colorTheme='secondary'
            className={styles.tag}
          />
        }

        {/* Large Date */}
        <div className={styles.largeDate}>
          <span className={styles.largeDay}>
            {startDateObject.day}
          </span>
          <span className={styles.largeMonthYear}>
            {startDateObject.month} {startDateObject.year}
          </span>
        </div>

        <div className={styles.textAndIconWrapper}>

          {/* Content */}
          <div className={styles.textContent}>
            <SafeHtml
              as='span'
              className={styles.textContentTitle}
              html={text}
            />

            <SafeHtml
              as='span'
              className={styles.textContentText}
              html={subtitle}
            />

          </div>

          {/* Icon */}
          <Icon
            name={link.target === '_blank'
              ? 'externalLink'
              : 'arrowRight'
            }
            className={styles.itemIcon}
          />
        </div>
      </a>
    </li >
  );
};
