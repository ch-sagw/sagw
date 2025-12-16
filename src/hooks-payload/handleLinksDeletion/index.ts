import type {
  BasePayload, CollectionBeforeChangeHook, PayloadRequest,
} from 'payload';
import { isInternalLinkObject } from '@/hooks-payload/shared/removeLinkReferencesForRemovedLinks';
import { findDocumentInLinkableCollections } from '@/hooks-payload/shared/findDocumentInLinkableCollections';
import { getTenantFromDocument } from '@/hooks-payload/shared/getTenantFromDocument';
import {
  clearSystemFields, SYSTEM_FIELDS,
} from '@/hooks-payload/shared/clearSystemFields';

interface InterfaceHomePage {
  id: string;
  slug: string;
}

interface InterfaceLinkReference {
  pageId?: string | null;
}

interface InterfaceLinkDocument {
  id: string | number;
  documentId: string;
  references?: InterfaceLinkReference[];
  deleted?: boolean;
}

// Helper function to get homePage for a tenant
export const getHomePageForTenant = async (
  payload: BasePayload,
  tenant: string | null | undefined,
): Promise<InterfaceHomePage | null> => {
  if (!tenant || (typeof tenant === 'string' && tenant.trim() === '')) {
    return null;
  }

  try {
    const homePages = await payload.find({
      collection: 'homePage',
      limit: 1,
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    if (homePages.docs.length > 0) {
      return {
        id: homePages.docs[0].id,
        slug: 'homePage',
      };
    }
  } catch {
    // Silently handle errors
  }

  return null;
};

// Recursively updates link fields that point to deletedDocumentId
// to point to homePage instead
export const updateLinksToHomePage = async (
  obj: unknown,
  deletedDocumentId: string,
  homePage: InterfaceHomePage,
): Promise<unknown> => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (isInternalLinkObject(obj)) {
    const internalLink = obj as { documentId: string; slug: string; [key: string]: unknown };

    if (String(internalLink.documentId) === String(deletedDocumentId)) {
      return {
        ...internalLink,
        documentId: homePage.id,
        slug: homePage.slug,
        url: undefined,
      };
    }

    return obj;
  }

  // Check if this is an RTE link node
  if (
    'type' in obj &&
    obj.type === 'link' &&
    'fields' in obj &&
    obj.fields &&
    typeof obj.fields === 'object' &&
    'doc' in obj.fields &&
    obj.fields.doc &&
    typeof obj.fields.doc === 'object' &&
    'value' in obj.fields.doc &&
    String(obj.fields.doc.value) === String(deletedDocumentId)
  ) {
    const linkNode = obj as {
      type: string;
      fields: {
        doc: { value: unknown; relationTo?: string };
        [key: string]: unknown;
      };
      children?: unknown[];
      [key: string]: unknown;
    };

    const updatedNode: typeof linkNode = {
      ...linkNode,
      fields: {
        ...linkNode.fields,
        doc: {
          ...linkNode.fields.doc,
          relationTo: homePage.slug,
          value: homePage.id,
        },
        internalUrl: undefined,
      },
    };

    if (Array.isArray(linkNode.children)) {
      updatedNode.children = await Promise.all(linkNode.children.map((child) => updateLinksToHomePage(child, deletedDocumentId, homePage)));
    }

    return updatedNode;
  }

  // Recursively process arrays
  if (Array.isArray(obj)) {
    return Promise.all(obj.map((item) => updateLinksToHomePage(item, deletedDocumentId, homePage)));
  }

  // Recursively process object properties
  const objRecord = obj as Record<string, unknown>;
  const processedObj = {
    ...objRecord,
  } as Record<string, unknown>;

  await Promise.all(Object.keys(objRecord)
    .map(async (key) => {
      if (SYSTEM_FIELDS.includes(key as typeof SYSTEM_FIELDS[number])) {
        return;
      }

      processedObj[key] = await updateLinksToHomePage(objRecord[key], deletedDocumentId, homePage);
    }));

  return processedObj;
};

// Updates a single referencing document to point to homePage
const updateReferencingDocument = async (
  pageId: string,
  deletedDocumentId: string,
  payload: BasePayload,
  req: PayloadRequest,
  context: Record<string, unknown>,
): Promise<void> => {
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
      ...context,
      handlingLinksDeletion: true,
    },
    data: updatedData as Record<string, unknown>,
    id: pageId,
  });
};

// Hook to handle Links document deletion
export const hookHandleLinksDeletion: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
  context,
}) => {
  if (!data || !req?.payload || operation !== 'update') {
    return data;
  }

  if (context?.handlingLinksDeletion) {
    return data;
  }

  const isBeingDeleted = data.deleted === true && originalDoc?.deleted !== true;

  if (!isBeingDeleted) {
    return data;
  }

  const linkDocumentId = originalDoc?.id || data.id;
  const deletedDocumentId = (originalDoc as InterfaceLinkDocument)?.documentId || (data as InterfaceLinkDocument)?.documentId;
  const references = (originalDoc as InterfaceLinkDocument)?.references || (data as InterfaceLinkDocument)?.references || [];

  if (!linkDocumentId || !deletedDocumentId) {
    return data;
  }

  try {
    await req.payload.delete({
      collection: 'links',
      context: {
        ...context,
        handlingLinksDeletion: true,
      },
      id: String(linkDocumentId),
    });

    if (Array.isArray(references) && references.length > 0) {
      await Promise.all(references.map(async (ref) => {
        const {
          pageId,
        } = ref;

        if (!pageId) {
          return;
        }

        try {
          await updateReferencingDocument(pageId, deletedDocumentId, req.payload, req, context || {});
        } catch (error) {
          console.error(`Error updating referencing document ${pageId}:`, error);
        }
      }));
    }
  } catch (error) {
    console.error('Error handling Links deletion:', error);
  }

  return {
    ...data,
    deleted: false,
  };
};
