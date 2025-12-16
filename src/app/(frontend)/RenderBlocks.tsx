import 'server-only';
import React, { Fragment } from 'react';

// payload types
import {
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
import { HomeTeaser } from '@/components/blocks/HomeTeaser/HomeTeaser';
import {
  CollectionSlug, TypedLocale,
} from 'payload';
import { getLocale } from 'next-intl/server';

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
  locale: TypedLocale;
  sourcePage: InterfaceSourcePage;
}

export const RenderBlocks = async ({
  blocks,
  tenantId,
  i18n,
  sourcePage,
}: InterfaceRenderBlocksProps): Promise<React.JSX.Element | null> => {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;
  const locale = (await getLocale()) as TypedLocale;

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
                  locale={locale}
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
                  key={key}
                />
              );
            }

            if (blockType === 'downloadsBlock') {
              return (
                <Downloads
                  {...block}
                  title={i18n.generic.downloadTitle}
                  key={key}
                />
              );
            }

            if (blockType === 'newsOverviewBlock') {
              return (
                <NewsOverview
                  {...block}
                  tenant={tenantId}
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
                  key={key}
                />
              );
            }

            if (blockType === 'newsTeasersBlock') {
              return (
                <NewsTeaser
                  {...block}
                  tenant={tenantId}
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
                  key={key}
                />
              );
            }

            if (blockType === 'ctaLinkBlock') {
              return (
                <CtaLink
                  {...block}
                  key={key}
                />
              );
            }

            if (blockType === 'ctaContactBlock') {
              return (
                <CtaContact
                  {...block}
                  buttonText={i18n.generic.writeEmailButtonText}
                  key={key}
                />
              );
            }

            if (blockType === 'projectsTeasersBlock') {
              return (
                <ProjectsTeaser
                  {...block}
                  tenant={tenantId}
                  key={key}
                />
              );
            }

            if (blockType === 'magazineTeasersBlock') {
              return (
                <MagazineTeaser
                  {...block}
                  tenant={tenantId}
                  key={key}
                />
              );
            }

            if (blockType === 'genericTeasersBlock') {
              return (
                <GenericTeaser
                  {...block}
                  key={key}
                />
              );
            }

            if (blockType === 'networkTeasersBlock') {
              return (
                <NetworkTeaser
                  {...block}
                  key={key}
                />
              );
            }

            if (blockType === 'peopleOverviewBlock') {
              return (
                <PeopleOverview
                  {...block}
                  key={key}
                />
              );
            }

            if (blockType === 'institutesOverviewBlock') {
              return (
                <InstitutesOverview
                  {...block}
                  tenant={tenantId}
                  key={key}
                />
              );
            }

            if (blockType === 'magazineOverviewBlock') {
              return (
                <MagazineOverview
                  {...block}
                  tenant={tenantId}
                  key={key}
                />
              );
            }

            if (blockType === 'nationalDictionariesOverviewBlock') {
              return (
                <NationalDictionariesOverview
                  {...block}
                  tenant={tenantId}
                  key={key}
                />
              );
            }

            if (blockType === 'projectsOverviewBlock') {
              return (
                <ProjectsOverview
                  {...block}
                  tenant={tenantId}
                  key={key}
                />
              );
            }

            if (blockType === 'editionsOverview') {
              return (
                <EditionsOverview
                  {...block}
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

            if (blockType === 'imageBlock') {
              return (
                <ImageBlock
                  {...block}
                  key={key}
                />
              );
            }

            if (blockType === 'videoBlock') {
              return (
                <Video
                  {...block}
                  key={key}
                />
              );
            }

            if (blockType === 'homeTeasersBlock') {
              return (
                <HomeTeaser
                  {...block}
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
