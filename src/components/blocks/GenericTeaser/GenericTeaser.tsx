import 'server-only';
import React, { Fragment } from 'react';
import styles from '@/components/blocks/GenericTeaser/GenericTeaser.module.scss';
import { InterfaceGenericTeasersBlock } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Section } from '@/components/base/Section/Section';
import { GenericTeaser as TeaserBaseComponent } from '@/components/base/GenericTeaser/GenericTeaser';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';

export type InterfaceGenericTeaserPropTypes = {} & InterfaceGenericTeasersBlock;

export const GenericTeaser = async ({
  title,
  lead,
  alignement,
  teasers,
}: InterfaceGenericTeaserPropTypes): Promise<React.JSX.Element> => {
  const locale = await getLocale() as TypedLocale;

  return (
    <Fragment>
      <Section
        className={styles.section}
        title={rteToHtml(title)}
        subtitle={rteToHtml(lead)}
        colorMode='white'
        fullBleed={alignement === 'vertical'}
      />

      <ul className={styles.list}>
        {teasers.map(async (item) => {
          let href;
          let text;

          if (item.linkType === 'external' && item.linkExternal) {
            href = item.linkExternal.externalLink;
            text = rte1ToPlaintext(item.linkExternal?.externalLinkText);
          } else if (item.linkType === 'internal' && item.linkInternal) {

            // TODO: we need reference tracking here
            href = (await getPageUrl({
              locale,
              pageId: item.linkInternal.internalLink.documentId,
              payload: (await getPayloadCached()),
            }));

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
              key={item.id}
              title={rteToHtml(item.title)}
              texts={[rteToHtml(item.text)]}
              links={[
                {
                  href,
                  text,
                  type: item.linkType,
                },
              ]}
              type='generic'
            />
          );
        })}
      </ul>
    </Fragment>
  );
};
