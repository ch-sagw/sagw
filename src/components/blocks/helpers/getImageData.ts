import {
  getPayload,
  PaginatedDocs,
} from 'payload';
import configPromise from '@/payload.config';
import { Image } from '@/payload-types';

const payload = await getPayload({
  config: configPromise,
});

export const getImageDataForUniqueIds = async(uniqueImageIds: any[]): Promise<PaginatedDocs<Image>> => {

  // Get all imageData for passed-in ids
  const imageData = await payload.find({
    collection: 'images',
    limit: uniqueImageIds.length,
    where: {
      id: {
        in: uniqueImageIds,
      },
    },
  });

  return imageData;
};
