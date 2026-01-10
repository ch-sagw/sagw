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
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';
import { findBlocks } from '@/hooks-payload/shared/extractProgrammaticLinkIds';
import { extractAllLinkIds } from '@/hooks-payload/shared/extractAllLinkIds';
import { invalidateCache } from '@/utilities/invalidateCache';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import { linkableSlugs } from '@/collections/Pages/pages';
import { revalidatePath } from 'next/cache.js';
import {
  getParentId, hasLocalizedStringChanged,
} from '@/hooks-payload/cascadeBreadcrumbUpdates';
import type {
  InterfaceHeaderMetaNavigation, InterfaceHeaderNavigation,
} from '@/payload-types';

// module-level Set to track invalidations across hook calls
// to prevent duplicates
const invalidationCache = new Set<string>();

// module-level Set to track root path invalidations across hook calls
// This persists even when invalidationCache is cleared for cascade updates
const rootPathInvalidationCache = new Set<string>();

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

// helper to check if content has changed
// compares content arrays to detect blocks added/removed/reordered/changed
const hasContentChanged = (
  oldContent: unknown,
  newContent: unknown,
): boolean => {
  // both undefined/null - no change
  if (!oldContent && !newContent) {
    return false;
  }

  // one is undefined/null, other is not - changed
  if (!oldContent || !newContent) {
    return true;
  }

  // both should be arrays
  if (!Array.isArray(oldContent) || !Array.isArray(newContent)) {
    return false;
  }

  // different lengths - changed
  if (oldContent.length !== newContent.length) {
    return true;
  }

  // compare serialized arrays to detect any changes
  // this catches additions, removals, reordering, and content changes
  try {
    const oldSerialized = JSON.stringify(oldContent);
    const newSerialized = JSON.stringify(newContent);

    return oldSerialized !== newSerialized;
  } catch {
    // if serialization fails, assume changed to be safe
    return true;
  }
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
    const linkIdPromises = consents.docs.map(async (consent: unknown) => {
      const consentRecord = consent as Record<string, unknown>;

      // Extract link IDs from consent document
      // NOTE: Since RTE fields are localized, when fetched with locale: 'all',
      // they're structured as { de: { root: {...} }, it: { root: {...} } }
      // We need to extract from each locale's RTE content
      const extractionContext = {
        collectionSlug: 'consent' as CollectionSlug,
        currentPageId: String(consentRecord.id),
        locale: 'de' as TypedLocale,
        payload,
        tenant: tenantId,
      };

      // extract links from the full document
      const linkIds = await extractAllLinkIds({
        context: extractionContext,
        doc: consentRecord,
      });

      // extract links from localized RTE fields
      // when fetched with locale: 'all', RTE fields are structured as
      // { de: { root: {...} }, it: { root: {...} } }
      // We need to extract from each locale's RTE content
      const extractFromLocalizedRte = async (rteField: Record<string, unknown> | undefined): Promise<void> => {
        if (rteField && typeof rteField === 'object') {
          const extractionPromises: Promise<Set<string>>[] = [];

          for (const [, rteContent] of Object.entries(rteField)) {
            if (rteContent && typeof rteContent === 'object' && 'root' in rteContent) {
              const rteContentRecord = rteContent as Record<string, unknown>;

              extractionPromises.push(extractAllLinkIds({
                context: extractionContext,
                doc: rteContentRecord,
              }));
            }
          }

          const localeLinkIdSets = await Promise.all(extractionPromises);

          localeLinkIdSets.forEach((localeLinkIds) => {
            localeLinkIds.forEach((id) => linkIds.add(id));
          });
        }
      };

      const banner = consentRecord.banner as Record<string, unknown> | undefined;
      const overlay = consentRecord.overlay as Record<string, unknown> | undefined;

      // Extract from banner.text
      await extractFromLocalizedRte(banner?.text as Record<string, unknown> | undefined);

      // Extract from overlay fields
      if (overlay) {
        const analyticsPerformance = overlay.analyticsPerformance as Record<string, unknown> | undefined;
        const externalContent = overlay.externalContent as Record<string, unknown> | undefined;
        const necessaryCookies = overlay.necessaryCookies as Record<string, unknown> | undefined;

        await extractFromLocalizedRte(analyticsPerformance?.text as Record<string, unknown> | undefined);
        await extractFromLocalizedRte(externalContent?.text as Record<string, unknown> | undefined);
        await extractFromLocalizedRte(necessaryCookies?.text as Record<string, unknown> | undefined);
      }

      return linkIds;
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

      // deduplicate root path invalidations across hook calls
      // use tenantId + rootPath as key to handle multiple tenants
      // use separate cache that persists across cache clears for
      // cascade updates
      const cacheKey = `rootPath:${tenantId}:${rootPath}`;

      if (!rootPathInvalidationCache.has(cacheKey)) {
        rootPathInvalidationCache.add(cacheKey);

        if (process.env.ENV !== 'prod') {
          console.log('[CACHE] invalidating path:', rootPath);
        }

        if (process.env.ENV === 'prod') {
          revalidatePath(rootPath);
        }
      }
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

  // detect autosave: when a published document is edited, Payload creates a
  // draft (status changes from 'published' to 'draft') but with content changes
  // this is autosave, not an explicit unpublish, so we should skip cache
  // invalidation
  let isAutoSave = false;

  if (isUnpublishing && previousDoc) {
    // check if there are content changes (not just status change)
    // compare fields to detect if this is autosave vs explicit unpublish
    // check all keys from both documents to catch additions/removals
    const allKeys = new Set([
      ...Object.keys(doc),
      ...Object.keys(previousDoc),
    ]);

    const hasContentChanges = Array.from(allKeys)
      .some((key) => {
        // skip system fields and status
        if (key === '_status' || key === 'updatedAt' || key === 'createdAt' || key === 'id' || key === '_id') {
          return false;
        }

        // check if field value changed
        const prevValue = previousDoc[key];
        const currValue = doc[key];

        // if one is undefined and the other isn't, it's a change
        if ((prevValue === undefined) !== (currValue === undefined)) {
          return true;
        }

        // both defined or both undefined - compare values
        try {
          return JSON.stringify(prevValue) !== JSON.stringify(currValue);
        } catch {
          // if serialization fails, assume changed to be safe
          return true;
        }
      });

    // if unpublishing with content changes, it's autosave
    isAutoSave = hasContentChanges;
  }

  // skip cache invalidation during autosave operations
  // only process published pages, explicit unpublishing
  // (without content changes), or publishing (draft -> published)
  if (isAutoSave) {
    return doc;
  }

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
    // NOTE: we clear `invalidationCache` a bit further down, after we compute
    // whether this operation is a *real* cascade breadcrumb-only update.

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
    //
    // IMPORTANT:
    // Compare `previousDoc` vs `doc` (not `docToUse`) here.
    // `docToUse` is fetched with `locale: 'all'` and therefore has a different
    // localized-field shape than `previousDoc` (single-locale). Comparing those
    // shapes causes false positives (e.g. content-only updates look like
    // slug/navTitle changes), which breaks cache invalidation behavior + tests.
    const oldSlug = previousDoc?.slug;
    const newSlug = doc?.slug;
    const oldNavigationTitle = previousDoc?.[fieldNavigationTitleFieldName];
    const newNavigationTitle = doc?.[fieldNavigationTitleFieldName];
    const oldParent = previousDoc?.[fieldParentSelectorFieldName];
    const newParent = doc?.[fieldParentSelectorFieldName];

    const slugChanged = hasLocalizedStringChanged(oldSlug, newSlug);
    const navigationTitleChanged = hasLocalizedStringChanged(oldNavigationTitle, newNavigationTitle);
    const parentChanged = getParentId(oldParent) !== getParentId(newParent);
    const willTriggerCascade = slugChanged || navigationTitleChanged || parentChanged;

    const oldBreadcrumb = previousDoc?.[fieldBreadcrumbFieldName];
    const newBreadcrumb = doc?.[fieldBreadcrumbFieldName];
    const breadcrumbChanged = JSON.stringify(oldBreadcrumb) !== JSON.stringify(newBreadcrumb);

    // IMPORTANT:
    // `context.cascadeBreadcrumbUpdate` can leak across operations
    // (shared req/context). only treat it as a cascade update if the
    // breadcrumb actually changed AND slug/navTitle/parent did NOT change.
    const isCascadeBreadcrumbUpdate = context?.cascadeBreadcrumbUpdate === true &&
      breadcrumbChanged &&
      !willTriggerCascade;

    // clear invalidation cache at the start of each non-cascade update.
    // this ensures. we deduplicate within the same update operation but allow
    // new invalidations. in future operations (tests rely on fresh logs per
    // update).
    if (!isCascadeBreadcrumbUpdate) {
      invalidationCache.clear();
      // Clear root path cache at the start of each operation
      // The cache check in invalidateRootPaths will prevent duplicates
      // within the same operation (e.g., multiple hook calls due to cascade)
      rootPathInvalidationCache.clear();
    }

    // skip invalidating referencing pages during cascade breadcrumb updates
    // the original slug/parent/navTitle change already invalidated
    // referencing pages. only skip if this is a cascade update AND only
    // breadcrumb changed (not slug/parent/navTitle)
    if (isCascadeBreadcrumbUpdate) {
      return doc;
    }

    // check if page is in header navigation or consent banner/overlay -
    // if so, invalidate root paths
    // NOTE: We check this for ANY update (not just cascade triggers) because
    // if a page linked in consent/header changes in any way, we need to
    // invalidate root paths
    // for homePage, skip this check - it's handled below in the
    // content change check
    if (collectionSlug !== 'homePage') {
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

    // For homePage, check content changes regardless of cascade trigger
    // HomePage content changes should always invalidate root paths
    // Use context to prevent duplicate invalidations within the same operation
    if (collectionSlug === 'homePage' && !context?.homePageRootPathsInvalidated) {
      try {
        const oldContent = previousDoc?.content;
        const newContent = docToUse?.content;
        const contentChanged = hasContentChanged(oldContent, newContent);

        if (contentChanged) {
          await invalidateRootPaths({
            payload: req.payload,
            tenantId,
          });
          // mark in context that we invalidated root paths for this operation
          const reqContext = context || (req as any).context || {};

          reqContext.homePageRootPathsInvalidated = true;
          (req as any).context = reqContext;
        }
      } catch (error) {
        // comparison fails, don't block execution, just log and continue
        console.error('Error checking homePage content changes:', error);
      }
    }

    // if content changed (and no cascade trigger), invalidate the page itself
    // this handles blocks added/removed/reordered/changed when
    // slug/navTitle/parent didn't change.
    //
    // IMPORTANT:
    // Do NOT use `doc.content` here. On slug-only updates Payload often omits
    // unchanged fields on `doc`, which caused false positives and broke the
    // link-trigger test (extra invalidation logs).
    //
    // instead compare `previousDoc.content` with `docToUse.content` (fetched
    // from DB). `content` is a non-localized blocks field in our page configs,
    // so `locale: 'all'` does not change its shape.
    if (!willTriggerCascade) {
      try {
        const oldContent = previousDoc?.content;
        const newContent = docToUse?.content;
        const contentChanged = hasContentChanged(oldContent, newContent);

        if (contentChanged && collectionSlug !== 'homePage') {
          // Skip homePage here - already handled above
          await invalidatePagesWithDeduplication(
            [
              {
                collectionSlug,
                id: String(docToUse.id),
              },
            ],
            allLocales,
            req.payload,
          );
        }
      } catch (error) {
        // comparison fails, don't block execution, just log and continue
        console.error('Error checking content changes:', error);
      }
    }
  }

  return doc;
};
