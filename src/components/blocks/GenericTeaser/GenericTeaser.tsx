import React, { Fragment } from 'react';
import styles from '@/components/blocks/GenericTeaser/GenericTeaser.module.scss';
import {
  Config, InterfaceGenericTeasersBlock,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Section } from '@/components/base/Section/Section';
import { GenericTeaser as TeaserBaseComponent } from '@/components/base/GenericTeaser/GenericTeaser';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';

export type InterfaceGenericTeaserPropTypes = {
  pageLanguage: Config['locale'];
} & InterfaceGenericTeasersBlock;

export const GenericTeaser = ({
  title,
  lead,
  alignement,
  teasers,
  pageLanguage,
}: InterfaceGenericTeaserPropTypes): React.JSX.Element => (
  <Fragment>
    <Section
      className={styles.section}
      title={rteToHtml(title)}
      subtitle={rteToHtml(lead)}
      colorMode='white'
      fullBleed={alignement === 'vertical'}
    />

    <ul className={styles.list}>
      {teasers.map((item, key) => {
        let href;
        let text;

        if (item.linkType === 'external' && item.linkExternal) {
          href = item.linkExternal.externalLink;
          text = rte1ToPlaintext(item.linkExternal?.externalLinkText);
        } else if (item.linkType === 'internal' && item.linkInternal) {

          // TODO: construct internal link
          href = item.linkInternal.internalLink.documentId;
          text = rte1ToPlaintext(item.linkInternal?.linkText);
        } else if (item.linkType === 'mail' && item.linkMail) {
          href = item.linkMail?.email;
          text = rte1ToPlaintext(item.linkMail?.linkText);
        }

        if (!href || !text) {
          return undefined;
        }

        return (
          <TeaserBaseComponent
            className={styles.item}
            key={key}
            title={rteToHtml(item.title)}
            texts={[rteToHtml(item.text)]}
            links={[
              {
                href,
                text,
                type: item.linkType,
              },
            ]}
            pageLanguage={pageLanguage}
            type='generic'
          />
        );
      })}
    </ul>
  </Fragment>
);
