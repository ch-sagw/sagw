'use client';

import React from 'react';
import { Icon } from '@/icons';
import { rteToHtml } from '@/utilities/rteToHtml';
import styles from '@/components/blocks/BibliographicReference/BibliographicReference.module.scss';
import { InterfaceRte } from '@/components/base/types/rte';
import { Button } from '@/components/base/Button/Button';
import { Section } from '@/components/base/Section/Section';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';

export type InterfaceBibliographicReferenceClientPropTypes = {
  titleHtml: string;
  textHtml: string;
  buttonText: InterfaceRte;
};

export const BibliographicReferenceClient = ({
  titleHtml,
  textHtml,
  buttonText,
}: InterfaceBibliographicReferenceClientPropTypes): React.JSX.Element => {
  const handleCopy = async (): Promise<void> => {
    // Create a temporary element to extract plain text from HTML
    const tempDiv = document.createElement('div');

    tempDiv.innerHTML = textHtml;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    await navigator.clipboard.writeText(plainText);
  };

  return (
    <Section
      colorMode='white'
      className={styles.section}
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

      <Button
        element='button'
        className={styles.button}
        onClick={handleCopy}
        text={rteToHtml(buttonText)}
        colorMode='white'
        style='text'
        iconInlineStart={'copy' as keyof typeof Icon}
      />
    </Section>
  );
};
