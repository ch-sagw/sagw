import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/GenericTeaser/GenericTeaser.module.scss';
import { SafeHtml } from '../SafeHtml/SafeHtml';
import { Button } from '../Button/Button';
import { Config } from '@/payload-types';
import { Icon } from '@/icons';

type InterfaceLinkType = 'internal' | 'external' | 'mail' | 'phone';
interface InterfaceLink {
  text?: string;
  href: string;
  type?: InterfaceLinkType;
}

export type InterfaceBaseTeaserProps = {
  title: string;
  texts?: string[];
  links: InterfaceLink[];
  pageLanguage: Config['locale'];
  type: 'institute' | 'network' | 'project' | 'magazine' | 'people' | 'generic';
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
  lang,
  wrapper,
}: {
  link: InterfaceLink;
  key: number;
  lang: Config['locale'];
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
      pageLanguage={lang}
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
  pageLanguage,
  type,
}: InterfaceGenericTeaserPropTypes): React.JSX.Element => {
  let WrapperElement: keyof React.JSX.IntrinsicElements = 'div';
  let linkTarget;
  let target;
  const teaserClasses = cva([
    styles.teaser,
    styles[type],
  ]);

  if (links && links.length === 1) {
    const [link] = links;

    WrapperElement = 'a';
    linkTarget = link.href;

    if (link.type === 'external') {
      target = '_blank';
    }
  }

  return (
    <li
      className={teaserClasses()}
    >
      <WrapperElement
        href={linkTarget}
        className={styles.wrapper}
        target={target}

      // TODO
      // aria-label
      >
        {logo &&
          <div className={styles.logo}>logo placeholder</div>
        }

        {image &&
          <div className={styles.image}>image placeholder</div>
        }

        <SafeHtml
          as='p'
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
          links.map((link, key) => renderLink({
            key,
            lang: pageLanguage,
            link,
            wrapper: WrapperElement,
          }))
        }
      </WrapperElement>
    </li>
  );
};
