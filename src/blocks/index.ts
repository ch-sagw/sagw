import { Block } from 'payload';

import { DownloadsBlock } from '@/blocks/Downloads';
import { EventsTeasersBlock } from '@/blocks/EventsTeasers';
import { HomeTeasersBlock } from '@/blocks/HomeTeasers';
import { ImageBlock } from '@/blocks/Image';
import { LinksBlock } from '@/blocks/Links';
import { MagazineTeasersBlock } from '@/blocks/MagazineTeasers';
import { NewsTeasersBlock } from '@/blocks/NewsTeasers';
import { PublicationsTeasersBlock } from '@/blocks/PublicationsTeasers';
import { TextBlock } from '@/blocks/Text';
import { VideoBlock } from '@/blocks/Video';
import { AccordionBlock } from '@/blocks/Accordion';
import { NewsOverviewBlock } from '@/blocks/NewsOverview';
import { MagazineOverviewBlock } from '@/blocks/MagazineOverview';
import { PublicationsOverviewBlock } from '@/blocks/PublicationsOverview';
import { EventsOverviewBlock } from '@/blocks/EventsOverview';
import { FormBlock } from '@/blocks/Form';
import { CtaContactBlock } from '@/blocks/CtaContact';
import { CtaLinkBlock } from '@/blocks/CtaLink';
import { NetworkTeasersBlock } from '@/blocks/NetworkTeasers';
import { PeopleOverviewBlock } from '@/blocks/PeopleOverview';
import { NotificationBlock } from './Notification';
import { BibliographicReferenceBlock } from './BibliographicReference';
import { GenericTeasersBlock } from './GenericTeasers';
import { NationalDictionariesOverviewBlock } from '@/blocks/NationalDictionariesOverview';
import { InstitutesOverviewBlock } from '@/blocks/InstitutesOverview';
import { ProjectOverviewBlock } from '@/blocks/ProjectOverview';
import { ProjectTeasersBlock } from '@/blocks/ProjectTeasers';
import { FootnotesBlock } from '@/blocks/Footnotes';

const availableBlocksConst = [
  TextBlock,
  LinksBlock,
  DownloadsBlock,
  ImageBlock,
  VideoBlock,
  AccordionBlock,
  FormBlock,
  CtaContactBlock,
  CtaLinkBlock,
  HomeTeasersBlock,
  NetworkTeasersBlock,
  GenericTeasersBlock,
  NotificationBlock,
  BibliographicReferenceBlock,
  FootnotesBlock,

  // automatic overviews
  MagazineOverviewBlock,
  PublicationsOverviewBlock,
  EventsOverviewBlock,
  PeopleOverviewBlock,
  NewsOverviewBlock,
  NationalDictionariesOverviewBlock,
  InstitutesOverviewBlock,
  ProjectOverviewBlock,

  // automatic teasers
  EventsTeasersBlock,
  MagazineTeasersBlock,
  NewsTeasersBlock,
  PublicationsTeasersBlock,
  ProjectTeasersBlock,
] as const;

export type BlockSlug = typeof availableBlocksConst[number]['slug'];

export const blocks = <T extends readonly BlockSlug[] | undefined = readonly BlockSlug[] | undefined>(
  include?: T,
): Block[] => {

  const availableBlocks: Block[] = [...availableBlocksConst];

  if (!include || include.length === 0) {
    return availableBlocks;
  }

  return availableBlocks.filter((block) => include.includes(block.slug as BlockSlug));
};
