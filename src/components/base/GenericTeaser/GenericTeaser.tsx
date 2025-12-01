import React from 'react';
import { cva } from 'cva';
import Link from 'next/link';
import styles from '@/components/base/GenericTeaser/GenericTeaser.module.scss';
import { SafeHtml } from '../SafeHtml/SafeHtml';
import { Button } from '../Button/Button';
import { Icon } from '@/icons';

type InterfaceLinkType = 'internal' | 'external' | 'mail' | 'phone';
export interface InterfaceGenericTeaserLink {
  text?: string;
  href: string;
  type?: InterfaceLinkType;
}

export type InterfaceBaseTeaserProps = {
  title: string;
  texts?: string[];
  links: InterfaceGenericTeaserLink[];
  type: 'institute' | 'network' | 'project' | 'magazine' | 'people' | 'generic';
  className?: string;
};

// Image and logo both are optional. But as soon as image is set,
// logo is not allowed and vice versa.
type InterfaceGenericTeaserPropTypes =
  | (InterfaceBaseTeaserProps & { image?: string; logo?: never })
  | (InterfaceBaseTeaserProps & { logo?: string; image?: never })
  | (InterfaceBaseTeaserProps & { image?: undefined; logo?: undefined });

const renderLink = ({
  link,
  key,
  wrapper,
}: {
  link: InterfaceGenericTeaserLink;
  key: number;
  wrapper: string;
}): React.JSX.Element | undefined => {

  if (!link.text || !link.href) {
    return undefined;
  }

  let icon;

  if (link.type === 'internal') {
    icon = 'arrowRight';
  } else if (link.type === 'external') {
    icon = 'externalLink';
  } else if (link.type === 'mail') {
    icon = 'mail';
  } else if (link.type === 'phone') {
    icon = 'phone';
  }

  if (wrapper === 'a') {
    return (
      <Button
        className={styles.link}
        classNameLinkText={styles.linkText}
        key={key}
        element='text'
        colorMode='light'
        style='text'
        text={link.text}
        iconInlineStart={icon
          ? icon as keyof typeof Icon
          : undefined
        }
      />
    );
  }

  return (
    <Button
      className={styles.link}
      classNameLinkText={styles.linkText}
      key={key}
      element='link'
      href={link.href}
      colorMode='light'
      style='text'
      text={link.text}
      prefetch={true}
      iconInlineStart={icon
        ? icon as keyof typeof Icon
        : undefined
      }
    />
  );

};

export const GenericTeaser = ({
  title,
  texts,
  links,
  image,
  logo,
  type,
  className,
}: InterfaceGenericTeaserPropTypes): React.JSX.Element => {
  const teaserClasses = cva([
    styles.teaser,
    styles[type],
    className,
  ]);

  const shouldWrapInLink = links && links.length === 1;
  const link = shouldWrapInLink
    ? links[0]
    : null;
  const linkTarget = link?.href;
  const target = link?.type === 'external'
    ? '_blank'
    : undefined;

  const wrapperContent = (
    <>
      {logo &&
        <div className={styles.logo}>logo placeholder</div>
      }

      {image &&
        <div className={styles.image}>image placeholder</div>
      }

      <SafeHtml
        as='h3'
        html={title}
        className={styles.title}
      />

      {texts &&
        texts.map((text, key) => (
          <SafeHtml
            key={key}
            as='p'
            html={text}
            className={styles.text}
          />
        ))
      }

      {links &&
        links.map((wrapperLink, key) => renderLink({
          key,
          link: wrapperLink,
          wrapper: shouldWrapInLink
            ? 'a'
            : 'div',
        }))
      }
    </>
  );

  return (
    <li
      className={teaserClasses()}
    >
      {shouldWrapInLink && linkTarget
        ? (
          <Link
            href={linkTarget}
            className={styles.wrapper}
            target={target}
            prefetch={true}
          // TODO
          // aria-label
          >
            {wrapperContent}
          </Link>
        )
        : (
          <div
            className={styles.wrapper}
          >
            {wrapperContent}
          </div>
        )}
    </li>
  );
};
