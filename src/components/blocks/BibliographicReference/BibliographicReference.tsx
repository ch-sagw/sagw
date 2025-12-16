import React from 'react';
import { getLocale } from 'next-intl/server';
import type { TypedLocale } from 'payload';
import styles from '@/components/blocks/BibliographicReference/BibliographicReference.module.scss';
import { InterfaceBibliographicReferenceBlock } from '@/payload-types';
import { Section } from '@/components/base/Section/Section';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import {
  rte3ToHtml, rteToHtml,
} from '@/utilities/rteToHtml';
import { InterfaceRte } from '@/components/base/types/rte';
import { BibliographicReferenceClient } from './BibliographicReference.client';

export type InterfaceBibliographicReferencePropTypes = {
  title: InterfaceRte;
  buttonText: InterfaceRte;
} & InterfaceBibliographicReferenceBlock;

export const BibliographicReference = async ({
  title,
  text,
  buttonText,
}: InterfaceBibliographicReferencePropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;

  return (
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
        html={rte3ToHtml(text, locale)}
        className={styles.text}
      />

      <BibliographicReferenceClient
        buttonText={buttonText}
        text={text}
      />
    </Section>
  );
};
