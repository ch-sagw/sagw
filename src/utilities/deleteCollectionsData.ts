import { getPayloadCached } from './getPayloadCached';
import type {
  CollectionSlug, Where,
} from 'payload';

export const deleteCollectionsData = async ({
  collectionSlugs,
  tenantId,
}: {
  collectionSlugs: CollectionSlug[];
  tenantId?: string;
}): Promise<void> => {
  const payload = await getPayloadCached();

  const docsWhere: Where =
    tenantId === undefined
      ? {}
      : {
        tenant: {
          equals: tenantId,
        },
      };
  const versionsWhere: Where =
    tenantId === undefined
      ? {}
      : {
        'version.tenant': {
          equals: tenantId,
        },
      };

  try {
    for await (const collection of collectionSlugs) {
      // delete versions of collection
      if (Object.keys(payload.db.versions)
        .includes(collection)) {
        await payload.db.deleteVersions({
          collection: (collection as CollectionSlug),
          where: versionsWhere,
        });
      }

      // delete collection
      await payload.db.deleteMany({
        collection: (collection as CollectionSlug),
        where: docsWhere,
      });
    }

  } catch (e) {
    payload.logger.error('Error deleting collections data.');
    payload.logger.error(e);
  }
};
