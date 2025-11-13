import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/EventsListItem/EventsListItem.module.scss';
import { Icon } from '@/icons';
import { formatDateToObject } from '@/components/helpers/date';
import { Tag } from '@/components/base/Tag/Tag';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { i18nA11y as internalI18nA11y } from '@/i18n/content';
import { formatEventDetails } from '@/components/base/EventsListItem/helpers';
import { Config } from '@/payload-types';

export type InterfaceEventsListItemPropTypes = {
  text: string;
  link: {
    target: '_self' | '_blank';
    href: string;
  };
  pageLanguage: Config['locale'];
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
  const subtitle = formatEventDetails({
    dateEnd,
    dateStart,
    eventLocation: location,
    language,
    pageLanguage,
    time,
  });

  const startDateObject = formatDateToObject({
    dateString: dateStart,
    locale: pageLanguage,
  });

  let ariaLabel = `${tag
    ? tag
    : ''} ${text} ${subtitle}.`;

  if (link.target === '_blank') {
    ariaLabel += `
      ${internalI18nA11y.linkTarget[pageLanguage as keyof typeof internalI18nA11y.linkTarget]} ${internalI18nA11y.opensInNewWindow[pageLanguage as keyof typeof internalI18nA11y.linkTarget]}`;
  }

  return (
    <li
      className={itemClasses()}
      data-testid='eventListItem'
    >
      <a
        aria-label={ariaLabel}
        href={link.href}
        target={link.target}
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
