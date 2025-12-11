import { CollectionBeforeValidateHook } from 'payload';
import type { InterfaceInternalLinkValue } from '@/payload-types';
import { addLinkReference } from '@/utilities/addLinkReference';
import { singletonSlugs } from '@/collections/Pages/pages';
import { INTERNAL_LINK_MARKER_VALUE } from '@/components/admin/InternalLinkChooser/InternalLinkChooserField';

/**
 * Recursively finds all internalLink fields in a document and adds URLs
 * Returns a new object with URLs added, without mutating the input
 */
const findAndProcessInternalLinks = async (
  obj: any,
  payload: any,
  currentPageId: string,
  path: string[] = [],
): Promise<any> => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // Check if this is an internalLink object by checking for the marker field
  if (
    obj._internalLinkMarker === INTERNAL_LINK_MARKER_VALUE &&
    obj.slug &&
    obj.documentId &&
    typeof obj.slug === 'string' &&
    typeof obj.documentId === 'string'
  ) {
    const internalLink = obj as InterfaceInternalLinkValue;

    if (internalLink.documentId) {
      const isSingleton = singletonSlugs.some((singleton) => singleton.slug === internalLink.slug);

      if (!isSingleton) {
        // Fetch link document once
        const linkDoc = await payload.find({
          collection: 'links',
          limit: 1,
          where: {
            and: [
              {
                documentId: {
                  equals: internalLink.documentId,
                },
              },
            ],
          },
        });

        if (linkDoc.docs.length < 1) {
          // Link document not found, skip processing
          return obj;
        }

        const [link] = linkDoc.docs;

        // Return null if deleted
        if (link.deleted) {
          return obj;
        }

        // Extract URLs from the link document
        const urls = link.url
          ? {
            de: link.url.de || null,
            en: link.url.en || null,
            fr: link.url.fr || null,
            it: link.url.it || null,
          }
          : null;

        // Add reference to target page (pass the link document directly)
        await addLinkReference({
          linkDocument: link,
          payload,
          referencingPageId: currentPageId,
          targetPageId: internalLink.documentId,
        });

        // Return new object with URL added
        if (urls) {
          return {
            ...obj,
            url: urls,
          };
        }
      }
    }

    return obj;
  }

  // Recursively process arrays
  if (Array.isArray(obj)) {
    const processedItems = await Promise.all(obj.map((item, index) => findAndProcessInternalLinks(
      item,
      payload,
      currentPageId,
      [
        ...path,
        String(index),
      ],
    )));

    return processedItems;
  }

  // Recursively process object properties
  const processedObj: any = {
    ...obj,
  };

  await Promise.all(Object.keys(obj)
    .map(async (key) => {
      // Skip certain fields that shouldn't be processed
      if (key === 'id' || key === '_id' || key === 'createdAt' || key === 'updatedAt' || key === '_status') {
        return;
      }

      processedObj[key] = await findAndProcessInternalLinks(
        obj[key],
        payload,
        currentPageId,
        [
          ...path,
          key,
        ],
      );
    }));

  return processedObj;
};

/**
 * Hook to process InternalLinkChooser fields and add URLs from Links collection
 * Finds all internalLink fields recursively and adds URL paths
 */
export const hookGenerateInternalLinkPaths: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!data || !req?.payload) {
    return data;
  }

  if (![
    'create',
    'update',
  ].includes(operation)) {
    return data;
  }

  // Get current document ID
  const currentPageId = data.id || originalDoc?.id;

  if (!currentPageId) {
    return data;
  }

  try {
    // Recursively find and process all internalLink fields
    // Returns a new object with URLs added
    const processedData = await findAndProcessInternalLinks(
      data,
      req.payload,
      String(currentPageId),
    );

    return processedData;
  } catch (error) {
    console.error('Error generating internal link paths:', error);
    console.error('Operation:', operation);

    // Return original data if processing fails
    return data;
  }
};
