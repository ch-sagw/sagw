import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/DownloadLinkItem/DownloadLinkItem.module.scss';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { formatDateToReadableString } from '@/components/helpers/date';
import { Icon } from '@/icons';
import Link from 'next/link';
import {
  useLocale, useTranslations,
} from 'next-intl';
import { TypedLocale } from 'payload';

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
  date?: string;
  text?: never;
}

interface InterfaceLinkItem extends InterfaceDownloadLinkItemBaseProps {
  type: 'link';
  text?: string;
  format?: never;
  size?: never;
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
}: InterfaceDownloadLinkItemPropTypes): React.JSX.Element => {
  const locale = useLocale() as TypedLocale;
  const internalI18nA11y = useTranslations('a11y');
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
      locale,
      size,
    });
    ariaLabelText = downloadText;
  }

  let ariaLabel = `${title}. ${ariaLabelText}.`;

  if (link.target === '_blank') {
    ariaLabel += `
      ${internalI18nA11y('linkTarget')} ${internalI18nA11y('opensInNewWindow')}`;
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
