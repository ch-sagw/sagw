'use client';

import React from 'react';
import styles from '@/components/blocks/Footnote/Footnote.module.scss';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { Section } from '@/components/base/Section/Section';

export type InterfaceFootnoteClientPropTypes = {
  titleHtml: string;
  textHtml: string;
};

export const FootnoteClient = ({
  titleHtml,
  textHtml,
}: InterfaceFootnoteClientPropTypes): React.JSX.Element => (
  <Section
    className={styles.section}
    colorMode='white'
  >
    <SafeHtml
      as='h3'
      html={titleHtml}
    />

    <SafeHtml
      as='div'
      html={textHtml}
      className={styles.text}
    />
  </Section>
);

