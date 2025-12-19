import 'server-only';
import React from 'react';
import styles from '@/components/blocks/Footnote/Footnote.module.scss';
import {
  type Config, InterfaceFootnotesBlock,
} from '@/payload-types';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import {
  rte3ToHtml,
  rteToHtml,
} from '@/utilities/rteToHtml';
import { Section } from '@/components/base/Section/Section';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';

export type InterfaceFootnotePropTypes = {} & InterfaceFootnotesBlock;

export const Footnote = async ({
  title,
  text,
}: InterfaceFootnotePropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayloadCached();
  const locale = (await getLocale()) as Config['locale'];
  const textHtml = await rte3ToHtml({
    content: text,
    locale,
    payload,
  });

  return (
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
        html={textHtml}
        className={styles.text}
      />

    </Section>
  );
};
