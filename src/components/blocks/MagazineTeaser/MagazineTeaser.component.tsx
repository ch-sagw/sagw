import React from 'react';
import styles from '@/components/blocks/MagazineTeaser/MagazineTeaser.module.scss';
import {
  InterfaceMagazineTeasersBlock,
  MagazineDetailPage,
} from '@/payload-types';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Section } from '@/components/base/Section/Section';

export type InterfaceMagazineTeaserComponentPropTypes = {
  pages: MagazineDetailPage[];
} & InterfaceMagazineTeasersBlock;

export const MagazineTeaserComponent = ({
  title,
  lead,
  alignement,
  linkText,
  internalLink,
  pages,
}: InterfaceMagazineTeaserComponentPropTypes): React.JSX.Element => (
  <Section
    className={styles.projectTeser}
    title={rteToHtml(title)}
    subtitle={rteToHtml(lead)}
    colorMode='white'
    fullBleed={alignement === 'vertical'}
  >

    {/* TODO */}
    <SafeHtml
      as='p'
      html={rteToHtml(linkText)}
    />

    {/* TODO: get 1st image of magazine detail page */}

    <p>{internalLink?.slug}, {internalLink?.documentId}</p>

    {pages.map((page) => (
      <SafeHtml
        key={page.id}
        as='p'
        html={rteToHtml(page.hero.title)}
      />
    ))}
  </Section>
);
