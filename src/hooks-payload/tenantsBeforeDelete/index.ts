import { collections } from '@/collections';
import { deleteCollectionsData } from '@/utilities/deleteCollectionsData';
import type {
  CollectionBeforeDeleteHook, CollectionSlug,
} from 'payload';

export const hookTenantsBeforeDelete: CollectionBeforeDeleteHook = async ({
  id,
}): Promise<void> => {
  if (typeof id !== 'string') {
    return;
  }

  try {
    // skip users and tenants
    const collectionsSlugs = collections
      .map((collectionSlug) => collectionSlug.slug)
      .filter((collectionSlug) => collectionSlug !== 'users' && collectionSlug !== 'tenants') as any as CollectionSlug[];

    // delete tenant related collections
    await deleteCollectionsData({
      collectionSlugs: collectionsSlugs,
      tenantId: id,
    });
  } catch (err) {
    console.error('Error deleting tenant related collections after tenant deletion.');
    console.log(err);
  }
};
