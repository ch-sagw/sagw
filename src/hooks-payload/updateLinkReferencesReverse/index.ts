// Reverse hook: When a detail page is created/updated, find pages with
// blocks that reference it and add those page IDs to the detail page's
// Link document references.
// Example: when an eventDetailPage is created, find pages which have
// eventTeasers and/or eventsOverview blocks and add their id's to the link
// document of the eventDetailPage.

import type {
  CollectionAfterChangeHook, CollectionSlug,
} from 'payload';
import {
  globalCollectionsSlugs, singletonSlugs,
} from '@/collections/Pages/constants';
import { extractID } from '@/utilities/extractId';
import { findBlocks } from '@/hooks-payload/shared/extractProgrammaticLinkIds';

// map detail page collections to block types that programmatically
// reference them
const DETAIL_PAGE_TO_BLOCKS: Record<string, string[]> = {
  eventDetailPage: [
    'eventsTeasersBlock',
    'eventsOverviewBlock',
  ],
  instituteDetailPage: ['institutesOverviewBlock'],
  magazineDetailPage: [
    'magazineTeasersBlock',
    'magazineOverviewBlock',
  ],
  nationalDictionaryDetailPage: ['nationalDictionariesOverviewBlock'],
  newsDetailPage: [
    'newsTeasersBlock',
    'newsOverviewBlock',
  ],
  projectDetailPage: [
    'projectsTeasersBlock',
    'projectsOverviewBlock',
  ],
  publicationDetailPage: [
    'publicationsTeasersBlock',
    'publicationsOverviewBlock',
  ],
};

// map block types to collections where they can be placed
const BLOCK_TO_COLLECTIONS: Record<string, CollectionSlug[]> = {
  eventsOverviewBlock: [
    'homePage',
    'overviewPage',
  ],
  eventsTeasersBlock: [
    'homePage',
    'overviewPage',
  ],
  institutesOverviewBlock: [
    'homePage',
    'overviewPage',
  ],
  magazineOverviewBlock: [
    'homePage',
    'overviewPage',
  ],
  magazineTeasersBlock: [
    'homePage',
    'overviewPage',
  ],
  nationalDictionariesOverviewBlock: [
    'homePage',
    'overviewPage',
  ],
  newsOverviewBlock: [
    'homePage',
    'overviewPage',
  ],
  newsTeasersBlock: [
    'homePage',
    'overviewPage',
    'newsDetailPage',
    'projectDetailPage',
  ],
  projectsOverviewBlock: [
    'homePage',
    'overviewPage',
  ],
  projectsTeasersBlock: [
    'homePage',
    'overviewPage',
  ],
  publicationsOverviewBlock: [
    'homePage',
    'overviewPage',
  ],
  publicationsTeasersBlock: [
    'homePage',
    'overviewPage',
    'publicationDetailPage',
    'projectDetailPage',
  ],
};

// find pages that have specific programmatic blocks
const findPagesWithBlocks = async ({
  blockTypes,
  payload,
  tenantId,
}: {
  blockTypes: string[];
  payload: any;
  tenantId: string;
}): Promise<string[]> => {
  const pageIds: string[] = [];

  // get unique collections where these blocks can be placed
  const collectionsToSearch = new Set<CollectionSlug>();

  blockTypes.forEach((blockType) => {
    const collections = BLOCK_TO_COLLECTIONS[blockType];

    if (collections) {
      collections.forEach((collection) => collectionsToSearch.add(collection));
    }
  });

  if (collectionsToSearch.size === 0) {
    return pageIds;
  }

  // process each collection in parallel
  const pageIdPromises = Array.from(collectionsToSearch)
    .map(async (collectionSlug) => {
      const isSingleton = singletonSlugs.some((singleton) => singleton.slug === collectionSlug);

      try {
        const queryOptions: any = {
          collection: collectionSlug,
          // need depth to read content blocks
          depth: 1,
          locale: 'all',
          where: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            _status: {
              eqals: 'published',
            },
            tenant: {
              equals: tenantId,
            },
          },
        };

        const pages = await payload.find(queryOptions);

        const collectionPageIds = pages.docs
          .map((page: unknown) => {
            const pageRecord = page as Record<string, unknown>;
            const pageIdRaw = pageRecord.id;

            if (!pageIdRaw) {
              return null;
            }

            // verify tenant matches
            if ('tenant' in pageRecord && pageRecord.tenant) {
              const extractedTenantId = extractID(pageRecord.tenant as any);
              const pageTenantId = typeof extractedTenantId === 'string'
                ? extractedTenantId
                : String(extractedTenantId);

              if (pageTenantId !== tenantId) {
                return null;
              }
            } else {
              return null;
            }

            // verify published status for regular pages
            if (!isSingleton && pageRecord._status !== 'published') {
              return null;
            }

            const pageId = String(pageIdRaw);

            // check if page has matching blocks
            const contentBlocks = pageRecord.content;

            if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) {
              return null;
            }

            const allBlocks = findBlocks(contentBlocks);

            const hasMatchingBlock = allBlocks.some((block) => {
              if (!block || typeof block !== 'object') {
                return false;
              }
              const blockRecord = block as Record<string, unknown>;
              const {
                blockType,
              } = blockRecord;

              return typeof blockType === 'string' && blockTypes.includes(blockType);
            });

            return hasMatchingBlock
              ? pageId
              : null;
          })
          .filter((pageId: string | null): pageId is string => pageId !== null);

        return collectionPageIds;
      } catch {
        return [];
      }
    });

  const allPageIds = await Promise.all(pageIdPromises);

  return allPageIds.flat();
};

export const hookUpdateLinkReferencesReverse: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
  collection,
  context,
}) => {
  if (context?.updatingLinkReferences) {
    return doc;
  }

  if (!doc || !req?.payload || ![
    'create',
    'update',
  ].includes(operation)) {
    return doc;
  }

  const collectionSlug = collection?.slug;

  if (!collectionSlug) {
    return doc;
  }

  // only process detail pages that are programmatically referenced
  const blockTypes = DETAIL_PAGE_TO_BLOCKS[collectionSlug];

  if (!blockTypes || blockTypes.length === 0) {
    return doc;
  }

  // check if this is a singleton or global (always considered published)
  const isSingleton = singletonSlugs.some((singleton) => singleton.slug === collectionSlug);
  const isGlobal = globalCollectionsSlugs.some((global) => global.slug === collectionSlug);
  const isPublished = isSingleton || isGlobal || doc._status === 'published';
  const wasPublished = isSingleton || isGlobal || previousDoc?._status === 'published';
  const isUnpublished = !isSingleton && !isGlobal && (doc._status === 'draft' || doc._status === null);
  const isUnpublishing = wasPublished && isUnpublished;

  // handle unpublishing: remove references
  if (isUnpublishing) {
    try {
      const detailPageId = String(doc.id);

      // find all pages with blocks that reference this type
      let tenantId: string | undefined;

      if ('tenant' in doc && doc.tenant) {
        const extractedId = extractID(doc.tenant);

        tenantId = typeof extractedId === 'string'
          ? extractedId
          : String(extractedId);
      }

      if (tenantId) {
        const referencingPageIds = await findPagesWithBlocks({
          blockTypes,
          payload: req.payload,
          tenantId,
        });

        // get the Link document for the detail page
        const linkDocResult = await req.payload.find({
          collection: 'links',
          limit: 1,
          where: {
            documentId: {
              equals: detailPageId,
            },
          },
        });

        if (linkDocResult.docs.length > 0) {
          const [linkDoc] = linkDocResult.docs;
          const existingReferences = (linkDoc.references || []) as { pageId?: string | null }[];

          // remove references to pages that have the blocks
          const updatedReferences = existingReferences.filter((ref) => {
            const refPageId = ref.pageId
              ? String(ref.pageId)
              : null;

            return !refPageId || !referencingPageIds.includes(refPageId);
          });

          await req.payload.update({
            collection: 'links',
            context: {
              ...context,
              updatingLinkReferences: true,
            },
            data: {
              references: updatedReferences,
            },
            id: linkDoc.id,
            req,
          });
        }
      }
    } catch (error) {
      console.error('Error removing link references on unpublish:', error);
    }

    return doc;
  }

  if (!isPublished) {
    return doc;
  }

  try {
    let tenantId: string | undefined;

    if ('tenant' in doc && doc.tenant) {
      const extractedId = extractID(doc.tenant);

      tenantId = typeof extractedId === 'string'
        ? extractedId
        : String(extractedId);
    }

    if (!tenantId) {
      return doc;
    }

    const detailPageId = String(doc.id);

    // find pages that have blocks programmatically referencing
    // this type of page
    const referencingPageIds = await findPagesWithBlocks({
      blockTypes,
      payload: req.payload,
      tenantId,
    });

    if (referencingPageIds.length === 0) {
      return doc;
    }

    // get the Link document for the detail page, create if missing
    const linkDocResult = await req.payload.find({
      collection: 'links',
      limit: 1,
      where: {
        documentId: {
          equals: detailPageId,
        },
      },
    });

    let linkDoc: { id: string; references: unknown[] };

    if (linkDocResult.docs.length === 0) {
      // link document doesn't exist, create it
      const newLinkDoc = await req.payload.create({
        collection: 'links',
        context: {
          ...context,
          updatingLinkReferences: true,
        },
        data: {
          documentId: detailPageId,
          references: [],
          slug: collectionSlug,
          tenant: tenantId,
        },
        req,
      });

      linkDoc = newLinkDoc as { id: string; references: unknown[] };
    } else {
      linkDoc = linkDocResult.docs[0] as { id: string; references: unknown[] };
    }

    const existingReferences = (linkDoc.references || []) as { pageId?: string | null }[];

    // filter out duplicates
    const existingPageIdStrings = new Set(existingReferences
      .map((ref) => ref.pageId)
      .filter((id): id is string => id !== null)
      .map((id) => String(id)));

    const newReferences = referencingPageIds
      .filter((pageId) => !existingPageIdStrings.has(pageId))
      .map((pageId) => ({
        pageId,
      }));

    if (newReferences.length > 0) {
      await req.payload.update({
        collection: 'links',
        context: {
          ...context,
          updatingLinkReferences: true,
        },
        data: {
          references: [
            ...existingReferences,
            ...newReferences,
          ],
        },
        id: linkDoc.id,
        req,
      });
    }
  } catch (error) {
    console.error('Error updating link references on programmatic page change:', error);
  }

  return doc;
};
