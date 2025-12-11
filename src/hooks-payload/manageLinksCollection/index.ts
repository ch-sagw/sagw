import {
  CollectionAfterChangeHook, CollectionAfterDeleteHook,
} from 'payload';
import type { Config } from '@/payload-types';
import { generateAllPageUrls } from '@/utilities/generateAllPageUrls';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';
import { singletonSlugs } from '@/collections/Pages/pages';

type LocalizedString = Partial<Record<Config['locale'], string>>;

/**
 * Hook to manage Links collection when pages change
 * - Detects slug changes and status changes (published/unpublished)
 * - Only processes when _status === 'published' (ignores draft saves)
 * - Generates URLs and updates Links collection
 */
export const hookManageLinksCollectionOnChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
  collection,
}) => {
  if (!doc || !req?.payload) {
    return doc;
  }

  // Only process create and update operations
  if (![
    'create',
    'update',
  ].includes(operation)) {
    return doc;
  }

  const docId = doc.id;

  if (!docId) {
    return doc;
  }

  // Get collection slug from collection parameter
  const collectionSlug = collection?.slug;

  if (!collectionSlug) {
    console.error('Could not determine collection slug for document:', docId);
    console.error('collection:', collection);

    return doc;
  }

  // Skip singletons - they should not be added to Links collection
  const isSingleton = singletonSlugs.some((singleton) => singleton.slug === collectionSlug);

  if (isSingleton) {
    return doc;
  }

  // Only process when page is published
  // Draft saves should not update URLs until published
  const isPublished = doc._status === 'published';
  const wasPublished = previousDoc?._status === 'published';
  const isUnpublished = doc._status === 'draft' || doc._status === null;
  const isUnpublishing = wasPublished && isUnpublished;
  const isPublishing = !wasPublished && isPublished;

  // Detect slug changes
  const oldSlug = previousDoc?.['slug'];
  const newSlug = doc['slug'];
  const slugChanged = JSON.stringify(oldSlug) !== JSON.stringify(newSlug);

  // Detect breadcrumb changes (affects URL path)
  const oldBreadcrumb = previousDoc?.[fieldBreadcrumbFieldName];
  const newBreadcrumb = doc[fieldBreadcrumbFieldName];
  const breadcrumbChanged = JSON.stringify(oldBreadcrumb) !== JSON.stringify(newBreadcrumb);

  // Only process if:
  // 1. Page is being published (from draft) - generate URLs
  // 2. Page is published and slug/breadcrumb changed - regenerate URLs
  // 3. Page is being unpublished - clear URLs
  const shouldProcess = (isPublished && (isPublishing || slugChanged || breadcrumbChanged)) || isUnpublishing;

  if (!shouldProcess) {
    return doc;
  }

  try {
    // Find or create link document
    const existingLink = await req.payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: docId,
            },
          },
        ],
      },
    });

    if (isUnpublishing) {
      // Clear URLs when unpublished
      if (existingLink.docs.length > 0) {
        await req.payload.update({
          collection: 'links',
          data: {
            url: {
              de: null,
              en: null,
              fr: null,
              it: null,
            },
          },
          id: existingLink.docs[0].id,
        });
      }
    } else if (isPublished) {
      // Fetch the document with all locales to get proper localized slug values
      const fullDoc = await req.payload.findByID({
        collection: collectionSlug,
        id: docId,
        locale: 'all',
      }) as any;

      // Generate URLs for all locales
      const urls = await generateAllPageUrls({
        page: {
          breadcrumb: (fullDoc?.[fieldBreadcrumbFieldName] || doc[fieldBreadcrumbFieldName]) as typeof doc[typeof fieldBreadcrumbFieldName],
          id: docId,
          slug: (fullDoc?.slug || doc.slug) as string | LocalizedString,
          tenant: (fullDoc?.tenant || doc.tenant) as typeof doc.tenant,
        },
        payload: req.payload,
      });

      if (existingLink.docs.length > 0) {
        // Update existing link
        await req.payload.update({
          collection: 'links',
          data: {
            deleted: false,
            slug: collectionSlug,
            url: urls,
          },
          id: existingLink.docs[0].id,
        });
      } else {
        // Create new link
        await req.payload.create({
          collection: 'links',
          data: {
            deleted: false,
            documentId: docId,
            references: [],
            slug: collectionSlug,
            tenant: doc.tenant,
            url: urls,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error managing Links collection:', error);
    // Don't throw - this shouldn't break the main operation
  }

  return doc;
};

/**
 * Hook to mark page as deleted in Links collection when page is deleted
 * Sets deleted: true but preserves the record (including references)
 * for cache invalidation
 */
export const hookManageLinksCollectionOnDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
  id,
}) => {
  if (!doc || !req?.payload) {
    return;
  }

  const docId = id?.toString() || doc.id?.toString();

  if (!docId) {
    return;
  }

  try {
    // Find link document
    const existingLink = await req.payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: docId,
            },
          },
        ],
      },
    });

    if (existingLink.docs.length > 0) {
      // Mark as deleted but keep the record (including references)
      await req.payload.update({
        collection: 'links',
        data: {
          deleted: true,
          // Clear URLs when deleted
          url: {
            de: null,
            en: null,
            fr: null,
            it: null,
          },
        },
        id: existingLink.docs[0].id,
      });
    }
  } catch (error) {
    console.error('Error marking link as deleted:', error);
  }
};
