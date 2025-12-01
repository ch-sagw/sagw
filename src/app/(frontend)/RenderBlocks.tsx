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
  InterfaceEditionsOverviewBlock,
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
import { GenericTeaser } from '@/components/blocks/GenericTeaser/GenericTeaser';
import { MagazineTeaser } from '@/components/blocks/MagazineTeaser/MagazineTeaser';
import { ProjectsTeaser } from '@/components/blocks/ProjectsTeaser/ProjectsTeaser';
import { NetworkTeaser } from '@/components/blocks/NetworkTeaser/NetworkTeaser';
import { CtaContact } from '@/components/blocks/CtaContact/CtaContact';
import { PeopleOverview } from '@/components/blocks/PeopleOverview/PeopleOverview';
import { InstitutesOverview } from '@/components/blocks/InstitutesOverview/InstitutesOverview';
import { MagazineOverview } from '@/components/blocks/MagazineOverview/MagazineOverview';
import { NationalDictionariesOverview } from '@/components/blocks/NationalDictionariesOverview/NationalDictionariesOverview';
import { ProjectsOverview } from '@/components/blocks/ProjectsOverview/ProjectsOverview';
import { EditionsOverview } from '@/components/blocks/EditionsOverview/EditionsOverview';
import { Footnote } from '@/components/blocks/Footnote/Footnote';
import { BibliographicReference } from '@/components/blocks/BibliographicReference/BibliographicReference';
import { CollectionSlug } from 'payload';

export interface InterfaceSourcePage {
  collectionSlug: CollectionSlug;
  id: string;
}

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
    InterfaceVideoBlock |
    InterfaceEditionsOverviewBlock
  )[] | null | undefined;
  i18n: I18NGlobal;
  pageLanguage: Config['locale'];
  sourcePage: InterfaceSourcePage;
}

export const RenderBlocks = ({
  blocks,
  tenantId,
  i18n,
  pageLanguage,
  sourcePage,
}: InterfaceRenderBlocksProps): React.JSX.Element | null => {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const key = block.id || index.toString();
          const {
            blockType,
          } = block;

          if (blockType) {
            if (blockType === 'notificationBlock') {
              return (
                <Notification
                  key={key}
                  {...block}
                />
              );
            }

            if (blockType === 'textBlock') {
              return (
                <Rte
                  {...block}
                  colorMode='white'
                  stickyFirstTitle={true}
                  key={key}
                />
              );
            }

            if (blockType === 'formBlock') {
              return (
                <FormServer
                  {...block}
                  globalI18n={i18n}
                  key={key}
                />

              );
            }

            if (blockType === 'accordionBlock') {
              return (
                <Accordion
                  {...block}
                  key={key}
                />
              );
            }

            if (blockType === 'linksBlock') {
              return (
                <Links
                  {...block}
                  title={i18n.generic.linksTitle}
                  pageLanguage={pageLanguage}
                  key={key}
                />
              );
            }

            if (blockType === 'downloadsBlock') {
              return (
                <Downloads
                  {...block}
                  title={i18n.generic.downloadTitle}
                  language={pageLanguage}
                  key={key}
                />
              );
            }

            if (blockType === 'newsOverviewBlock') {
              return (
                <NewsOverview
                  {...block}
                  tenant={tenantId}
                  language={pageLanguage}
                  key={key}
                />
              );
            }

            if (blockType === 'eventsOverviewBlock') {
              return (
                <EventsOverview
                  {...block}
                  globalI18n={i18n}
                  tenant={tenantId}
                  language={pageLanguage}
                  key={key}
                />
              );
            }

            if (blockType === 'newsTeasersBlock') {
              return (
                <NewsTeaser
                  {...block}
                  tenant={tenantId}
                  language={pageLanguage}
                  sourcePage={sourcePage}
                  key={key}
                />
              );
            }

            if (blockType === 'eventsTeasersBlock') {
              return (
                <EventsTeaser
                  {...block}
                  globalI18n={i18n}
                  tenant={tenantId}
                  language={pageLanguage}
                  key={key}
                />
              );
            }

            if (blockType === 'ctaLinkBlock') {
              return (
                <CtaLink
                  {...block}
                  language={pageLanguage}
                  key={key}
                />
              );
            }

            if (blockType === 'imageBlock') {
              return (
                <div key={block.id || index}>
                  <ImageBlock
                    {...block}
                  />
                </div>
              );
            }

            if (blockType === 'videoBlock') {
              return (
                <div key={block.id || index}>
                  <Video
                    {...block}
                    pageLanguage={pageLanguage}
                  />
                </div>
              );
            }

            if (blockType === 'ctaContactBlock') {
              return (
                <CtaContact
                  {...block}
                  pageLanguage={pageLanguage}
                  buttonText={i18n.generic.writeEmailButtonText}
                  key={key}
                />
              );
            }

            if (blockType === 'projectsTeasersBlock') {
              return (
                <ProjectsTeaser
                  {...block}
                  language={pageLanguage}
                  tenant={tenantId}
                  key={key}
                />
              );
            }

            if (blockType === 'magazineTeasersBlock') {
              return (
                <MagazineTeaser
                  {...block}
                  language={pageLanguage}
                  tenant={tenantId}
                  key={key}
                />
              );
            }

            if (blockType === 'genericTeasersBlock') {
              return (
                <GenericTeaser
                  {...block}
                  pageLanguage={pageLanguage}
                  key={key}
                />
              );
            }

            if (blockType === 'networkTeasersBlock') {
              return (
                <NetworkTeaser
                  {...block}
                  pageLanguage={pageLanguage}
                  key={key}
                />
              );
            }

            if (blockType === 'peopleOverviewBlock') {
              return (
                <PeopleOverview
                  {...block}
                  language={pageLanguage}
                  key={key}
                />
              );
            }

            if (blockType === 'institutesOverviewBlock') {
              return (
                <InstitutesOverview
                  {...block}
                  language={pageLanguage}
                  tenant={tenantId}
                  key={key}
                />
              );
            }

            if (blockType === 'magazineOverviewBlock') {
              return (
                <MagazineOverview
                  {...block}
                  language={pageLanguage}
                  tenant={tenantId}
                  key={key}
                />
              );
            }

            if (blockType === 'nationalDictionariesOverviewBlock') {
              return (
                <NationalDictionariesOverview
                  {...block}
                  language={pageLanguage}
                  tenant={tenantId}
                  key={key}
                />
              );
            }

            if (blockType === 'projectsOverviewBlock') {
              return (
                <ProjectsOverview
                  {...block}
                  language={pageLanguage}
                  tenant={tenantId}
                  key={key}
                />
              );
            }

            if (blockType === 'editionsOverview') {
              return (
                <EditionsOverview
                  {...block}
                  language={pageLanguage}
                  key={key}
                />
              );
            }

            if (blockType === 'footnoteBlock') {
              return (
                <Footnote
                  {...block}
                  key={key}
                />
              );
            }

            if (blockType === 'bibliographicReferenceBlock') {
              return (
                <BibliographicReference
                  {...block}
                  title={i18n.bibliographicReference.title}
                  buttonText={i18n.bibliographicReference.copyButtonText}
                  key={key}
                />
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
