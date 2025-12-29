'use client';

import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/CtaLink/CtaLink.module.scss';
import { Section } from '@/components/base/Section/Section';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';

export type InterfaceCtaLinkClientPropTypes = {
  titleHtml: string;
  subtitleHtml: string;
  linkText: string;
  linkHref: string;
  linkType: 'internal' | 'external' | 'mail';
};

const ctaLinkClasses = cva([
  styles.ctaLink,
  styles.dark,
]);

export const CtaLinkClient = ({
  titleHtml,
  subtitleHtml,
  linkText,
  linkHref,
  linkType,
}: InterfaceCtaLinkClientPropTypes): React.JSX.Element => (
  <Section
    className={ctaLinkClasses()}
    title={titleHtml}
    subtitle={subtitleHtml}
    showTopLine={true}
    colorMode='dark'
  >
    <Button
      className={styles.button}
      element='link'
      text={linkText}
      href={linkHref}
      target={linkType === 'internal'
        ? undefined
        : '_blank'
      }
      colorMode='dark'
      style='filled'
      iconInlineStart={linkType === 'internal'
        ? 'arrowRight' as keyof typeof Icon
        : 'externalLink' as keyof typeof Icon
      }
      prefetch={true}
    />
  </Section>
);

