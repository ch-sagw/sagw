import React from 'react';
import styles from '@/components/blocks/HomeTeaser/HomeTeaser.module.scss';
import { InterfaceHomeTeasersBlock } from '@/payload-types';
import { Section } from '@/components/base/Section/Section';
import { rteToHtml } from '@/utilities/rteToHtml';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';

export type InterfaceHomeTeaserPropTypes = {} & InterfaceHomeTeasersBlock;

export const HomeTeaser = ({
  homeTeasers,
}: InterfaceHomeTeaserPropTypes): React.JSX.Element => {
  console.log('foo');

  return (
    <div
      className={styles.teasers}
    >
      {homeTeasers?.map((teaser, index) => {
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

              // TODO: generate valid link
              href={link.internalLink.documentId}
            />
          </Section>
        );
      })}

    </div>
  );
};
