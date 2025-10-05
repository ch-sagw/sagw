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
    buttonRefs,
    onToggleClick,
    toggleButtonAutofocus,
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
        <Rte
          rteConfig='rte1'
          text={title}
        />
      </TitleElem>

      <ul className={styles.list}>
        {accordions.map((item, key) => (
          <li
            key={key}
            className={accordionItemClasses({
              active: item.id === activeElement,
            })}
          >
            <Fragment>
              <HeadingElem className={styles.title}>
                <button
                  ref={(el) => {
                    buttonRefs.current[item.id || String(key)] = el;
                  }}
                  className={styles.button}
                  onClick={() => {
                    onToggleClick(item.id || String(key));
                  }}
                  aria-controls={`accordion-section-${key}`}
                  aria-expanded={item.id === activeElement}
                  data-testid='button'
                  autoFocus={toggleButtonAutofocus}
                >
                  <span className={styles.buttonText}>
                    <Rte
                      rteConfig='rte1'
                      text={item.accordionTitle}
                    />
                  </span>
                  <Icon
                    name='plus'
                    className={styles.icon}
                  />
                </button>
              </HeadingElem>

              <section
                id={`accordion-section-${key}`}
                className={styles.content}
                hidden={item.id !== activeElement}
                aria-hidden={item.id !== activeElement}
                inert={item.id !== activeElement}
                data-testid='content'
              >
                <Rte
                  className={styles.rte}
                  text={item.accordionContent}
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
