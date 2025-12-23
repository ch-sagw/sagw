// hook to manage links collection when pages change
// creates/updates Links entries but does not store URLs (computed on-read only)

import type {
  CollectionAfterChangeHook, CollectionSlug, PayloadRequest,
} from 'payload';
import { singletonSlugs } from '@/collections/Pages/constants';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';
import { extractID } from '@/utilities/extractId';

const getTenantId = async ({
  req,
  collectionSlug,
  docId,
}: {
  req: PayloadRequest;
  collectionSlug: CollectionSlug;
  docId: string;
}): Promise<string | null> => {
  let tenantId = null;
  const fullDoc = await req.payload.findByID({
    collection: collectionSlug,
    depth: 1,
    id: docId,
  });

  if ('tenant' in fullDoc) {
    const {
      tenant,
    } = fullDoc;

    if (tenant) {
      const extractedId = extractID(tenant);

      if (typeof extractedId === 'string') {
        tenantId = extractedId;
      }
    }
  }

  return tenantId;
};

export const hookManageLinksCollectionOnChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
  collection,
}) => {
  if (!doc || !req?.payload || ![
    'create',
    'update',
  ].includes(operation)) {
    return doc;
  }

  const docId = doc.id;
  const collectionSlug = collection?.slug;

  if (!docId || !collectionSlug) {
    return doc;
  }

  // Skip singletons (they're not stored in Links collection)
  if (singletonSlugs.some((singleton) => singleton.slug === collectionSlug)) {
    return doc;
  }

  const isPublished = doc._status === 'published';
  const wasPublished = previousDoc?._status === 'published';
  const isUnpublished = doc._status === 'draft' || doc._status === null;
  const isUnpublishing = wasPublished && isUnpublished;
  const isPublishing = !wasPublished && isPublished;

  const oldSlug = previousDoc?.['slug'];
  const newSlug = doc['slug'];
  const slugChanged = JSON.stringify(oldSlug) !== JSON.stringify(newSlug);

  const oldBreadcrumb = previousDoc?.[fieldBreadcrumbFieldName];
  const newBreadcrumb = doc[fieldBreadcrumbFieldName];
  const breadcrumbChanged = JSON.stringify(oldBreadcrumb) !== JSON.stringify(newBreadcrumb);

  const shouldProcess = (isPublished && (isPublishing || slugChanged || breadcrumbChanged)) || isUnpublishing;

  if (!shouldProcess) {
    return doc;
  }

  try {
    // get tenant id from the page document. needed if we need to create
    // a new Link document
    const tenantId = await getTenantId({
      collectionSlug,
      docId,
      req,
    });

    // Check if Links entry exists
    const existingLink = await req.payload.find({
      collection: 'links',
      limit: 1,
      where: {
        documentId: {
          equals: String(docId),
        },
      },
    });

    if (isUnpublishing) {
      // delete Links document when unpublished
      if (existingLink.docs.length > 0) {
        await req.payload.delete({
          collection: 'links',
          id: existingLink.docs[0].id,
        });
      }
    } else if (isPublished) {
      if (!tenantId) {
        return doc;
      }

      // Create or update Links entry
      if (existingLink.docs.length > 0) {
        const [existingLinkDoc] = existingLink.docs;
        const existingReferences = existingLinkDoc.references || [];

        await req.payload.update({
          collection: 'links',
          data: {
            // Preserve existing references (they'll be recomputed on-demand)
            references: existingReferences,
            slug: collectionSlug,
            tenant: tenantId,
          },
          id: existingLink.docs[0].id,
        });
      } else {
        await req.payload.create({
          collection: 'links',
          data: {
            documentId: docId,
            references: [],
            slug: collectionSlug,
            tenant: tenantId,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error managing Links collection:', error);
  }

  return doc;
};
