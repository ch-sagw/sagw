import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Section/Section.module.scss';
import { ColorMode } from '@/components/base/types/colorMode';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';

export type InterfaceSectionPropTypes = {
  className?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  colorMode: ColorMode;
  showTopLine: boolean;
};

export const Section = ({
  className,
  title,
  subtitle,
  children,
  colorMode,
  showTopLine,
}: InterfaceSectionPropTypes): React.JSX.Element => {
  const sectionClasses = cva([
    styles.section,
    className,
  ], {
    variants: {
      colorMode: {
        dark: [styles.dark],
        light: [styles.light],
        white: undefined,
      },
    },
  });

  return (
    <section
      className={sectionClasses({
        colorMode,
      })}
    >
      <SafeHtml
        as='h2'
        className={styles.title}
        html={title}
      />

      {subtitle &&
        <SafeHtml
          as='p'
          className={styles.subtitle}
          html={subtitle}
        />
      }

      {children}

      {showTopLine &&
        <span className={styles.line} />
      }
    </section>
  );
};
