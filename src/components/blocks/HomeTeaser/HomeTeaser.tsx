import React from 'react';
import styles from '@/components/blocks/HomeTeaser/HomeTeaser.module.scss';
import { InterfaceHomeTeasersBlock } from '@/payload-types';
import { Section } from '@/components/base/Section/Section';
import { rteToHtml } from '@/utilities/rteToHtml';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getInternalLinkHref } from '@/utilities/getInternalLinkHref';

export type InterfaceHomeTeaserPropTypes = {} & InterfaceHomeTeasersBlock;

export const HomeTeaser = async ({
  homeTeasers,
}: InterfaceHomeTeaserPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;

  return (
    <div
      className={styles.teasers}
    >
      {(homeTeasers || []).map((teaser, index) => {
        const {
          category,
          title,
          text,
          // iconName,
          link,
        } = teaser;

        return (
          <Section
            key={index}
            title={category}
            colorMode='white'
            subtitle={rteToHtml(title)}
            className={styles.teaser}
            additionalContentClassName={styles.stickyContent}
            titleClassName={styles.stickyTitle}
            additionalStickyContent={
              // TODO: when moxy ready, render proper icon
              <Icon
                name='arrowRight'
                className={styles.icon}
              />
            }
          >
            <SafeHtml
              as='p'
              html={rteToHtml(text)}
              className={styles.text}
            />

            <Button
              text={rteToHtml(link.linkText)}
              colorMode='white'
              element='link'
              style='text'
              iconInlineStart={'arrowRight' as keyof typeof Icon}
              className={styles.link}
              href={getInternalLinkHref({
                internalLink: link.internalLink,
                locale,
              })}
            />
          </Section>
        );
      })}

    </div>
  );
};
