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

export type InterfaceMagazineTeaserComponentPropTypes = {
  pages: MagazineDetailPage[];
  pageLanguage: Config['locale'];
} & InterfaceMagazineTeasersBlock;

const getFirstImageIdOfPage = (page: MagazineDetailPage): string => {
  if (!page.content) {
    return '';
  }
  const imageBlocks = page.content.filter((block) => block.blockType === 'imageBlock');

  if (imageBlocks.length < 1) {
    return '';
  }

  if (!imageBlocks[0].image) {
    return '';
  }

  if (typeof imageBlocks[0].image === 'object') {
    if (imageBlocks[0].image.id) {
      return imageBlocks[0].image.id;
    }
  } else {
    return imageBlocks[0].image;
  }

  return '';
};

export const MagazineTeaserComponent = ({
  title,
  lead,
  alignement,
  linkText,
  internalLink,
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
      {linkText && internalLink &&
        <Button
          className={styles.link}
          element='link'
          style='text'
          colorMode='white'
          text={rteToHtml(linkText)}
          pageLanguage={pageLanguage}
          iconInlineStart={'arrowRight' as keyof typeof Icon}
          isActive={true}

          // TODO: generate proper url
          href={`${internalLink.slug}/${internalLink.documentId}`}
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
          image={getFirstImageIdOfPage(item)}

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
