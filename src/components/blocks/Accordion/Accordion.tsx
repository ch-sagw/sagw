'use client';

import React, {
  useEffect,
  useRef,
} from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Accordion/Accordion.module.scss';
import { Icon } from '@/icons';
import { InterfaceAccordionBlock } from '@/payload-types';
import { useExpandOnClick } from '@/hooks/useExpandOnClick';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Rte } from '@/components/blocks/Rte/Rte';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { Section } from '@/components/base/Section/Section';

export type InterfaceAccordionPropTypes = InterfaceAccordionBlock;

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
    activeElement, buttonRefs, onToggleClick, toggleButtonAutofocus,
  } =
    useExpandOnClick();

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handlers: { el: HTMLElement; handler: () => void }[] = [];

    Object.entries(sectionRefs.current)
      .forEach(([
        key,
        el,
      ]) => {
        if (!el) {
          return;
        }

        if (key === activeElement) {
          el.removeAttribute('hidden');
        } else {
          el.setAttribute('hidden', 'until-found');
        }

        const handler = ():void => {
          onToggleClick(key);
          buttonRefs.current[key]?.focus();
        };

        el.addEventListener('beforematch', handler);

        handlers.push({
          el,
          handler,
        });
      });

    return ():void => {
      handlers.forEach(({
        el, handler,
      }) => {
        el.removeEventListener('beforematch', handler);
      });
    };
  }, [
    onToggleClick,
    buttonRefs,
    activeElement,
  ]);

  return (
    <Section
      className={accordionClasses({
        colorMode,
      })}
      showTopLine
      title={rteToHtml(title)}
      colorMode={colorMode}
    >
      <ul className={styles.list} data-testid='accordion'>
        {accordions.map((item, key) => {
          const refKey = item.id || String(key);

          return (
            <li
              key={refKey}
              className={accordionItemClasses({
                active: refKey === activeElement,
              })}
            >
              <h3 className={styles.title}>
                <button
                  ref={(el) => {
                    buttonRefs.current[refKey] = el;
                  }}
                  className={styles.button}
                  onClick={() => onToggleClick(refKey)}
                  aria-controls={`accordion-section-${key}`}
                  aria-expanded={refKey === activeElement}
                  data-testid='button'
                  autoFocus={refKey === activeElement && toggleButtonAutofocus}
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
                ref={(el) => {
                  sectionRefs.current[refKey] = el;
                }}
                id={`accordion-section-${key}`}
                className={styles.content}
                hidden={refKey === activeElement
                  ? undefined
                  : ('until-found' as unknown as boolean)
                }
                aria-hidden={refKey !== activeElement}
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
            </li>
          );
        })}
      </ul>
    </Section>
  );
};
