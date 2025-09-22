'use client';

import React, { useState } from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Accordion/Accordion.module.scss';
import { Icon } from '@/icons';
import { Rte } from '@/components/base/Rte/Rte';
import { InterfaceAccordionBlock } from '@/payload-types';

export type InterfaceAccordionPropTypes = {} & InterfaceAccordionBlock;

const accordionClasses = cva([styles.accordion], {
  variants: {
    colorMode: {
      dark: styles.dark,
      light: styles.light,
      white: styles.white,
    },
  },
});

const accordionItemClasses = cva([styles.item], {
  variants: {
    active: {
      false: '',
      true: styles.active,
    },
  },
});

export const Accordion = ({
  accordions,
  title,
  titleLevel,
  colorMode,
}: InterfaceAccordionBlock): React.JSX.Element => {
  const [
    activeAccordion,
    setActiveAccordion,
  ] = useState<number | undefined>(undefined);

  const mainLevel = parseInt(titleLevel, 10);
  const TitleElem: React.ElementType = `h${mainLevel}` as keyof React.JSX.IntrinsicElements;
  const HeadingElem: React.ElementType = `h${mainLevel + 1}` as keyof React.JSX.IntrinsicElements;

  const onClick = (id: number): void => {
    if (id === activeAccordion) {
      setActiveAccordion(undefined);
    } else {
      setActiveAccordion(id);
    }
  };

  return (
    <div
      className={accordionClasses({
        colorMode,
      })}
      data-testid='accordion'
    >
      <TitleElem className={styles.heading}>
        {title}
      </TitleElem>

      {accordions.map((item, key) => (
        <div
          key={key}
          className={accordionItemClasses({
            active: key === activeAccordion,
          })}
        >
          <HeadingElem className={styles.title}>
            <button
              className={styles.button}
              onClick={() => {
                onClick(key);
              }}
              aria-controls={`accordion-section-${key}`}
              aria-expanded={key === activeAccordion}
              data-testid='button'
            >
              <span className={styles.buttonText}>{item.accordionTitle}</span>
              <Icon
                name='plus'
                className={styles.icon}
              />
            </button>
          </HeadingElem>

          <section
            id={`accordion-section-${key}`}
            className={styles.content}
            hidden={key !== activeAccordion}
            aria-hidden={key !== activeAccordion}
            inert={key !== activeAccordion}
            data-testid='content'
          >
            <Rte
              className={styles.rte}
              text={item.accordionContent.content}
              rteConfig='rte2'
            />
          </section>

        </div>
      ))}
    </div>

  );
};
