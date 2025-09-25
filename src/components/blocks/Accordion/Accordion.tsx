'use client';

import React, { Fragment } from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Accordion/Accordion.module.scss';
import { Icon } from '@/icons';
import { Rte } from '@/components/base/Rte/Rte';
import { InterfaceAccordionBlock } from '@/payload-types';
import { useExpandOnClick } from '@/hooks/useExpandOnClick';

export type InterfaceAccordionPropTypes = {} & InterfaceAccordionBlock;

const accordionClasses = cva([styles.expandableElement], {
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

  const {
    activeElement,
    onToggleClick,
  } = useExpandOnClick();

  const mainLevel = parseInt(titleLevel, 10);
  const TitleElem: React.ElementType = `h${mainLevel}` as keyof React.JSX.IntrinsicElements;
  const HeadingElem: React.ElementType = `h${mainLevel + 1}` as keyof React.JSX.IntrinsicElements;

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

      <ul className={styles.list}>
        {accordions.map((item, key) => (
          <li
            key={key}
            className={accordionItemClasses({
              active: key === activeElement,
            })}
          >
            <Fragment>
              <HeadingElem className={styles.title}>
                <button
                  className={styles.button}
                  onClick={() => {
                    onToggleClick(key);
                  }}
                  aria-controls={`accordion-section-${key}`}
                  aria-expanded={key === activeElement}
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
                hidden={key !== activeElement}
                aria-hidden={key !== activeElement}
                inert={key !== activeElement}
                data-testid='content'
              >
                <Rte
                  className={styles.rte}
                  text={item.accordionContent.content}
                  rteConfig='rte2'
                />
              </section>
            </Fragment>

          </li>
        ))}
      </ul>
    </div>

  );
};
