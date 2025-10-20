'use client';

import React from 'react';
import styles from '@/components/base/EventsNewsTeaser/EventsNewsTeaser.module.scss';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { ColorMode } from '@/components/base/types/colorMode';
import { Section } from '@/components/base/Section/Section';

export type InterfaceEventsNewsTeaserPropTypes = {
  children: React.ReactNode;
  title: string;
  colorMode: ColorMode;
  allLink?: {
    text: string;
    href: string;
  };
};

export const EventsNewsTeaser = (props: InterfaceEventsNewsTeaserPropTypes): React.JSX.Element => {
  const {
    title,
    colorMode,
  } = props;

  return (
    <Section
      className={styles.eventsNewsTeaser}
      showTopLine={true}
      title={title}
      colorMode={colorMode}
    >

      <ul className={styles.list}>
        {props.children}
      </ul>

      {props.allLink &&
        <Button
          style='text'
          colorMode={colorMode}
          element='link'
          href={props.allLink.href}
          className={styles.allLink}
          text={props.allLink.text}
          iconInlineStart={'arrowRight' as keyof typeof Icon}
        />
      }

    </Section>
  );
};
