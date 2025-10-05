import 'server-only';
import React, { Fragment } from 'react';
import { Notification } from '@/components/blocks/Notification/Notification';
import { Rte } from '@/components/blocks/Rte/Rte';
import { Accordion } from '@/components/blocks/Accordion/Accordion';
import { FormServer } from '@/components/blocks/Form/Form.server';
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
                  <Rte {...block} />
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
          }

          return null;
        })}

      </Fragment>
    );
  }

  return null;
};
