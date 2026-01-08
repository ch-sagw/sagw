// Hook to invalidate cache when pages change
// Runs on create (for programmatically referenced detail pages)
// and update (when slug/breadcrumb changes)

import type {
  CollectionAfterChangeHook, CollectionSlug, TypedLocale,
} from 'payload';
import {
  globalCollectionsSlugs, setsSlugs, singletonSlugs,
} from '@/collections/Pages/constants';
import { extractID } from '@/utilities/extractId';
import { fieldParentSelectorFieldName } from '@/field-templates/parentSelector';
import { fieldNavigationTitleFieldName } from '@/field-templates/navigationTitle';
import { findBlocks } from '@/hooks-payload/shared/extractProgrammaticLinkIds';
import { extractAllLinkIds } from '@/hooks-payload/shared/extractAllLinkIds';
import { invalidateCache } from '@/utilities/invalidateCache';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import { linkableSlugs } from '@/collections/Pages/pages';
import {
  getParentId, hasLocalizedStringChanged,
} from '@/hooks-payload/cascadeBreadcrumbUpdates';
import type {
  InterfaceHeaderMetaNavigation, InterfaceHeaderNavigation,
} from '@/payload-types';

// module-level Set to track invalidations across hook calls
// to prevent duplicates
const invalidationCache = new Set<string>();

// Helper to invalidate pages with deduplication
const invalidatePagesWithDeduplication = async (
  pages: { id: string; collectionSlug: CollectionSlug }[],
  allLocales: TypedLocale[],
  payload: any,
): Promise<void> => {
  const invalidationPromises: Promise<void>[] = [];

  for (const page of pages) {
    for (const loc of allLocales) {
      const key = `${page.collectionSlug}:${page.id}:${loc}`;

      if (!invalidationCache.has(key)) {
        invalidationCache.add(key);
        invalidationPromises.push(invalidateCache({
          collectionSlug: page.collectionSlug,
          locale: loc,
          pageId: page.id,
          payload,
        }));
      }
    }
  }

  await Promise.all(invalidationPromises);
};

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

// Find pages that have specific programmatic blocks
const findPagesWithProgrammaticBlocks = async ({
  blockTypes,
  payload,
  tenantId,
}: {
  blockTypes: string[];
  payload: any;
  tenantId: string;
}): Promise<{ id: string; collectionSlug: CollectionSlug }[]> => {
  const pageResults: { id: string; collectionSlug: CollectionSlug }[] = [];

  // get unique collections where these blocks can be placed
  const collectionsToSearch = new Set<CollectionSlug>();

  blockTypes.forEach((blockType) => {
    const collections = BLOCK_TO_COLLECTIONS[blockType];

    if (collections) {
      collections.forEach((collection) => collectionsToSearch.add(collection));
    }
  });

  if (collectionsToSearch.size === 0) {
    return pageResults;
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
              equals: 'published',
            },
            tenant: {
              equals: tenantId,
            },
          },
        };

        const pages = await payload.find(queryOptions);

        const collectionPageResults = pages.docs
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
              ? {
                collectionSlug,
                id: pageId,
              }
              : null;
          })
          .filter((result: { id: string; collectionSlug: CollectionSlug } | null): result is { id: string; collectionSlug: CollectionSlug } => result !== null);

        return collectionPageResults;
      } catch {
        return [];
      }
    });

  const allPageResults = await Promise.all(pageIdPromises);

  return allPageResults.flat();
};

// find all child pages recursively
// returns a set of child page IDs
const findAllChildPages = async ({
  parentPageId,
  tenantId,
  payload,
}: {
  parentPageId: string;
  tenantId: string;
  payload: any;
}): Promise<Set<string>> => {
  const childPageIds = new Set<string>();
  const availableCollections = linkableSlugs.map((item) => item.slug);

  // find direct child pages
  const childPagesPromises = availableCollections.map(async (collectionSlug) => {
    try {
      const dbCollection = payload.db.collections[collectionSlug];

      if (!dbCollection) {
        return [];
      }

      // Query using database adapter directly
      const query: any = {
        [`${fieldParentSelectorFieldName}.documentId`]: parentPageId,
        tenant: tenantId,
      };

      const docs = await dbCollection.find(query);

      // Convert Mongoose documents to plain objects
      const docIds = docs.map((doc: any) => {
        const plainDoc = doc.toObject
          ? doc.toObject()
          : {
            ...doc,
          };

        return plainDoc.id || plainDoc._id?.toString();
      })
        .filter(Boolean);

      return docIds;
    } catch {
      return [];
    }
  });

  const childPagesArrays = await Promise.all(childPagesPromises);
  const directChildIds = childPagesArrays.flat()
    .filter(Boolean) as string[];

  // add direct children to the set
  directChildIds.forEach((id) => childPageIds.add(id));

  // recursively find children of children
  const grandchildPromises = directChildIds.map((childId) => findAllChildPages({
    parentPageId: childId,
    payload,
    tenantId,
  }));

  const grandchildSets = await Promise.all(grandchildPromises);

  grandchildSets.forEach((set) => {
    set.forEach((id) => childPageIds.add(id));
  });

  return childPageIds;
};

// Find pages that directly reference a changed page
// (via RTE links or internalLink fields)
const findReferencingPages = async ({
  changedPageId,
  tenantId,
  pageCollections,
  payload,
}: {
  changedPageId: string;
  tenantId: string;
  pageCollections: { slug: CollectionSlug }[];
  payload: any;
}): Promise<{ id: string; collectionSlug: CollectionSlug }[]> => {
  const referencingPages: { id: string; collectionSlug: CollectionSlug }[] = [];

  // Search all page collections in parallel
  await Promise.all(pageCollections.map(async (collectionConfig) => {
    const collectionSlug = collectionConfig.slug;
    const isSingleton = singletonSlugs.some((singleton) => singleton.slug === collectionSlug);
    const isGlobal = globalCollectionsSlugs.some((global) => global.slug === collectionSlug);

    try {
      const queryOptions: any = {
        collection: collectionSlug,
        depth: 0,
        limit: 0,
        locale: 'all',
        pagination: false,
        where: {
          tenant: {
            equals: tenantId,
          },
        },
      };

      // Add published status filter for regular pages
      if (!isSingleton && !isGlobal) {
        queryOptions.where._status = {
          equals: 'published',
        };
      }

      const pages = await payload.find(queryOptions);

      // Check each page for references to the changed page
      await Promise.all(pages.docs.map(async (page: unknown) => {
        const pageRecord = page as Record<string, unknown>;
        const pageIdRaw = pageRecord.id;

        if (!pageIdRaw) {
          return;
        }

        // Verify tenant matches
        if ('tenant' in pageRecord && pageRecord.tenant) {
          const extractedTenantId = extractID(pageRecord.tenant as any);
          const pageTenantId = typeof extractedTenantId === 'string'
            ? extractedTenantId
            : String(extractedTenantId);

          if (pageTenantId !== tenantId) {
            return;
          }
        } else {
          return;
        }

        // Verify published status for regular pages
        if (!isSingleton && !isGlobal && pageRecord._status !== 'published') {
          return;
        }

        const pageId = String(pageIdRaw);

        // Extract all link IDs from this page
        const extractionContext = {
          collectionSlug,
          currentPageId: pageId,

          // Default locale for extraction
          locale: 'de' as TypedLocale,
          payload,
          tenant: tenantId,
        };

        const linkIds = await extractAllLinkIds({
          context: extractionContext,
          doc: pageRecord,
        });

        // Check if this page references the changed page
        if (linkIds.has(changedPageId)) {
          referencingPages.push({
            collectionSlug,
            id: pageId,
          });
        }
      }));
    } catch (error) {
      console.error(`Error searching ${collectionSlug} for referencing pages:`, error);
    }
  }));

  return referencingPages;
};

// Helper to check if a page ID matches in navigation items
const checkNavItems = (navItems: any[], changedPageId: string): boolean => {
  for (const navItem of navItems) {
    if (navItem.navItemLink?.documentId === changedPageId) {
      return true;
    }
    if (navItem.subNavItems) {
      for (const subItem of navItem.subNavItems) {
        if (subItem.navItemLink?.documentId === changedPageId) {
          return true;
        }
      }
    }
  }

  return false;
};

// Helper to check if a page ID matches in meta links
const checkMetaLinks = (metaLinks: any[], changedPageId: string): boolean => {
  for (const metaLink of metaLinks) {
    if (metaLink.linkType === 'internal' && metaLink.linkInternal?.internalLink?.documentId === changedPageId) {
      return true;
    }
  }

  return false;
};

// Check if a page is referenced in consent banner or overlay
const isPageInConsent = async ({
  changedPageId,
  tenantId,
  payload,
}: {
  changedPageId: string;
  tenantId: string;
  payload: any;
}): Promise<boolean> => {
  try {
    const consents = await payload.find({
      collection: 'consent',
      depth: 0,
      locale: 'all',
      where: {
        tenant: {
          equals: tenantId,
        },
      },
    });

    // Extract link IDs from all consent documents in parallel
    const linkIdPromises = consents.docs.map((consent: unknown) => {
      const consentRecord = consent as Record<string, unknown>;

      // Extract link IDs from consent document
      const extractionContext = {
        collectionSlug: 'consent' as CollectionSlug,
        currentPageId: String(consentRecord.id),
        locale: 'de' as TypedLocale,
        payload,
        tenant: tenantId,
      };

      return extractAllLinkIds({
        context: extractionContext,
        doc: consentRecord,
      });
    });

    const linkIdSets = await Promise.all(linkIdPromises);

    // Check if any consent references the changed page
    return linkIdSets.some((linkIds) => linkIds.has(changedPageId));
  } catch (error) {
    console.error('Error checking consent banner/overlay:', error);

    return false;
  }
};

// Check if a page is referenced in header navigation
const isPageInHeaderNavigation = async ({
  changedPageId,
  tenantId,
  payload,
}: {
  changedPageId: string;
  tenantId: string;
  payload: any;
}): Promise<boolean> => {
  try {
    const headers = await payload.find({
      collection: 'header',
      depth: 0,
      locale: 'all',
      where: {
        tenant: {
          equals: tenantId,
        },
      },
    });

    for (const header of headers.docs) {
      const headerRecord = header as Record<string, unknown>;
      const navigation = headerRecord.navigation as InterfaceHeaderNavigation | undefined;
      const metanavigation = headerRecord.metanavigation as InterfaceHeaderMetaNavigation | undefined;

      if (navigation?.navItems && checkNavItems(navigation.navItems, changedPageId)) {
        return true;
      }

      if (metanavigation?.metaLinks && checkMetaLinks(metanavigation.metaLinks, changedPageId)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking header navigation:', error);

    return false;
  }
};

// Invalidate root paths when a header-linked page changes
const invalidateRootPaths = async ({
  tenantId,
  payload,
}: {
  tenantId: string;
  payload: any;
}): Promise<void> => {
  try {
    const tenant = await payload.findByID({
      collection: 'tenants',
      depth: 1,
      id: tenantId,
    });

    if (!tenant) {
      return;
    }

    const tenantName = typeof tenant.name === 'string'
      ? tenant.name
      : (tenant.name as any)?.de || tenant.name;
    const isSagw = (tenantName?.toLowerCase() || '') === 'sagw';

    const tenantSlugRecord = tenant.slug as string | Record<string, string> | undefined;
    const tenantSlug = typeof tenantSlugRecord === 'string'
      ? tenantSlugRecord
      : tenantSlugRecord?.de || null;

    const allLocales = getLocaleCodes();

    for (const locale of allLocales) {
      let rootPath: string;

      if (isSagw || !tenantSlug) {
        rootPath = `/${locale}`;
      } else {
        const localeTenantSlug = typeof tenantSlugRecord === 'string'
          ? tenantSlugRecord
          : tenantSlugRecord?.[locale] || tenantSlug;

        rootPath = localeTenantSlug
          ? `/${locale}/${localeTenantSlug}`
          : `/${locale}`;
      }

      console.log('[CACHE] invalidating path:', rootPath);
    }
  } catch (error) {
    console.error('Error invalidating root paths:', error);
  }
};

export const hookInvalidateCacheOnPageChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  collection,
  context,
  previousDoc,
}) => {
  // skip if already invalidating (prevent loops)
  if (context?.invalidatingCache) {
    return doc;
  }

  // skip cache invalidation during seed operations
  if (context?.skipCacheInvalidation) {
    return doc;
  }

  // process both create and update operations
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

  // check if this is a detail page that's programmatically referenced
  const blockTypes = DETAIL_PAGE_TO_BLOCKS[collectionSlug];
  const isProgrammaticallyReferenced = blockTypes && blockTypes.length > 0;

  // check published status
  const isSingleton = singletonSlugs.some((singleton) => singleton.slug === collectionSlug);
  const isGlobal = globalCollectionsSlugs.some((global) => global.slug === collectionSlug);
  const isPublished = isSingleton || isGlobal || doc._status === 'published';
  const wasPublished = isSingleton || isGlobal || previousDoc?._status === 'published';
  const isUnpublishing = wasPublished && !isPublished;

  // only process published pages or unpublishing
  if (!isPublished && !isUnpublishing) {
    return doc;
  }

  // extract tenant
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

  const allLocales = getLocaleCodes();

  // handle create operation
  // for programmatically referenced detail pages,
  // find pages with teaser/overview blocks
  if (operation === 'create') {
    // For create operations, we don't need to invalidate the new page itself
    // (it's not cached yet). We only invalidate pages that reference it.
    if (isProgrammaticallyReferenced) {
      const referencingPages = await findPagesWithProgrammaticBlocks({
        blockTypes,
        payload: req.payload,
        tenantId,
      });

      // invalidate cache for all locales when a new programmatically
      // referenced page is created
      await Promise.all(referencingPages.flatMap((page) => allLocales.map((loc) => invalidateCache({
        collectionSlug: page.collectionSlug,
        locale: loc,
        pageId: page.id,
        payload: req.payload,
      }))));
    }

    return doc;
  }

  // handle update operation
  if (operation === 'update' && previousDoc) {
    // Clear invalidation cache at the start of each original update
    // This ensures we deduplicate within the same update operation
    // but allow new invalidations in future operations
    if (!context?.cascadeBreadcrumbUpdate) {
      invalidationCache.clear();
    }

    // Fetch full document state after all hooks have run to get accurate
    // slug/navigationTitle/parent. This is needed because slug might be
    // updated by other hooks (e.g., from hero.title via adminTitle)
    let docToUse: any;
    const docId = doc.id;

    try {
      if (collectionSlug) {
        docToUse = await req.payload.findByID({
          collection: collectionSlug,
          depth: 0,
          id: docId,
          locale: 'all',
        });
      } else {
        docToUse = doc;
      }
    } catch (error) {
      console.error(`Error fetching full document for cache invalidation hook for docId ${docId}:`, error);
      docToUse = doc;
    }

    // check for changes that trigger breadcrumb cascade
    const oldSlug = previousDoc?.slug;
    const newSlug = docToUse?.slug;
    const oldNavigationTitle = previousDoc?.[fieldNavigationTitleFieldName];
    const newNavigationTitle = docToUse?.[fieldNavigationTitleFieldName];
    const oldParent = previousDoc?.[fieldParentSelectorFieldName];
    const newParent = docToUse?.[fieldParentSelectorFieldName];

    const slugChanged = hasLocalizedStringChanged(oldSlug, newSlug);
    const navigationTitleChanged = hasLocalizedStringChanged(oldNavigationTitle, newNavigationTitle);
    const parentChanged = getParentId(oldParent) !== getParentId(newParent);
    const willTriggerCascade = slugChanged || navigationTitleChanged || parentChanged;

    // skip invalidating referencing pages during cascade breadcrumb updates
    // the original slug/parent/navTitle change already invalidated
    // referencing pages. only skip if this is a cascade update AND only
    // breadcrumb changed (not slug/parent/navTitle)
    if (context?.cascadeBreadcrumbUpdate && !willTriggerCascade) {
      return doc;
    }

    // check if page is in header navigation or consent banner/overlay -
    // if so, invalidate root paths
    if (willTriggerCascade) {
      const isInHeaderNav = await isPageInHeaderNavigation({
        changedPageId: String(docToUse.id),
        payload: req.payload,
        tenantId,
      });

      const isInConsent = await isPageInConsent({
        changedPageId: String(docToUse.id),
        payload: req.payload,
        tenantId,
      });

      if (isInHeaderNav || isInConsent) {
        await invalidateRootPaths({
          payload: req.payload,
          tenantId,
        });
        // Skip invalidating the page itself - root paths already invalidated
        // Continue to invalidate referencing pages below
      }
    }

    // get all page collections
    const pageCollections = [
      ...singletonSlugs,
      ...setsSlugs,
      ...globalCollectionsSlugs,
    ];

    // find referencing pages (direct links)
    const referencingPages = await findReferencingPages({
      changedPageId: String(docToUse.id),
      pageCollections,
      payload: req.payload,
      tenantId,
    });

    // When a page's slug, navigationTitle, or parent changes,
    // child pages' breadcrumbs will also change via cascade
    // so we need to find pages that reference child pages too
    let childReferencingPages: { id: string; collectionSlug: CollectionSlug }[] = [];

    if (willTriggerCascade) {
      const childPageIds = await findAllChildPages({
        parentPageId: String(docToUse.id),
        payload: req.payload,
        tenantId,
      });

      // find pages that reference any child pages
      const childReferencingPagesPromises = Array.from(childPageIds)
        .map((childPageId) => findReferencingPages({
          changedPageId: childPageId,
          pageCollections,
          payload: req.payload,
          tenantId,
        }));

      const childReferencingPagesArrays = await Promise.all(childReferencingPagesPromises);

      childReferencingPages = childReferencingPagesArrays.flat();
    }

    // merge and deduplicate referencing pages
    const allReferencingPagesMap = new Map<string, { id: string; collectionSlug: CollectionSlug }>();

    referencingPages.forEach((page) => {
      allReferencingPagesMap.set(page.id, page);
    });

    childReferencingPages.forEach((page) => {
      if (!allReferencingPagesMap.has(page.id)) {
        allReferencingPagesMap.set(page.id, page);
      }
    });

    const allReferencingPages = Array.from(allReferencingPagesMap.values());

    // for programmatically referenced pages,
    // also find pages with teaser/overview blocks
    if (isProgrammaticallyReferenced) {
      const programmaticPages = await findPagesWithProgrammaticBlocks({
        blockTypes,
        payload: req.payload,
        tenantId,
      });

      // merge and deduplicate with programmatic pages
      programmaticPages.forEach((page) => {
        if (!allReferencingPagesMap.has(page.id)) {
          allReferencingPagesMap.set(page.id, page);
        }
      });

      const finalReferencingPages = Array.from(allReferencingPagesMap.values());

      // invalidate cache for all locales when parent page changes
      await invalidatePagesWithDeduplication(finalReferencingPages, allLocales, req.payload);
    } else {
      // invalidate cache for all locales when parent page changes
      await invalidatePagesWithDeduplication(allReferencingPages, allLocales, req.payload);
    }
  }

  return doc;
};
