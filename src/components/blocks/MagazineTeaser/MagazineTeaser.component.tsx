import React, { Fragment } from 'react';
import styles from '@/components/blocks/MagazineTeaser/MagazineTeaser.module.scss';
import { InterfaceMagazineTeasersBlock } from '@/payload-types';
import { InterfaceMagazineDetailPageWithImage } from '@/components/blocks/MagazineOverview/MagazineOverview';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Section } from '@/components/base/Section/Section';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';

export type InterfaceMagazineTeaserComponentPropTypes = {
  pages: InterfaceMagazineDetailPageWithImage[];
} & InterfaceMagazineTeasersBlock;

export const MagazineTeaserComponent = ({
  title,
  lead,
  alignement,
  optionalLink,
  pages,
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
          iconInlineStart={'arrowRight' as keyof typeof Icon}
          isActive={true}
          prefetch={true}

          // TODO: generate proper url
          href={`${optionalLink.link?.internalLink.slug}/${optionalLink.link?.internalLink.documentId}`}
        />
      }
    </Section>

    <ul className={styles.list}>
      {pages.map((item) => {

        const image = typeof item.image === 'string'
          ? undefined
          : item.image;

        return (
          <GenericTeaser
            className={styles.item}
            image={image}
            key={item.id}
            title={rteToHtml(item.hero.title)}
            texts={[rteToHtml(item.overviewPageProps.teaserText)]}
            type='magazine'

            // TODO: generate proper url
            links={[
              {
                href: `${item.slug}/${item.id}`,
                type: 'internal',
              },
            ]}
          />
        );
      })}
    </ul>
  </Fragment>
);
