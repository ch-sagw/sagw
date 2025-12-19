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
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getPayloadCached } from '@/utilities/getPayloadCached';

export type InterfaceProjectsTeaserPropTypes = {
  pages: ProjectDetailPage[];
} & InterfaceProjectTeasersBlock;

export const ProjectsTeaserComponent = async ({
  title,
  lead,
  alignement,
  optionalLink,
  pages,
}: InterfaceProjectsTeaserPropTypes): Promise<React.JSX.Element> => {

  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();

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

            // TODO: we need reference trackingfor the link here
            href={await getPageUrl({
              locale,
              pageId: optionalLink.link.internalLink.documentId,
              payload,
            })}
          />
        }
      </Section>

      <ul className={styles.list}>
        {pages.map(async (item) => (
          <GenericTeaser
            className={styles.item}
            key={item.id}
            title={rteToHtml(item.hero.title)}
            texts={[rteToHtml(item.overviewPageProps.teaserText)]}
            links={[
              {

                // TODO: we need reference tracking for the link here
                href: (await getPageUrl({
                  locale,
                  pageId: item.id,
                  payload,
                })),
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
};
