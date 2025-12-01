import React, { Fragment } from 'react';
import styles from '@/components/blocks/ProjectsTeaser/ProjectsTeaser.module.scss';
import {
  InterfaceProjectTeasersBlock,
  ProjectDetailPage,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Section } from '@/components/base/Section/Section';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';

export type InterfaceProjectsTeaserPropTypes = {
  pages: ProjectDetailPage[];
} & InterfaceProjectTeasersBlock;

export const ProjectsTeaserComponent = ({
  title,
  lead,
  alignement,
  optionalLink,
  pages,
}: InterfaceProjectsTeaserPropTypes): React.JSX.Element => (
  <Fragment>
    <Section
      className={styles.section}
      title={rteToHtml(title)}
      subtitle={rteToHtml(lead)}
      colorMode='white'
      fullBleed={alignement === 'vertical'}
    >
      {optionalLink && optionalLink.includeLink && optionalLink.link?.internalLink && optionalLink.link?.linkText &&
        <Button
          className={styles.link}
          element='link'
          style='text'
          colorMode='white'
          text={rteToHtml(optionalLink.link?.linkText)}
          iconInlineStart={'arrowRight' as keyof typeof Icon}
          isActive={true}
          prefetch={true}

          // TODO: generate proper url
          href={`${optionalLink.link?.internalLink.slug}/${optionalLink.link?.internalLink.documentId}`}
        />
      }
    </Section>

    <ul className={styles.list}>
      {pages.map((item) => (
        <GenericTeaser
          className={styles.item}
          key={item.id}
          title={rteToHtml(item.hero.title)}
          texts={[rteToHtml(item.overviewPageProps.teaserText)]}
          links={[
            {

              // TODO: generate proper url
              href: item.id,
              text: rteToHtml(item.overviewPageProps.linkText),
              type: 'internal',
            },
          ]}
          type='generic'
        />
      ))}
    </ul>
  </Fragment>
);
