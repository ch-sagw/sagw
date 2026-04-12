import { plcCollections } from '@/collections';
import {
  setsSlugs, singletonSlugs,
} from '@/collections/Pages/constants';
import { deleteCollectionsData } from '@/utilities/deleteCollectionsData';
import {
  CollectionSlug, Payload,
} from 'payload';

// erase all collections in db completely
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

// delete sets & pages
export const deleteSetsPages = async (): Promise<void> => {
  await deleteCollectionsData({
    collectionSlugs: setsSlugs.map((collection) => collection.slug),
  });
};

// delete collections except sets & pages
export const deleteOtherCollections = async (): Promise<void> => {

  // skip users and tenants
  const collectionsSlugs = plcCollections
    .map((collectionSlug) => collectionSlug.slug)
    .filter((collectionSlug) => collectionSlug !== 'users' && collectionSlug !== 'tenants') as any as CollectionSlug[];

  await deleteCollectionsData({
    collectionSlugs: collectionsSlugs,
  });
};

// delete singleton pages
export const deleteSingletonPages = async (): Promise<void> => {

  const collectionsSlugs = singletonSlugs
    .map((collectionSlug) => collectionSlug.slug);

  await deleteCollectionsData({
    collectionSlugs: collectionsSlugs,
  });
};
