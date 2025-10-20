import 'server-only';
import React, { Fragment } from 'react';

// payload types
import {
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

// helpers
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

// components
import { Notification } from '@/components/blocks/Notification/Notification';
import { Rte } from '@/components/blocks/Rte/Rte';
import { Accordion } from '@/components/blocks/Accordion/Accordion';
import { FormServer } from '@/components/blocks/Form/Form.server';
import { Links } from '@/components/blocks/Links/Links';
import { Downloads } from '@/components/blocks/Downloads/Downloads';
import { NewsOverview } from '@/components/blocks/NewsOverview/NewsOverview';
import { EventsOverview } from '@/components/blocks/EventsOverview/EventsOverview';

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
}

export const RenderBlocks = ({
  blocks,
  tenantId,
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
                    tenantId={tenantId}
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
                  <Links {...block} />
                </div>
              );
            }

            if (blockType === 'downloadsBlock') {
              return (
                <div key={block.id || index}>
                  <Downloads
                    {...block}

                    // TODO: get from global
                    title={simpleRteConfig('Downloads')}

                    // TODO: get from parent
                    language='de'
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

                    // TODO: get from parent
                    language='de'
                  />
                </div>
              );
            }

            if (blockType === 'eventsOverviewBlock') {
              return (
                <div key={block.id || index}>
                  <EventsOverview
                    {...block}
                    tenant={tenantId}

                    // TODO: get from parent
                    language='de'
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
