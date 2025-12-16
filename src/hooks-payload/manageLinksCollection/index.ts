import type {
  BasePayload, CollectionAfterChangeHook, CollectionAfterDeleteHook,
} from 'payload';
import type { Config } from '@/payload-types';
import { generateAllPageUrls } from '@/hooks-payload/shared/generateAllPageUrls';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';
import { singletonSlugs } from '@/collections/Pages/pages';
import {
  getHomePageForTenant, updateLinksToHomePage,
} from '@/hooks-payload/handleLinksDeletion';
import { findDocumentInLinkableCollections } from '@/hooks-payload/shared/findDocumentInLinkableCollections';
import { getTenantFromDocument } from '@/hooks-payload/shared/getTenantFromDocument';
import { clearSystemFields } from '@/hooks-payload/shared/clearSystemFields';

type LocalizedString = Partial<Record<Config['locale'], string>>;

interface InterfaceLinkDocument {
  id: string | number;
  documentId: string;
  references?: { pageId?: string | null }[];
}

// Hook to manage Links collection when pages change
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
      const fullDoc = await req.payload.findByID({
        collection: collectionSlug,
        id: docId,
        locale: 'all',
      }) as unknown as Record<string, unknown>;

      const tenant = (fullDoc?.tenant ?? doc?.tenant ?? null) as string | null;

      if (!tenant) {
        return doc;
      }

      const urls = await generateAllPageUrls({
        page: {
          breadcrumb: (fullDoc?.[fieldBreadcrumbFieldName] || doc[fieldBreadcrumbFieldName]) as typeof doc[typeof fieldBreadcrumbFieldName],
          id: docId,
          slug: (fullDoc?.slug || doc.slug) as string | LocalizedString,
          tenant: tenant as typeof doc.tenant,
        },
        payload: req.payload,
      });

      if (existingLink.docs.length > 0) {
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
        await req.payload.create({
          collection: 'links',
          data: {
            deleted: false,
            documentId: docId,
            references: [],
            slug: collectionSlug,
            tenant: tenant as typeof doc.tenant,
            url: urls,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error managing Links collection:', error);
  }

  return doc;
};

// Updates referencing documents when a page is deleted
const updateReferencingDocuments = async (
  references: { pageId?: string | null }[],
  deletedDocumentId: string,
  payload: BasePayload,
): Promise<void> => {
  if (!Array.isArray(references) || references.length === 0) {
    return;
  }

  await Promise.all(references.map(async (ref) => {
    const {
      pageId,
    } = ref;

    if (!pageId) {
      return;
    }

    try {
      const result = await findDocumentInLinkableCollections(payload, pageId);

      if (!result) {
        return;
      }

      const tenant = getTenantFromDocument(result.document);
      const homePage = await getHomePageForTenant(payload, tenant);

      if (!homePage) {
        return;
      }

      const updateData = clearSystemFields(result.document);
      const updatedData = await updateLinksToHomePage(updateData, deletedDocumentId, homePage);

      await payload.update({
        collection: result.collection,
        context: {
          handlingLinksDeletion: true,
        },
        data: updatedData as Record<string, unknown>,
        id: pageId,
      });
    } catch (error) {
      console.error(`[hookManageLinksCollectionOnDelete] Error updating referencing document ${ref.pageId}:`, error);
    }
  }));
};

// Hook to mark page as deleted in Links collection when page is deleted
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
    const existingLink = await req.payload.find({
      collection: 'links',
      depth: 0,
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

    if (existingLink.docs.length === 0) {
      return;
    }

    const linkDoc = existingLink.docs[0] as InterfaceLinkDocument;

    // Update references first, then delete the link document
    if (linkDoc.references && linkDoc.documentId) {
      await updateReferencingDocuments(linkDoc.references, linkDoc.documentId, req.payload);
    }

    // Mark as deleted via Payload API
    try {
      await req.payload.update({
        collection: 'links',
        data: {
          deleted: true,
          url: {
            de: null,
            en: null,
            fr: null,
            it: null,
          },
        },
        depth: 0,
        id: linkDoc.id,
      });
    } catch (error) {
      console.error('[hookManageLinksCollectionOnDelete] Error marking link as deleted via Payload API:', error);
      // If update fails, try to delete the document directly
      try {
        await req.payload.delete({
          collection: 'links',
          id: String(linkDoc.id),
        });
      } catch (deleteError) {
        console.error('[hookManageLinksCollectionOnDelete] Error deleting link document:', deleteError);
      }
    }
  } catch (error) {
    console.error('[hookManageLinksCollectionOnDelete] Error handling link deletion:', error);
  }
};
