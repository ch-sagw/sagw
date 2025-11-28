import React from 'react';
import styles from '@/components/blocks/BibliographicReference/BibliographicReference.module.scss';
import { InterfaceBibliographicReferenceBlock } from '@/payload-types';
import { Section } from '@/components/base/Section/Section';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import {
  rte4ToHtml, rteToHtml,
} from '@/utilities/rteToHtml';
import { InterfaceRte } from '@/components/base/types/rte';
import { BibliographicReferenceClient } from './BibliographicReference.client';

export type InterfaceBibliographicReferencePropTypes = {
  title: InterfaceRte;
  buttonText: InterfaceRte;
} & InterfaceBibliographicReferenceBlock;

export const BibliographicReference = ({
  title,
  text,
  buttonText,
}: InterfaceBibliographicReferencePropTypes): React.JSX.Element => (
  <Section
    colorMode='white'
    className={styles.section}
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

    <BibliographicReferenceClient
      buttonText={buttonText}
      text={text}
    />
  </Section>
);
