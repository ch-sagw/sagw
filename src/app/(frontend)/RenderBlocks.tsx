import 'server-only';
import React, { Fragment } from 'react';

// payload types
import {
  Config,
  I18NGlobal,
  InterfaceAccordionBlock,
  InterfaceBibliographicReferenceBlock,
  InterfaceCtaContactBlock,
  InterfaceCtaLinkBlock,
  InterfaceDownloadsBlock,
  InterfaceEventsOverviewBlock,
  InterfaceEventsTeasersBlock,
  InterfaceFootnotesBlock,
  InterfaceFormBlock,
  InterfaceGenericTeasersBlock,
  InterfaceHomeTeasersBlock,
  InterfaceImageBlock,
  InterfaceInstitutesOverviewBlock,
  InterfaceLinksBlock,
  InterfaceMagazineOverviewBlock,
  InterfaceMagazineTeasersBlock,
  InterfaceNationalDictionariesOverviewBlock,
  InterfaceNetworkTeasersBlock,
  InterfaceNewsOverviewBlock,
  InterfaceNewsTeasersBlock,
  InterfaceNotificationBlock,
  InterfacePeopleOverviewBlock,
  InterfaceProjectOverviewBlock,
  InterfaceProjectTeasersBlock,
  InterfacePublicationsOverviewBlock,
  InterfacePublicationsTeasersBlock,
  InterfaceTextBlock,
  InterfaceVideoBlock,
} from '@/payload-types';

// components
import { Notification } from '@/components/blocks/Notification/Notification';
import { Rte } from '@/components/blocks/Rte/Rte';
import { Accordion } from '@/components/blocks/Accordion/Accordion';
import { FormServer } from '@/components/blocks/Form/Form.server';
import { ImageBlock } from '@/components/blocks/Image/Image';
import { Video } from '@/components/blocks/Video/Video';
import { Links } from '@/components/blocks/Links/Links';
import { Downloads } from '@/components/blocks/Downloads/Downloads';
import { NewsOverview } from '@/components/blocks/NewsOverview/NewsOverview';
import { EventsOverview } from '@/components/blocks/EventsOverview/EventsOverview';
import { NewsTeaser } from '@/components/blocks/NewsTeaser/NewsTeaser';
import { EventsTeaser } from '@/components/blocks/EventsTeaser/EventsTeaser';
import { CtaLink } from '@/components/blocks/CtaLink/CtaLink';
import { CtaContact } from '@/components/blocks/CtaContact/CtaContact';

// blocks interface
interface InterfaceRenderBlocksProps {
  tenantId: string;
  blocks: (
    InterfaceAccordionBlock |
    InterfaceBibliographicReferenceBlock |
    InterfaceCtaContactBlock |
    InterfaceCtaLinkBlock |
    InterfaceDownloadsBlock |
    InterfaceEventsOverviewBlock |
    InterfaceEventsTeasersBlock |
    InterfaceFormBlock |
    InterfaceFootnotesBlock |
    InterfaceHomeTeasersBlock |
    InterfaceImageBlock |
    InterfaceGenericTeasersBlock |
    InterfaceInstitutesOverviewBlock |
    InterfaceLinksBlock |
    InterfaceMagazineOverviewBlock |
    InterfaceMagazineTeasersBlock |
    InterfaceNationalDictionariesOverviewBlock |
    InterfaceNetworkTeasersBlock |
    InterfaceNewsOverviewBlock |
    InterfaceNewsTeasersBlock |
    InterfaceNotificationBlock |
    InterfacePeopleOverviewBlock |
    InterfaceProjectOverviewBlock |
    InterfaceProjectTeasersBlock |
    InterfacePublicationsOverviewBlock |
    InterfacePublicationsTeasersBlock |
    InterfaceTextBlock |
    InterfaceVideoBlock
  )[] | null | undefined;
  i18n: I18NGlobal;
  pageLanguage: Config['locale'];
}

export const RenderBlocks = ({
  blocks,
  tenantId,
  i18n,
  pageLanguage,
}: InterfaceRenderBlocksProps): React.JSX.Element | null => {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const {
            blockType,
          } = block;

          if (blockType) {
            if (blockType === 'notificationBlock') {
              return (
                <div key={block.id || index}>
                  <Notification {...block} />
                </div>
              );
            }

            if (blockType === 'textBlock') {
              return (
                <div key={block.id || index}>
                  <Rte
                    {...block}
                    colorMode='white'
                    stickyFirstTitle={true}
                  />
                </div>
              );
            }

            if (blockType === 'formBlock') {
              return (
                <div key={block.id || index}>
                  <FormServer
                    globalI18n={i18n}
                    {...block}
                  />
                </div>
              );
            }

            if (blockType === 'accordionBlock') {
              return (
                <div key={block.id || index}>
                  <Accordion {...block} />
                </div>
              );
            }

            if (blockType === 'linksBlock') {
              return (
                <div key={block.id || index}>
                  <Links
                    {...block}
                    title={i18n.generic.linksTitle}
                    pageLanguage={pageLanguage}
                  />
                </div>
              );
            }

            if (blockType === 'downloadsBlock') {
              return (
                <div key={block.id || index}>
                  <Downloads
                    {...block}
                    title={i18n.generic.downloadTitle}
                    language={pageLanguage}
                  />
                </div>
              );
            }

            if (blockType === 'newsOverviewBlock') {
              return (
                <div key={block.id || index}>
                  <NewsOverview
                    {...block}
                    tenant={tenantId}
                    language={pageLanguage}
                  />
                </div>
              );
            }

            if (blockType === 'eventsOverviewBlock') {
              return (
                <div key={block.id || index}>
                  <EventsOverview
                    {...block}
                    globalI18n={i18n}
                    tenant={tenantId}
                    language={pageLanguage}
                  />
                </div>
              );
            }

            if (blockType === 'newsTeasersBlock') {
              return (
                <div key={block.id || index}>
                  <NewsTeaser
                    {...block}
                    tenant={tenantId}
                    language={pageLanguage}
                  />
                </div>
              );
            }

            if (blockType === 'eventsTeasersBlock') {
              return (
                <div key={block.id || index}>
                  <EventsTeaser
                    {...block}
                    globalI18n={i18n}
                    tenant={tenantId}
                    language={pageLanguage}
                  />
                </div>
              );
            }

            if (blockType === 'ctaLinkBlock') {
              return (
                <div key={block.id || index}>
                  <CtaLink
                    {...block}
                    language={pageLanguage}
                  />
                </div>
              );
            }

            if (blockType === 'imageBlock') {
              return (
                <div key={block.id || index}>
                  <ImageBlock
                    {...block}
                    image={(block as InterfaceImageBlock).image as any}
                    host={process.env.GUMLET_URL ?? ''}
                  />
                </div>
              );
            }

            if (blockType === 'videoBlock') {
              return (
                <div key={block.id || index}>
                  <Video
                    {...(block as any)}
                    pageLanguage={pageLanguage}
                    stillImageHost={process.env.GUMLET_URL ?? ''}
                    stillImage={(block as InterfaceVideoBlock).stillImage as any}
                  />
                </div>
              );
            }

            if (blockType === 'ctaContactBlock') {
              return (
                <div key={block.id || index}>
                  <CtaContact
                    {...block}
                    pageLanguage={pageLanguage}
                    buttonText={i18n.generic.writeEmailButtonText}
                  />
                </div>
              );
            }
          }

          return null;
        })}

      </Fragment>
    );
  }

  return null;
};
