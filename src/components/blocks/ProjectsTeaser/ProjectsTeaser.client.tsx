'use client';

import React, { Fragment } from 'react';
import styles from '@/components/blocks/ProjectsTeaser/ProjectsTeaser.module.scss';
import { Section } from '@/components/base/Section/Section';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';

export type InterfaceProjectsTeaserLink = {
  href: string;
  text: string;
  type: 'internal';
};

export type InterfaceProjectsTeaserItem = {
  id?: string | null;
  link: InterfaceProjectsTeaserLink;
  textHtml: string;
  titleHtml: string;
};

export type InterfaceProjectsTeaserClientPropTypes = {
  alignment: 'horizontal' | 'vertical' | null | undefined;
  items: InterfaceProjectsTeaserItem[];
  optionalLink?: {
    href: string;
    linkTextHtml: string;
  } | null;
  subtitleHtml: string;
  titleHtml: string;
};

export const ProjectsTeaserClient = ({
  alignment,
  items,
  optionalLink,
  subtitleHtml,
  titleHtml,
}: InterfaceProjectsTeaserClientPropTypes): React.JSX.Element => (
  <Fragment>
    <Section
      className={styles.section}
      colorMode='white'
      fullBleed={alignment === 'vertical'}
      subtitle={subtitleHtml}
      title={titleHtml}
    >
      {optionalLink && (
        <Button
          className={styles.link}
          colorMode='white'
          element='link'
          href={optionalLink.href}
          iconInlineStart={'arrowRight' as keyof typeof Icon}
          isActive={true}
          prefetch={true}
          style='text'
          text={optionalLink.linkTextHtml}
        />
      )}
    </Section>

    <ul
      className={styles.list}
      data-testid='projects-teaser-linklist'
    >
      {items.map((item) => (
        <GenericTeaser
          className={styles.item}
          key={item.id}
          links={[item.link]}
          texts={[item.textHtml]}
          title={item.titleHtml}
          type='generic'
        />
      ))}
    </ul>
  </Fragment>
);

