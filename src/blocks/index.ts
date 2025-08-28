import { Block } from 'payload';

import { DownloadsBlock } from '@/blocks/Downloads';
import { EventsTeasersBlock } from '@/blocks/EventsTeasers';
import { HomeTeasersBlock } from '@/blocks/HomeTeasers';
import { ImageBlock } from '@/blocks/Image';
import { LinksBlock } from '@/blocks/Links';
import { MagazineTeasersBlock } from '@/blocks/MagazineTeasers';
import { NewsOverviewBlock } from '@/blocks/NewsOverview';
import { NewsTeasersBlock } from '@/blocks/NewsTeasers';
import { PublicationsTeasersBlock } from '@/blocks/PublicationsTeasers';
import { TextBlock } from '@/blocks/Text';
import { VideoBlock } from '@/blocks/Video';

export const blocks = (exclude?: string[]): Block[] => {
  const availableBlocks = [
    DownloadsBlock,
    EventsTeasersBlock,
    HomeTeasersBlock,
    ImageBlock,
    LinksBlock,
    MagazineTeasersBlock,
    NewsOverviewBlock,
    NewsTeasersBlock,
    PublicationsTeasersBlock,
    TextBlock,
    VideoBlock,
  ];

  if (!exclude) {
    return availableBlocks;
  }

  return availableBlocks.filter((block) => !exclude.includes(block.slug));
};
