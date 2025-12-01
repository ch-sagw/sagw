import React from 'react';
import styles from '@/components/blocks/Footnote/Footnote.module.scss';
import { InterfaceFootnotesBlock } from '@/payload-types';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import {
  rte4ToHtml, rteToHtml,
} from '@/utilities/rteToHtml';
import { Section } from '@/components/base/Section/Section';

export type InterfaceFootnotePropTypes = {} & InterfaceFootnotesBlock;

export const Footnote = ({
  title,
  text,
}: InterfaceFootnotePropTypes): React.JSX.Element => (
  <Section
    className={styles.section}
    colorMode='white'
  >
    <SafeHtml
      as='h3'
      html={rteToHtml(title)}
    />

    <SafeHtml
      as='div'
      html={rte4ToHtml(text)}
      className={styles.text}
    />

  </Section>
);
