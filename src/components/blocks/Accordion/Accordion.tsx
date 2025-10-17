'use client';

import React, { Fragment } from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Accordion/Accordion.module.scss';
import { Icon } from '@/icons';
import { InterfaceAccordionBlock } from '@/payload-types';
import { useExpandOnClick } from '@/hooks/useExpandOnClick';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Rte } from '@/components/blocks/Rte/Rte';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';

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
  colorMode,
}: InterfaceAccordionBlock): React.JSX.Element => {

  const {
    activeElement,
    buttonRefs,
    onToggleClick,
    toggleButtonAutofocus,
  } = useExpandOnClick();

  return (
    <div
      className={accordionClasses({
        colorMode,
      })}
      data-testid='accordion'
    >
      <SafeHtml
        as='h2'
        className={styles.heading}
        html={rteToHtml(title)}
      />

      <ul className={styles.list}>
        {accordions.map((item, key) => (
          <li
            key={key}
            className={accordionItemClasses({
              active: item.id === activeElement,
            })}
          >
            <Fragment>
              <h3 className={styles.title}>
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
                  <SafeHtml
                    as='span'
                    className={styles.buttonText}
                    html={rteToHtml(item.accordionTitle)}
                  />
                  <Icon
                    name='plus'
                    className={styles.icon}
                  />
                </button>
              </h3>

              <section
                id={`accordion-section-${key}`}
                className={styles.content}
                hidden={item.id !== activeElement}
                aria-hidden={item.id !== activeElement}
                inert={item.id !== activeElement}
                data-testid='content'
              >
                <div
                  className={styles.rte}
                >
                  <Rte
                    colorMode={colorMode}
                    stickyFirstTitle={false}
                    text={item.accordionContent}
                  />
                </div>
              </section>
            </Fragment>

          </li>
        ))}
      </ul>
    </div>

  );
};
