import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/TeaserLinkList/TeaserLinkList.module.scss';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { ColorMode } from '@/components/base/types/colorMode';
import { Section } from '@/components/base/Section/Section';
import { Config } from '@/payload-types';

export type InterfaceTeaserLinkListPropTypes = {
  allLink?: {
    text: string;
    href: string;
  };
  children: React.ReactNode;
  className?: string;
  colorMode: ColorMode;
  subtitle?: string;
  style?: 'events' | 'news' | 'publications';
  title: string;
  pageLanguage: Config['locale'];
};

export const TeaserLinkList = (props: InterfaceTeaserLinkListPropTypes): React.JSX.Element => {
  const {
    allLink,
    colorMode,
    subtitle,
    style,
    title,
    pageLanguage,
  } = props;

  const listClasses = cva([styles.list], {
    variants: {
      style: {
        events: [styles.eventsList],
        news: [styles.newsList],
        publications: [styles.publicationsList],
      },
    },
  });

  return (
    <Section
      className={styles.teaserLinkList}
      showTopLine={true}
      title={title}
      subtitle={subtitle}
      colorMode={colorMode}
    >

      <ul className={listClasses({
        style,
      })}>
        {props.children}
      </ul>

      {allLink &&
        <Button
          style='text'
          colorMode={colorMode}
          element='link'
          href={allLink.href}
          className={styles.allLink}
          text={allLink.text}
          iconInlineStart={'arrowRight' as keyof typeof Icon}
          pageLanguage={pageLanguage}
        />
      }

    </Section>
  );
};
