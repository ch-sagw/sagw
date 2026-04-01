import {
  BasePayload,
  PayloadRequest,
} from 'payload';
import { linkableSlugs } from '@/collections/Pages/pages';
import { fieldParentSelectorFieldName } from '@/field-templates/parentSelector';

export const findChildPages = async (
  payload: BasePayload,
  req: PayloadRequest,
  parentDocumentId: string,
  tenantId: string | undefined,
): Promise<any[]> => {
  const availableCollections = linkableSlugs.map((item) => item.slug);

  // Find child pages in all linkable collections
  const childPagesPromises = availableCollections.map(async (collectionSlug) => {
    if (!tenantId) {
      return [];
    }

    try {
      const dbCollection = payload.db.collections[collectionSlug];

      if (!dbCollection) {
        return [];
      }

      // query using database adapter directly
      const query: Record<string, string> = {
        [`${fieldParentSelectorFieldName}.documentId`]: parentDocumentId,
        tenant: tenantId,
      };

      const docs = await dbCollection.find(query);

      // convert Mongoose documents to plain objects
      const docIds = docs.map((doc: any) => {
        const plainDoc = doc.toObject
          ? doc.toObject()
          : {
            ...doc,
          };

        return plainDoc.id || plainDoc._id?.toString();
      })
        .filter(Boolean);

      if (docIds.length === 0) {
        return [];
      }

      // fetch documents through Payload API to ensure proper processing
      const result = await payload.find({
        collection: collectionSlug,
        depth: 0,
        overrideAccess: true,
        req,
        where: {
          id: {
            in: docIds,
          },
        },
      });

      return result.docs.map((doc: any) => ({
        ...doc,
        /* eslint-disable @typescript-eslint/naming-convention */
        _collection: collectionSlug,
        /* eslint-enable @typescript-eslint/naming-convention */
      }));
    } catch {
      return [];
    }
  });

  const childPagesArrays = await Promise.all(childPagesPromises);

  return childPagesArrays.flat();
};
