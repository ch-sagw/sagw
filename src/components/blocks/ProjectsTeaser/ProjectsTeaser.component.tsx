import React from 'react';
import styles from '@/components/blocks/ProjectsTeaser/ProjectsTeaser.module.scss';
import {
  InterfaceProjectTeasersBlock,
  ProjectDetailPage,
} from '@/payload-types';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Section } from '@/components/base/Section/Section';

export type InterfaceProjectsTeaserPropTypes = {
  pages: ProjectDetailPage[];
} & InterfaceProjectTeasersBlock;

export const ProjectsTeaserComponent = ({
  title,
  lead,
  alignement,
  linkText,
  internalLink,
  pages,
}: InterfaceProjectsTeaserPropTypes): React.JSX.Element => (
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
