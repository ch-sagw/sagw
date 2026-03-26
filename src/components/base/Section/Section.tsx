import React, { forwardRef } from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Section/Section.module.scss';
import { ColorMode } from '@/components/base/types/colorMode';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';

export type InterfaceSectionPropTypes = {
  className?: string;
  additionalSubTitleClassName?: string;
  additionalContentClassName?: string;
  titleClassName?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  colorMode: ColorMode;
  showTopLine?: boolean;
  fullBleed?: boolean;
  additionalStickyContent?: React.ReactNode;
};

export const Section = forwardRef<HTMLElement, InterfaceSectionPropTypes>(({
  className,
  titleClassName,
  title,
  subtitle,
  children,
  colorMode,
  showTopLine,
  fullBleed,
  additionalStickyContent,
  additionalSubTitleClassName,
  additionalContentClassName,
}, ref) => {
  const sectionClasses = cva([
    styles.section,
    className,
  ], {
    variants: {
      colorMode: {
        dark: [styles.dark],
        light: [styles.light],
        white: [styles.white],
      },
      fullBleed: {
        false: undefined,
        true: [styles.fullBleed],
      },
      noStickyContent: {
        false: undefined,
        true: [styles.noStickyContent],
      },
      title: {
        false: [styles.noTitle],
        true: undefined,
      },
    },
  });

  return (
    <section
      ref={ref}
      className={sectionClasses({
        colorMode,
        fullBleed,
        noStickyContent: !subtitle && !title && !additionalStickyContent,
        title: title !== undefined,
      })}
    >
      {!additionalStickyContent && title &&
        <SafeHtml
          as='h2'
          className={styles.title}
          html={title}
        />
      }

      {additionalStickyContent && title &&
        <div className={`${styles.additionalStickyContent} ${additionalContentClassName}`}>
          <SafeHtml
            as='h2'
            className={`${styles.title} ${titleClassName}`}
            html={title}
          />
          {additionalStickyContent}
        </div>
      }

      {subtitle &&
        <SafeHtml
          as='p'
          className={`${styles.subtitle} ${additionalSubTitleClassName}`}
          html={subtitle}
        />
      }

      {children}

      {showTopLine &&
        <span className={styles.line} />
      }
    </section>
  );
});

Section.displayName = 'Section';
