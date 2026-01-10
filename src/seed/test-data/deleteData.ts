import { setsSlugs } from '@/collections/Pages/constants';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  CollectionSlug, Payload,
} from 'payload';

export const deleteData = async (payload: Payload): Promise<void> => {
  try {

    for await (const collection of Object.keys(payload.db.collections)) {

      // delete versions of collection
      if (Object.keys(payload.db.versions)
        .includes(collection)) {
        await payload.db.deleteVersions({
          collection: (collection as CollectionSlug),
          where: {},
        });
      }

      // delete collection
      await payload.db.deleteMany({
        collection: (collection as CollectionSlug),
        where: {},
      });
    }

  } catch (e) {
    payload.logger.error('seed test data: deletion error');
    payload.logger.error(e);
  }
};

export const deleteSetsPages = async (): Promise<void> => {
  const payload = await getPayloadCached();

  try {

    for await (const collection of setsSlugs) {

      // delete versions of collection
      if (Object.keys(payload.db.versions)
        .includes(collection.slug)) {
        await payload.db.deleteVersions({
          collection: (collection.slug as CollectionSlug),
          where: {},
        });
      }

      // delete collection
      await payload.db.deleteMany({
        collection: (collection.slug as CollectionSlug),
        where: {},
      });
    }

  } catch (e) {
    payload.logger.error('error in delete sets pages');
    payload.logger.error(e);
  }
};

export const deleteOtherCollections = async (): Promise<void> => {
  const payload = await getPayloadCached();

  console.log('clean');

  const collections = [
    'documents',
    'eventCategory',
    'forms',
    'images',
    'networkCategories',
    'people',
    'projects',
    'publicationTopics',
    'publicationTypes',
    'teams',
    'videos',
    'zenodoDocuments',
  ] as any;

  try {

    for await (const collection of collections) {

      // delete versions of collection
      if (Object.keys(payload.db.versions)
        .includes(collection)) {
        await payload.db.deleteVersions({
          collection: (collection as CollectionSlug),
          where: {},
        });
      }

      // delete collection
      await payload.db.deleteMany({
        collection: (collection as CollectionSlug),
        where: {},
      });
    }

  } catch (e) {
    payload.logger.error('error in deleting other collections');
    payload.logger.error(e);
  }
};
