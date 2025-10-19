import React from 'react';
import styles from '@/components/base/DownloadLinkList/DownloadLinkList.module.scss';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';

interface InterfaceBaseProps {
  children: React.ReactNode;
  title: string;
}

interface InterfaceDownloadProps extends InterfaceBaseProps {
  type: 'download';
  allLink?: {
    text: string;
    href: string;
  };
  subtitle?: string;
}

interface InterfaceLinkProps extends InterfaceBaseProps {
  type: 'link';
  allLink?: never;
  subtitle?: never;
}

export type InterfaceDownloadLinkListPropTypes = InterfaceDownloadProps | InterfaceLinkProps;

export const DownloadLinkList = (props: InterfaceDownloadLinkListPropTypes): React.JSX.Element => {
  const {
    title,
    type,
    allLink,
    subtitle,
  } = props;

  return (
    <section
      className={styles.downloadLinkList}
    >
      <h2 className={styles.title}>{title}</h2>

      {subtitle &&
        <SafeHtml
          as='p'
          className={styles.subtitle}
          html={subtitle}
        />
      }

      <ul className={styles.list}>
        {props.children}
      </ul>

      {type === 'download' && allLink &&
        <Button
          style='text'
          colorMode='light'
          element='link'
          href={allLink.href}
          className={styles.allLink}
          text={allLink.text}
          iconInlineStart={'arrowRight' as keyof typeof Icon}
        />
      }
    </section>
  );
};
