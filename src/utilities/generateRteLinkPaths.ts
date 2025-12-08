import {
  BasePayload, CollectionSlug, DataFromCollectionSlug,
} from 'payload';
import { generatePagePath } from '@/utilities/generatePagePath';
import {
  extractLinkDataFromPage, InterfaceLinkExtractedPageData,
} from '@/utilities/extractLinkDataFromPage';
import { locales } from '@/i18n/locales';

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

// Process a single link node to generate and store paths
const processLinkNode = async ({
  node,
  payload,
}: {
  node: any;
  payload: BasePayload;
}): Promise<any> => {
  const {
    relationTo, value,
  } = node.fields.doc;

  if (!relationTo || !value) {
    return node;
  }

  const documentId = typeof value === 'string'
    ? value
    : value?.id || value?.documentId;

  if (!documentId || typeof documentId !== 'string') {
    return node;
  }

  try {
    const pageData = await fetchPageData({
      collectionSlug: relationTo,
      documentId,
      payload,
    });

    if (!pageData) {
      console.warn(`Could not fetch page data for RTE link: ${relationTo}/${documentId}`);

      return node;
    }

    const pathFields = generatePathsForAllLocales({
      pageData,
    });

    if (Object.keys(pathFields).length === 0) {
      console.warn(`No paths generated for RTE link: ${relationTo}/${documentId}`);

      return node;
    }

    return {
      ...node,
      fields: {
        ...node.fields,
        ...pathFields,
      },
    };
  } catch (error) {
    console.error(`Error processing RTE link ${relationTo}/${documentId}:`, error);

    return node;
  }
};

// Recursively process lexical nodes to generate&store paths for internal links
const processRteNodes = async (
  nodes: any[],
  payload: BasePayload,
): Promise<any[]> => {
  const processedNodes = await Promise.all(nodes.map(async (node) => {
    // Process link nodes
    let currentNode = node;

    if (node.type === 'link' && node.fields?.doc) {
      currentNode = await processLinkNode({
        node,
        payload,
      });
    }

    // Recursively process children
    if (currentNode.children && Array.isArray(currentNode.children)) {
      return {
        ...currentNode,
        children: await processRteNodes(currentNode.children, payload),
      };
    }

    return currentNode;
  }));

  return processedNodes;
};

// Generate and store paths for all internal links in RTE content
export const generateRteLinkPaths = async (
  rteContent: any,
  payload: BasePayload,
): Promise<any> => {
  if (!rteContent || typeof rteContent !== 'object') {
    return rteContent;
  }

  // Clone to avoid mutating original
  const cloned = JSON.parse(JSON.stringify(rteContent));

  // Process root children if they exist
  if (cloned.root && cloned.root.children && Array.isArray(cloned.root.children)) {
    cloned.root.children = await processRteNodes(cloned.root.children, payload);
  }

  return cloned;
};
