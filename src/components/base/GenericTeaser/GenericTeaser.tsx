import React from 'react';
import { cva } from 'cva';
import Link from 'next/link';
import styles from '@/components/base/GenericTeaser/GenericTeaser.module.scss';
import { SafeHtml } from '../SafeHtml/SafeHtml';
import { Button } from '../Button/Button';
import { Icon } from '@/icons';
import { Image as ImageType } from '@/payload-types';
import { Image } from '@/components/base/Image/Image';
import { ImageVariant } from '@/components/base/types/imageVariant';

type InterfaceLinkType = 'internal' | 'external' | 'mail' | 'phone';
export interface InterfaceGenericTeaserLink {
  text?: string;
  href: string;
  type?: InterfaceLinkType;
}

export type InterfaceBaseTeaserProps = {
  image?: ImageType | undefined;
  title: string;
  texts?: string[];
  links: InterfaceGenericTeaserLink[];
  type: 'institute' | 'network' | 'project' | 'magazine' | 'people' | 'generic';
  className?: string;
};

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
  type,
  className,
}: InterfaceBaseTeaserProps): React.JSX.Element => {

  const teaserClasses = cva([
    styles.teaser,
    styles[type],
    className,
  ]);

  let imageVariant = 'genericTeaser';
  const imageWidth = 400;
  let imageHeight = 300;
  let optimizeImage = true;

  if (type === 'people') {
    imageVariant = 'portrait';
    imageHeight = 400;
  }

  if (type === 'network') {
    imageVariant = 'networkTeaser';
    imageHeight = 100;
  }

  if (type === 'institute') {
    imageVariant = 'instituteTeaser';
    imageHeight = 225;
  }

  // If we handle a svg file, we do not
  // optimize it further in the image
  // component. To prevent optimization
  // we set the optimize property to false
  if (image?.mimeType?.includes('svg')) {
    optimizeImage = false;
  }

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
      {typeof image === 'object' && image.url
        ? (
          <div className={styles.image}>
            <Image
              alt={image.alt}
              filename={image.filename || ''}
              focalX={image.focalX || 50}
              focalY={image.focalY || 50}
              height={imageHeight}
              loading='lazy'
              optimize={optimizeImage}
              url={image.url}
              variant={imageVariant as ImageVariant}
              width={imageWidth}
            />
          </div>
        )
        : null
      }

      <SafeHtml
        as='h3'
        html={title}
        className={styles.title}
      />

      <div className={styles.textWrapper}>
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
      </div>

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
