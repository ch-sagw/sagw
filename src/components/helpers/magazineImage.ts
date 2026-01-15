import {
  Image,
  MagazineDetailPage,
} from '@/payload-types';

export const getFirstImageIdOfMagazinePage = (page: MagazineDetailPage): Image | string => {
  if (!page.content) {
    return '';
  }
  const imageBlocks = page.content.filter((block) => block.blockType === 'imageBlock');

  if (imageBlocks.length < 1) {
    return '';
  }

  if (!imageBlocks[0].image) {
    return '';
  }

  if (typeof imageBlocks[0].image === 'object') {
    return imageBlocks[0].image;
  }

  return '';
};
