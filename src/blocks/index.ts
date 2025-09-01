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
import { TextTeasersBlock } from '@/blocks/TextTeasers';
import { AccordionBlock } from '@/blocks/Accordion';
import { NewsOverviewBlock } from '@/blocks/NewsOverview';
import { MagazineOverviewBlock } from '@/blocks/MagazineOverview';
import { PublicationsOverviewBlock } from '@/blocks/PublicationsOverview';
import { EventsOverviewBlock } from '@/blocks/EventsOverview';
import { FormBlock } from '@/blocks/Form';
import { CtaContactBlock } from '@/blocks/CtaContact';
import { CtaLinkBlock } from '@/blocks/CtaLink';
import { TitleSubtitleTextBlock } from '@/blocks/TitleSubtitleText';
import { NetworkTeasersBlock } from '@/blocks/NetworkTeasers';
import { PeopleOverviewBlock } from '@/blocks/PeopleOverview';
import { ImageTeasersBlock } from './ImageTeasers';

export const blocks = (exclude?: string[]): Block[] => {
  const availableBlocks = [
    TextBlock,
    TitleSubtitleTextBlock,
    LinksBlock,
    DownloadsBlock,
    ImageBlock,
    VideoBlock,
    AccordionBlock,
    FormBlock,
    CtaContactBlock,
    CtaLinkBlock,
    HomeTeasersBlock,
    TextTeasersBlock,
    NetworkTeasersBlock,
    ImageTeasersBlock,

    // automatic overviews
    MagazineOverviewBlock,
    PublicationsOverviewBlock,
    EventsOverviewBlock,
    PeopleOverviewBlock,
    NewsOverviewBlock,

    // automatic teasers
    EventsTeasersBlock,
    MagazineTeasersBlock,
    NewsTeasersBlock,
    PublicationsTeasersBlock,
  ];

  if (!exclude) {
    return availableBlocks;
  }

  return availableBlocks.filter((block) => !exclude.includes(block.slug));
};
