// hook to delete Links document when a page is deleted

import type { CollectionAfterDeleteHook } from 'payload';
import { singletonSlugs } from '@/collections/Pages/pages';

export const hookDeleteLinksOnPageDeletion: CollectionAfterDeleteHook = async ({
  doc,
  req,
  collection,
}) => {
  if (!doc || !req?.payload) {
    return;
  }

  const docId = doc.id;
  const collectionSlug = collection?.slug;

  if (!docId || !collectionSlug) {
    return;
  }

  // skip singletons (not stored in Links collection)
  if (singletonSlugs.some((singleton) => singleton.slug === collectionSlug)) {
    return;
  }

  try {
    const linkDoc = await req.payload.find({
      collection: 'links',
      limit: 1,
      where: {
        documentId: {
          equals: docId,
        },
      },
    });

    if (linkDoc.docs.length > 0) {
      await req.payload.delete({
        collection: 'links',
        id: linkDoc.docs[0].id,
      });
    }
  } catch (error) {
    console.error('Error deleting Links document on page deletion:', error);
  }
};

