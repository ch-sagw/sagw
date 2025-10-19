import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/CtaLink/CtaLink.module.scss';
import { ColorMode } from '@/components/base/types/colorMode';
import { Section } from '@/components/base/Section/Section';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';

export type InterfaceCtaLinkPropTypes = {
  title: string;
  text: string;
  link: {
    text: string;
    href: string;
    target: '_self' | '_blank';
  };
  colorMode: ColorMode
};

const ctaLinkClasses = cva([styles.ctaLink], {
  variants: {
    colorMode: {
      dark: [styles.dark],
      light: [styles.light],
      white: undefined,
    },
  },
});

export const CtaLink = ({
  title,
  text,
  link,
  colorMode,
}: InterfaceCtaLinkPropTypes): React.JSX.Element => (
  <Section
    className={ctaLinkClasses({
      colorMode,
    })}
    title={title}
    subtitle={text}
    showTopLine={true}
    colorMode={colorMode}
  >
    <Button
      className={styles.button}
      element='link'
      text={link.text}
      href={link.href}
      target={link.target === '_blank'
        ? link.target
        : undefined}
      colorMode={colorMode}
      style='filled'
      iconInlineStart={link.target === '_self'
        ? 'arrowRight' as keyof typeof Icon
        : 'externalLink' as keyof typeof Icon
      }
    />
  </Section>
);
