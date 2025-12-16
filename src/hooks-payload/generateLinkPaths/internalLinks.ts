import {
  BasePayload, CollectionBeforeValidateHook,
  CollectionSlug,
} from 'payload';
import { addLinkReference } from '@/hooks-payload/shared/addLinkReference';
import {
  isInternalLinkObject, removeLinkReferencesForRemovedLinks,
} from '@/hooks-payload/shared/removeLinkReferencesForRemovedLinks';
import { singletonSlugs } from '@/collections/Pages/pages';
import type { InterfaceInternalLinkValue } from '@/payload-types';
import { generateSingletonUrls } from '@/hooks-payload/shared/generateSingletonUrls';
import { getRootPathUrls } from '@/hooks-payload/shared/getRootPathUrls';
import { SYSTEM_FIELDS } from '@/hooks-payload/shared/clearSystemFields';

// Root path URLs for each locale (fallback for deleted/missing links)
const ROOT_PATH_URLS = getRootPathUrls() as Record<string, string>;

// Recursively finds all internalLink fields in a document and adds URLs
// Returns a new object with URLs added

const findAndProcessInternalLinks = async (
  obj: any,
  payload: BasePayload,
  currentPageId: string | undefined,
  path: string[] = [],
): Promise<any> => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // Check if this is an internalLink object by checking for the marker field
  // We check the marker directly because getInternalLinkDocumentId
  // returns null for singletons
  if (isInternalLinkObject(obj)) {
    const internalLink: InterfaceInternalLinkValue = obj;
    const relationTo = internalLink.slug as CollectionSlug;
    const {
      documentId,
    } = internalLink;
    const isSingleton = relationTo && singletonSlugs.some((singleton) => singleton.slug === relationTo);

    let urls = null;

    if (isSingleton) {
      // For singletons not in Links collection, generate URLs directly
      urls = await generateSingletonUrls(
        payload,
        relationTo,
        documentId,
      );
    } else {
      // For non-singletons, try Links collection
      const linkDoc = await payload.find({
        collection: 'links',
        limit: 1,
        where: {
          and: [
            {
              documentId: {
                equals: documentId,
              },
            },
          ],
        },
      });

      if (linkDoc.docs.length > 0) {
        // Use URLs from Links collection
        const [link] = linkDoc.docs;

        if (!link.deleted && link.url) {
          urls = {
            de: link.url.de || null,
            en: link.url.en || null,
            fr: link.url.fr || null,
            it: link.url.it || null,
          };
        } else if (link.deleted) {
          // Link document is marked as deleted, use root path fallback
          urls = ROOT_PATH_URLS;
        }

        // Add reference
        if (currentPageId && !link.deleted) {
          await addLinkReference({
            linkDocument: link,
            payload,
            referencingPageId: currentPageId,
            targetPageId: documentId,
          });
        }
      } else {
        // Link document doesn't exist, use root path fallback
        urls = ROOT_PATH_URLS;
      }
    }

    if (urls) {
      return {
        ...obj,
        url: urls,
      };
    }

    return obj;
  }

  // Recursively process arrays
  if (Array.isArray(obj)) {
    const processedItems = await Promise.all(obj.map((item: any, index: number) => findAndProcessInternalLinks(
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
      if (SYSTEM_FIELDS.includes(key as typeof SYSTEM_FIELDS[number])) {
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

// Hook to process InternalLinkChooser fields and add URLs from Links collection
// Finds all internalLink fields recursively and adds URL paths
// Also removes references for links that were removed

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

  const currentPageId = data.id || originalDoc?.id;

  try {
    if (operation === 'update' && currentPageId && originalDoc) {
      await removeLinkReferencesForRemovedLinks({
        currentDoc: data,
        currentPageId: String(currentPageId),
        originalDoc,
        payload: req.payload,
      });
    }

    // Recursively find and process all internalLink fields
    // Returns a new object with URLs added
    const processedData = await findAndProcessInternalLinks(
      data,
      req.payload,
      currentPageId
        ? String(currentPageId)
        : undefined,
    );

    return processedData;
  } catch (error) {
    console.error('Error generating internal link paths:', error);
    console.error('Operation:', operation);

    return data;
  }
};

