import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/DownloadLinkItem/DownloadLinkItem.module.scss';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { formatDateToReadableString } from '@/components/helpers/date';
import { Icon } from '@/icons';
import { i18nA11y as internalI18nA11y } from '@/i18n/content';
import Link from 'next/link';

interface InterfaceDownloadLinkItemBaseProps {
  className?: string;
  title: string;
  link: {
    href: string;
    target: '_self' | '_blank'
  },
}

interface InterfaceDownloadItem extends InterfaceDownloadLinkItemBaseProps {
  type: 'download';
  format: string;
  size: string;
  pageLanguage: string;
  date?: string;
  text?: never;
}

interface InterfaceLinkItem extends InterfaceDownloadLinkItemBaseProps {
  type: 'link';
  text?: string;
  format?: never;
  size?: never;
  pageLanguage?: never;
  date?: never;
}

export type InterfaceDownloadLinkItemPropTypes = InterfaceDownloadItem | InterfaceLinkItem;

const getDownloadText = (props: {
  date: string | undefined;
  format: string;
  size: string;
  locale: string;
}): string => {
  let returnString;
  const baseString = `${props.format} — ${props.size}`;

  if (props.date) {
    returnString = `${formatDateToReadableString({
      dateString: props.date,
      locale: props.locale,
    })} — ${baseString}`;
  } else {
    returnString = baseString;
  }

  return returnString;
};

export const DownloadLinkItem = ({
  className,
  title,
  link,
  type,
  text,
  format,
  size,
  date,
  pageLanguage,
}: InterfaceDownloadLinkItemPropTypes): React.JSX.Element => {
  const itemClasses = cva([
    styles.item,
    className,
  ]);

  let iconName = 'download';

  let ariaLabelText = text;
  let downloadText = '';

  if (type === 'link') {
    iconName = link.target === '_self'
      ? 'arrowRight'
      : 'externalLink';
  } else {
    downloadText = getDownloadText({
      date,
      format,
      locale: pageLanguage,
      size,
    });
    ariaLabelText = downloadText;
  }

  let ariaLabel = `${title}. ${ariaLabelText}.`;

  if (link.target === '_blank') {
    ariaLabel += `
      ${internalI18nA11y.linkTarget[pageLanguage as keyof typeof internalI18nA11y.linkTarget]} ${internalI18nA11y.opensInNewWindow[pageLanguage as keyof typeof internalI18nA11y.linkTarget]}`;
  }

  return (
    <li
      className={itemClasses()}
      data-testid='downloadLinkItem'
    >
      <Link
        aria-label={ariaLabel}
        href={link.href}
        target={link.target}
        className={styles.link}
        prefetch={true}
      >

        <div className={styles.content}>

          {/* title */}
          <SafeHtml
            as='span'
            className={styles.title}
            html={title}
          />

          {/* text */}
          {type === 'link' && text &&
            <SafeHtml
              as='span'
              className={styles.text}
              html={text}
            />
          }

          {type === 'download' &&
            <SafeHtml
              as='span'
              className={styles.text}
              html={downloadText}
            />
          }
        </div>

        {/* icon */}
        <Icon
          className={styles.icon}
          name={iconName as keyof typeof Icon}
        />

      </Link>
    </li>
  );
};
