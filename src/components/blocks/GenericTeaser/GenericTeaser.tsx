import React from 'react';
import styles from '@/components/blocks/GenericTeaser/GenericTeaser.module.scss';
import { InterfaceGenericTeasersBlock } from '@/payload-types';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Section } from '@/components/base/Section/Section';

export type InterfaceGenericTeaserPropTypes = {} & InterfaceGenericTeasersBlock;

export const GenericTeaser = ({
  title,
  lead,
  alignement,
  teasers,
}: InterfaceGenericTeaserPropTypes): React.JSX.Element => (

  <Section
    className={styles.projectTeser}
    title={rteToHtml(title)}
    subtitle={rteToHtml(lead)}
    colorMode='white'
    fullBleed={alignement === 'vertical'}
  >

    {/* TODO */}
    {teasers.map((item, key) => (
      <div key={key}>
        <SafeHtml
          as='p'
          html={rteToHtml(item.title)}
        />

        <SafeHtml
          as='p'
          html={rteToHtml(item.text)}
        />

        <p>{item.image?.relationTo}</p>

        <p>{item.linkType}</p>

        <SafeHtml
          as='p'
          html={rteToHtml(item.linkExternal?.externalLinkText)}
        />

        <p>{item.linkExternal?.externalLink}</p>
      </div>
    ))}
  </Section>
);
