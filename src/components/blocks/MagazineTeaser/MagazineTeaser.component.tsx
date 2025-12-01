import React, { Fragment } from 'react';
import styles from '@/components/blocks/MagazineTeaser/MagazineTeaser.module.scss';
import {
  Config,
  InterfaceMagazineTeasersBlock,
  MagazineDetailPage,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Section } from '@/components/base/Section/Section';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { getFirstImageIdOfMagazinePage } from '@/components/helpers/magazineImage';

export type InterfaceMagazineTeaserComponentPropTypes = {
  pages: MagazineDetailPage[];
  pageLanguage: Config['locale'];
} & InterfaceMagazineTeasersBlock;

export const MagazineTeaserComponent = ({
  title,
  lead,
  alignement,
  optionalLink,
  pages,
  pageLanguage,
}: InterfaceMagazineTeaserComponentPropTypes): React.JSX.Element => (
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
          pageLanguage={pageLanguage}
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
          type='magazine'
          pageLanguage={pageLanguage}
          image={getFirstImageIdOfMagazinePage(item)}

          // TODO: generate proper url
          links={[
            {
              href: `${item.slug}/${item.id}`,
              type: 'internal',
            },
          ]}
        />
      ))}
    </ul>
  </Fragment>
);
