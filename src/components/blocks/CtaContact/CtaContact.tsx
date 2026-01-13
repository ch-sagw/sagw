import 'server-only';
import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/CtaContact/CtaContact.module.scss';
import {
  InterfaceCtaContactBlock, Person,
} from '@/payload-types';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rteToHtml } from '@/utilities/rteToHtml';
import { InterfaceRte } from '@/components/base/types/rte';
import { Button } from '@/components/base/Button/Button';
import { Section } from '@/components/base/Section/Section';
import {
  Person as SchemaPerson, WithContext,
} from 'schema-dts';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';

export type InterfaceCtaContactPropTypes = {
  buttonText: InterfaceRte;
} & InterfaceCtaContactBlock;

const ctaClasses = cva([styles.ctaContactBlock], {
  variants: {
    colorMode: {
      dark: [styles.dark],
      light: [styles.light],
      white: [styles.white],
    },
  },
});

const structuredDataForPerson = (person: Person): WithContext<SchemaPerson> | undefined => {
  if (!person.fullName) {
    return undefined;
  }

  const data: WithContext<SchemaPerson> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'email': person.mail,

    // TODO: provide image url
    'image': '',
    'jobTitle': rte1ToPlaintext(person.function),
    'name': person.fullName,
    'telephone': person.phone || undefined,
  };

  return data;
};

export const CtaContact = ({
  title,
  text,
  colorMode,
  contact,
  buttonText,
}: InterfaceCtaContactPropTypes): React.JSX.Element => {
  const typedContacts = contact.filter((item) => typeof item === 'object' && item !== null && 'mail' in item);

  const RootElem = typedContacts.length > 1
    ? 'ul'
    : 'div';

  const ChildElem = typedContacts.length > 1
    ? 'li'
    : 'div';

  return (
    <Section
      className={ctaClasses({
        colorMode,
      })}
      title={rteToHtml(title)}
      subtitle={rteToHtml(text)}
      colorMode={colorMode}
      showTopLine={true}
    >
      <RootElem
        className={styles.list}
      >
        {typedContacts.map((item: Person) => (
          <ChildElem
            key={item.id}
            className={styles.item}
          >
            <script
              type='application/ld+json'
              dangerouslySetInnerHTML={{
                /* eslint-disable @typescript-eslint/naming-convention */
                __html: JSON.stringify(structuredDataForPerson(item)),
                /* eslint-enmdisable @typescript-eslint/naming-convention */
              }}
            />
            <div className={styles.person}>
              <div className={styles.image} />
              <div className={styles.personDetails}>
                <p className={styles.name}>{item.fullName}</p>
                {item.function &&
                  <SafeHtml
                    as='p'
                    html={rteToHtml(item.function)}
                    className={styles.function}
                  />
                }
                {item.phone &&
                  <p className={styles.phone}>{item.phone}</p>
                }
              </div>
            </div>
            <Button
              text={rteToHtml(buttonText)}
              colorMode={colorMode}
              element='link'
              style='filled'
              href='mailto:'
              className={styles.button}
            />
          </ChildElem>
        ))}
      </RootElem>
    </Section>
  );
};
