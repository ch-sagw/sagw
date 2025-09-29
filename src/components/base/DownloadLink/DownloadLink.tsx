import 'server-only';
import React from 'react';
import styles from '@/components/base/DownloadLink/DownloadLink.module.scss';
import { Icon } from '@/icons';
import Link from 'next/link';
import { VisuallyHiddenTexts } from '@/i18n/visually-hidden-texts';

export type InterfaceDownloadLinkPropTypes = {
  file: {
    publicationDate: string,
    size: string,
    type: 'PDF',
  },
  forceDownload?: boolean;
  linkTarget: string,
  linkText: string;
};

export const DownloadLink = ({
  file,
  forceDownload,
  linkTarget,
  linkText,
}: InterfaceDownloadLinkPropTypes): React.JSX.Element => {
  let ariaLabelText = `${file.type} ${linkText}. `;

  ariaLabelText += `${VisuallyHiddenTexts['de'].publishedOn} ${file.publicationDate}, `;
  ariaLabelText += `${VisuallyHiddenTexts['de'].file.size} ${file.size}. `;
  ariaLabelText += `${VisuallyHiddenTexts['de'].linkTarget} ${VisuallyHiddenTexts['de'].opensInNewWindow}`;

  return (
    <Link
      aria-label={ariaLabelText}
      data-testid='link'
      className={styles.downloadLink}
      download={Boolean(forceDownload)}
      href={linkTarget}
      target='_blank'
      prefetch={false}
    >
      <div
        className={styles.wrapperText}
      >
        <span
          className={styles.linkText}
        >
          {linkText}
        </span>
        <div
          aria-hidden='true'
          className={styles.metaInfo}
        >
          <span>{file.publicationDate}</span>
          <span> — {file.type}</span>
          <span> — {file.size}</span>
        </div>
      </div>
      <Icon
        className={styles.icon}
        name='download'
      />
    </Link >
  );

};
