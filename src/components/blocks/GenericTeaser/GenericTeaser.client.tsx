'use client';

import React, { Fragment } from 'react';
import styles from '@/components/blocks/GenericTeaser/GenericTeaser.module.scss';
import { Section } from '@/components/base/Section/Section';
import { GenericTeaser as TeaserBaseComponent } from '@/components/base/GenericTeaser/GenericTeaser';
import { Image as ImageType } from '@/payload-types';

export type InterfaceGenericTeaserLink = {
  href: string;
  text: string;
  type: 'internal' | 'external' | 'mail';
};

export type InterfaceGenericTeaserItem = {
  id?: string | null;
  image?: ImageType | undefined;
  titleHtml: string;
  textHtml: string;
  link: InterfaceGenericTeaserLink;
};

export type InterfaceGenericTeaserClientPropTypes = {
  titleHtml: string;
  subtitleHtml: string;
  alignment: 'horizontal' | 'vertical' | null | undefined;
  teasers: InterfaceGenericTeaserItem[];
};

export const GenericTeaserClient = ({
  titleHtml,
  subtitleHtml,
  alignment,
  teasers,
}: InterfaceGenericTeaserClientPropTypes): React.JSX.Element => (
  <Fragment>
    <Section
      className={styles.section}
      title={titleHtml}
      subtitle={subtitleHtml}
      colorMode='white'
      fullBleed={alignment === 'vertical'}
    />

    <ul className={styles.list}>
      {teasers.map((item) => (
        <TeaserBaseComponent
          className={styles.item}
          image={item.image}
          key={item.id}
          title={item.titleHtml}
          texts={[item.textHtml]}
          links={[item.link]}
          type='generic'
        />
      ))}
    </ul>
  </Fragment>
);

