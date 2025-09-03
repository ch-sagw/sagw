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
