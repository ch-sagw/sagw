import {
  CollectionSlug, Payload,
} from 'payload';
import { collections } from '@/collections';

export const deleteData = async (payload: Payload): Promise<void> => {
  try {
    await Promise.all(collections.map((collection) => payload.db.deleteMany({
      collection: collection.slug as CollectionSlug,
      where: {},
    })));
  } catch (e) {
    payload.logger.error('seed test data: error');
    payload.logger.error(e);
  }
};
