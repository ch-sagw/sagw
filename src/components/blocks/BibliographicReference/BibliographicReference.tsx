import 'server-only';
import React from 'react';
import styles from '@/components/blocks/BibliographicReference/BibliographicReference.module.scss';
import {
  type Config, InterfaceBibliographicReferenceBlock,
} from '@/payload-types';
import { Section } from '@/components/base/Section/Section';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import {
  rte3ToHtml, rteToHtml,
} from '@/utilities/rteToHtml';
import { InterfaceRte } from '@/components/base/types/rte';
import { BibliographicReferenceClient } from './BibliographicReference.client';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';

export type InterfaceBibliographicReferencePropTypes = {
  title: InterfaceRte;
  buttonText: InterfaceRte;
} & InterfaceBibliographicReferenceBlock;

export const BibliographicReference = async ({
  title,
  text,
  buttonText,
}: InterfaceBibliographicReferencePropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayloadCached();
  const locale = (await getLocale()) as Config['locale'];
  const textHtml = await rte3ToHtml({
    content: text,
    locale,
    payload,
  });

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
        html={textHtml}
        className={styles.text}
      />

      <BibliographicReferenceClient
        buttonText={buttonText}
        text={text}
      />
    </Section>
  );
};
