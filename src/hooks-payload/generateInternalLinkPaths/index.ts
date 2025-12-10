/**
 * Recursively find and process all internal link fields in a document
 * -> generate and store paths for all internal links
 */

import {
  BasePayload, CollectionBeforeValidateHook, CollectionSlug, DataFromCollectionSlug,
} from 'payload';
import { generatePagePath } from '@/utilities/generatePagePath';
import {
  extractLinkDataFromPage, InterfaceLinkExtractedPageData,
} from '@/utilities/extractLinkDataFromPage';
import { locales } from '@/i18n/locales';
import { InterfaceInternalLinkValue } from '@/payload-types';

// Generate paths for all locales for a given page data
const generatePathsForAllLocales = ({
  pageData,
}: {
  pageData: InterfaceLinkExtractedPageData;
}): Record<string, string> => {
  const pathFields: Record<string, string> = {};

  for (const locale of locales) {
    const generatedPath = generatePagePath({
      breadcrumb: pageData.breadcrumb || [],
      locale,
      pageSlug: pageData.slug,
      tenant: pageData.tenant,
    });

    if (generatedPath && generatedPath.length > 0) {
      const pathField = `path${locale}` as 'pathde' | 'pathfr' | 'pathit' | 'pathen';

      pathFields[pathField] = generatedPath;
    }
  }

  return pathFields;
};

// Fetch page data
const fetchPageData = async ({
  collectionSlug,
  documentId,
  payload,
}: {
  collectionSlug: string;
  documentId: string;
  payload: BasePayload;
}): Promise<InterfaceLinkExtractedPageData | null> => {
  try {
    // Try to find the document
    const pageData: DataFromCollectionSlug<any> = await payload.findByID({
      collection: collectionSlug as CollectionSlug,

      // depth 1 needed to get tenant details
      depth: 1,
      id: documentId,
      locale: 'all',
    });

    if (!pageData || !pageData.id) {
      console.warn(`Page not found: ${collectionSlug}/${documentId}`);

      return null;
    }

    return extractLinkDataFromPage({
      pageData,
    });
  } catch (error) {
    console.error(`Error fetching page data for ${collectionSlug}/${documentId}:`, error);

    return null;
  }
};

// Check if an object matches InterfaceInternalLinkValue structure
const isInternalLinkValue = (obj: any): obj is InterfaceInternalLinkValue => (
  obj &&
    typeof obj === 'object' &&
    typeof obj.slug === 'string' &&
    typeof obj.documentId === 'string' &&
    obj.slug.length > 0 &&
    obj.documentId.length > 0
);

// Process a single internal link value
const processInternalLink = async ({
  link,
  payload,
}: {
  link: InterfaceInternalLinkValue;
  payload: BasePayload;
}): Promise<InterfaceInternalLinkValue> => {
  // Always regenerate paths when slug and documentId are present
  // This ensures paths are updated when the link changes

  try {
    const pageData = await fetchPageData({
      collectionSlug: link.slug,
      documentId: link.documentId,
      payload,
    });

    if (!pageData) {
      console.warn(`Could not fetch page data for internal link: ${link.slug}/${link.documentId}`);

      return link;
    }

    const pathFields = generatePathsForAllLocales({
      pageData,
    });

    if (Object.keys(pathFields).length === 0) {
      console.warn(`No paths generated for internal link: ${link.slug}/${link.documentId}`);

      return link;
    }

    // Merge generated paths with existing link data
    return {
      ...link,
      ...pathFields,
    };
  } catch (error) {
    console.error(`Error processing internal link ${link.slug}/${link.documentId}:`, error);

    return link;
  }
};

// Recursively find and process all internal link values in an object
const processObjectRecursively = async ({
  obj,
  payload,
}: {
  obj: any;
  payload: BasePayload;
}): Promise<any> => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // Check if this object itself is an internal link value
  if (isInternalLinkValue(obj)) {
    /* eslint-disable no-return-await */
    return await processInternalLink({
      link: obj,
      payload,
    });
    /* eslint-enable no-return-await */
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    /* eslint-disable no-return-await */
    return await Promise.all(obj.map((item) => processObjectRecursively({
      obj: item,
      payload,
    })));
    /* eslint-enable no-return-await */
  }

  // Recursively process all properties
  const processed: Record<string, any> = {};

  for (const [
    key,
    value,
  ] of Object.entries(obj)) {
    /* eslint-disable no-await-in-loop */
    processed[key] = await processObjectRecursively({
      obj: value,
      payload,
    });
    /* eslint-enable no-await-in-loop */
  }

  return processed;
};

export const hookGenerateInternalLinkPaths: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
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

  try {
    // Clone data to avoid mutating the original
    const cloned = JSON.parse(JSON.stringify(data));

    // Process the entire document recursively
    const processed = await processObjectRecursively({
      obj: cloned,
      payload: req.payload,
    });

    return processed;
  } catch (error) {
    console.error('Error generating internal link paths:', error);
    console.error('Operation:', operation);
    console.error('Data sample:', JSON.stringify(data)
      .substring(0, 500));

    // Return original data if processing fails
    return data;
  }
};

