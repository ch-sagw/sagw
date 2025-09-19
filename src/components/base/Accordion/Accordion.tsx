import 'server-only';
import React, { useState } from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Accordion/Accordion.module.scss';
import { Icon } from '@/icons';
import {
  InterfaceRtePropTypes, Rte,
} from '@/components/base/Rte/Rte';

interface InterfaceAccordionItem {
  title: string;
  content: InterfaceRtePropTypes['text'];
}

export type InterfaceAccordionPropTypes = {
  items: InterfaceAccordionItem[];
  titleLevel: 2 | 3 | 4 | 5;
};

const accordionItemClasses = cva([styles.item], {
  variants: {
    active: {
      false: '',
      true: styles.active,
    },
  },
});

export const Accordion = ({
  items,
  titleLevel,
}: InterfaceAccordionPropTypes): React.JSX.Element => {
  const [
    activeAccordion,
    setActiveAccordion,
  ] = useState<number | undefined>(undefined);
  const HeadingElem: React.ElementType = `h${titleLevel}`;

  const onClick = (id: number): void => {
    if (id === activeAccordion) {
      setActiveAccordion(undefined);
    } else {
      setActiveAccordion(id);
    }
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, key) => (
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
            >
              <span className={styles.buttonText}>{item.title}</span>
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
          >
            <Rte
              className={styles.rte}
              text={item.content}
              rteConfig='rte2'
            />
          </section>

        </div>
      ))}
    </div>

  );
};
