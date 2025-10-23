import React from 'react';
import styles from '@/components/base/TeaserLinkList/TeaserLinkList.module.scss';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { ColorMode } from '@/components/base/types/colorMode';
import { Section } from '@/components/base/Section/Section';
import { Config } from '@/payload-types';

export type InterfaceTeaserLinkListPropTypes = {
  children: React.ReactNode;
  title: string;
  colorMode: ColorMode;
  allLink?: {
    text: string;
    href: string;
  };
  subtitle?: string;
  pageLanguage: Config['locale'];
};

export const TeaserLinkList = (props: InterfaceTeaserLinkListPropTypes): React.JSX.Element => {
  const {
    allLink,
    colorMode,
    subtitle,
    title,
    pageLanguage,
  } = props;

  return (
    <Section
      className={styles.teaserLinkList}
      showTopLine={true}
      title={title}
      subtitle={subtitle}
      colorMode={colorMode}
    >

      <ul className={styles.list}>
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
