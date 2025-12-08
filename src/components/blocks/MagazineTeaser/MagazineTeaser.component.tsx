import React, { Fragment } from 'react';
import styles from '@/components/blocks/MagazineTeaser/MagazineTeaser.module.scss';
import {
  InterfaceMagazineTeasersBlock,
  MagazineDetailPage,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Section } from '@/components/base/Section/Section';
import { GenericTeaser } from '@/components/base/GenericTeaser/GenericTeaser';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { getFirstImageIdOfMagazinePage } from '@/components/helpers/magazineImage';
import { getInternalLinkPath } from '@/utilities/getInternalLinkPath';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';

export type InterfaceMagazineTeaserComponentPropTypes = {
  pages: MagazineDetailPage[];
} & InterfaceMagazineTeasersBlock;

export const MagazineTeaserComponent = async ({
  title,
  lead,
  alignement,
  optionalLink,
  pages,
}: InterfaceMagazineTeaserComponentPropTypes): Promise<React.JSX.Element> => {
  const locale = await getLocale() as TypedLocale;

  return (
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
            href={optionalLink.link?.internalLink
              ? getInternalLinkPath(optionalLink.link.internalLink, locale)
              : ''}
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
};
