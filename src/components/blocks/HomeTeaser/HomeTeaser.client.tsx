'use client';

import React from 'react';
import styles from '@/components/blocks/HomeTeaser/HomeTeaser.module.scss';
import { Section } from '@/components/base/Section/Section';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';

export type InterfaceHomeTeaserItem = {
  category: string;
  iconName: string;
  linkHref: string;
  linkTextHtml: string;
  textHtml: string;
  titleHtml: string;
};

export type InterfaceHomeTeaserClientPropTypes = {
  teasers: InterfaceHomeTeaserItem[];
};

export const HomeTeaserClient = ({
  teasers,
}: InterfaceHomeTeaserClientPropTypes): React.JSX.Element => (
  <div className={styles.teasers}>
    {teasers.map((teaser, index) => {

      console.log(teaser);

      return (
        <Section
          additionalContentClassName={styles.stickyContent}
          additionalStickyContent={
            <Icon
              name={teaser.iconName as keyof typeof Icon}
              className={styles.icon}
            />
          }
          className={styles.teaser}
          colorMode='white'
          key={index}
          subtitle={teaser.titleHtml}
          title={teaser.category}
          titleClassName={styles.stickyTitle}
        >
          <SafeHtml
            as='p'
            className={styles.text}
            html={teaser.textHtml}
          />

          <Button
            className={styles.link}
            colorMode='white'
            element='link'
            href={teaser.linkHref}
            iconInlineStart={'arrowRight' as keyof typeof Icon}
            style='text'
            text={teaser.linkTextHtml}
          />
        </Section>
      );

    })}
  </div>
);

