// hook to invalidate cache when referenced collections change
// gandles collections like eventCategory, projects, people, etc.
// that are referenced in detail pages and blocks

import type {
  CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionSlug, TypedLocale,
} from 'payload';
import type { Team } from '@/payload-types';
import {
  globalCollectionsSlugs, singletonSlugs,
} from '@/collections/Pages/constants';
import { extractID } from '@/utilities/extractId';
import { findBlocks } from '@/hooks-payload/shared/extractProgrammaticLinkIds';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import {
  BLOCK_TO_COLLECTIONS,
  clearInvalidationCache,
  DETAIL_PAGE_TO_BLOCKS,
  findPagesWithProgrammaticBlocks,
  invalidatePagesWithDeduplication,
} from '@/hooks-payload/invalidateCacheOnPageChange';

// map referenced collections to detail pages that reference them
// format: { collectionSlug: [{ detailPageSlug, fieldPath }] }
// fieldPath is the path to relationship field (e.g., 'eventDetails.category')
const REFERENCED_COLLECTION_TO_DETAIL_PAGES: Record<string, { detailPageSlug: CollectionSlug; fieldPath: string }[]> = {
  // documents are referenced in DownloadsBlock, handled via blocks
  documents: [],
  eventCategory: [
    {
      detailPageSlug: 'eventDetailPage',
      fieldPath: 'eventDetails.category',
    },
  ],
  // forms are referenced in FormBlock, handled via blocks
  forms: [],
  images: [
    {
      detailPageSlug: 'publicationDetailPage',
      fieldPath: 'overviewPageProps.image',
    },
    {
      detailPageSlug: 'instituteDetailPage',
      fieldPath: 'overviewPageProps.image',
    },
    {
      detailPageSlug: 'nationalDictionaryDetailPage',
      fieldPath: 'overviewPageProps.image',
    },
    {
      detailPageSlug: 'people',
      fieldPath: 'image',
    },
  ],
  // networkCategories are referenced in NetworkTeasersBlock, handled via blocks
  networkCategories: [],
  // people are referenced in CtaContactBlock and teams, handled via blocks
  people: [],
  projects: [
    {
      detailPageSlug: 'eventDetailPage',
      fieldPath: 'eventDetails.project',
    },
    {
      detailPageSlug: 'publicationDetailPage',
      fieldPath: 'categorization.project',
    },
    {
      detailPageSlug: 'projectDetailPage',
      fieldPath: 'project',
    },
    {
      detailPageSlug: 'newsDetailPage',
      fieldPath: 'project',
    },
  ],
  publicationTopics: [
    {
      detailPageSlug: 'publicationDetailPage',
      fieldPath: 'categorization.topic',
    },
  ],
  publicationTypes: [
    {
      detailPageSlug: 'publicationDetailPage',
      fieldPath: 'categorization.type',
    },
  ],
  // teams are referenced in PeopleOverviewBlock, handled via blocks
  // teams also reference people, but teams are not detail pages
  teams: [],
  // videos are referenced in VideoBlock, handled via blocks
  videos: [],
  // zenodoDocuments are referenced in DownloadsBlock, handled via blocks
  zenodoDocuments: [],
};

// map referenced collections to block types that reference them
// format: { collectionSlug: [blockType] }
const REFERENCED_COLLECTION_TO_BLOCKS: Record<string, string[]> = {
  documents: ['downloadsBlock'],
  forms: ['formBlock'],
  images: [
    'imageBlock',
    'imageBlockMagazine',
    'networkTeasersBlock',
    'videoBlock',
    'genericTeasersBlock',
  ],
  networkCategories: ['networkTeasersBlock'],
  people: ['ctaContactBlock'],
  projects: ['downloadsBlock'],
  teams: ['peopleOverviewBlock'],
  videos: ['videoBlock'],
  zenodoDocuments: ['downloadsBlock'],
};

// map referenced collections to programmatic block types that query them
// these blocks don't directly reference documents,
// but query for them programmatically
const REFERENCED_COLLECTION_TO_PROGRAMMATIC_BLOCKS: Record<string, string[]> = {
  eventCategory: [
    'eventsTeasersBlock',
    'eventsOverviewBlock',
  ],
  projects: [
    'projectsTeasersBlock',
    'projectsOverviewBlock',
    'newsTeasersBlock',
    'newsOverviewBlock',
    'eventsTeasersBlock',
    'eventsOverviewBlock',
  ],
};

// helper to check if a value matches the changed document id
const matchesDocumentId = (value: unknown, changedDocumentId: string): boolean => {
  if (value && typeof value === 'object' && 'id' in value) {
    return String(value.id) === changedDocumentId;
  }
  if (typeof value === 'string') {
    return value === changedDocumentId;
  }

  return false;
};

// Helper to check if a block references the changed document
const blockReferencesDocument = (
  block: unknown,
  blockTypeValue: string,
  collectionSlug: CollectionSlug,
  changedDocumentId: string,
  blockTypes: string[],
): boolean => {
  if (!block || typeof block !== 'object') {
    return false;
  }

  const blockRecord = block as Record<string, unknown>;

  if (typeof blockTypeValue !== 'string' || !blockTypes.includes(blockTypeValue)) {
    return false;
  }

  // check if this block references the changed document
  // handle different block types
  if (blockTypeValue === 'downloadsBlock') {
    // downloadsBlock can reference projects, documents
    // or zenodoDocuments
    if (collectionSlug === 'projects') {
      // only check project field if customOrAuto is 'auto'
      // when customOrAuto is 'custom', the block uses downloads field instead
      const {
        customOrAuto,
      } = blockRecord;

      if (customOrAuto === 'auto') {
        return matchesDocumentId(blockRecord.project, changedDocumentId);
      }

      return false;
    }
    if (collectionSlug === 'documents' || collectionSlug === 'zenodoDocuments') {
      // only check downloads field if customOrAuto is 'custom'
      // when customOrAuto is 'auto', the block uses project field instead
      const {
        customOrAuto,
        downloads,
      } = blockRecord;

      if (customOrAuto !== 'custom') {
        return false;
      }

      // downloads is localized, so when queried with locale: 'all',
      // it might be structured as { de: [...], ... }
      // or it might be a direct array if queried with a specific locale
      const downloadsArrays: unknown[][] = [];

      if (Array.isArray(downloads)) {
        downloadsArrays.push(downloads);
      } else if (downloads && typeof downloads === 'object') {
        // Handle localized structure: { de: [...], fr: [...], ... }
        const downloadsRecord = downloads as Record<string, unknown>;

        Object.values(downloadsRecord)
          .forEach((localeDownloads) => {
            if (Array.isArray(localeDownloads)) {
              downloadsArrays.push(localeDownloads);
            }
          });
      }

      // Check all downloads arrays (across all locales)
      return downloadsArrays.some((downloadsArray) => {
        if (downloadsArray.length === 0) {
          return false;
        }

        return downloadsArray.some((download) => {
          if (!download || typeof download !== 'object') {
            return false;
          }
          const downloadRecord = download as Record<string, unknown>;
          const {
            relationTo,
          } = downloadRecord;
          const {
            value,
          } = downloadRecord;

          // check if relationTo matches the collection slug
          if (relationTo !== collectionSlug) {
            return false;
          }

          // value can be a string ID or a populated object with an id field
          // matchesDocumentId handles both cases
          return matchesDocumentId(value, changedDocumentId);
        });
      });
    }
  } else if (blockTypeValue === 'formBlock') {
    // FormBlock references forms
    if (collectionSlug === 'forms') {
      return matchesDocumentId(blockRecord.form, changedDocumentId);
    }
  } else if (blockTypeValue === 'imageBlock' || blockTypeValue === 'imageBlockMagazine') {
    // ImageBlock references images
    if (collectionSlug === 'images') {
      return matchesDocumentId(blockRecord.image, changedDocumentId);
    }
  } else if (blockTypeValue === 'videoBlock') {
    // VideoBlock references videos and images (stillImage)
    if (collectionSlug === 'videos') {
      // videoBlock has locale-specific video fields (video-de, video-fr, etc.)
      // check all of them
      const videoFields = [
        'video-de',
        'video-fr',
        'video-it',
        'video-en',
      ];

      return videoFields.some((field) => matchesDocumentId(blockRecord[field], changedDocumentId));
    }
    if (collectionSlug === 'images') {
      return matchesDocumentId(blockRecord.stillImage, changedDocumentId);
    }
  } else if (blockTypeValue === 'networkTeasersBlock') {
    // NetworkTeasersBlock references networkCategories and images
    if (collectionSlug === 'networkCategories' || collectionSlug === 'images') {
      const {
        items,
      } = blockRecord;

      if (items && typeof items === 'object') {
        const itemsRecord = items as Record<string, unknown>;
        const networkItems = itemsRecord.items;

        if (Array.isArray(networkItems)) {
          return networkItems.some((item) => {
            if (item && typeof item === 'object') {
              const itemRecord = item as Record<string, unknown>;
              const fieldToCheck = collectionSlug === 'networkCategories'
                ? itemRecord.category
                : itemRecord.image;

              return matchesDocumentId(fieldToCheck, changedDocumentId);
            }

            return false;
          });
        }
      }
    }
  } else if (blockTypeValue === 'ctaContactBlock') {
    // CtaContactBlock references people
    if (collectionSlug === 'people') {
      const {
        contact,
      } = blockRecord;

      if (Array.isArray(contact)) {
        return contact.some((person) => matchesDocumentId(person, changedDocumentId));
      }
    }
  } else if (blockTypeValue === 'peopleOverviewBlock') {
    // PeopleOverviewBlock references teams (single relationship, not array)
    if (collectionSlug === 'teams') {
      const {
        teams,
      } = blockRecord;

      return matchesDocumentId(teams, changedDocumentId);
    }
  } else if (blockTypeValue === 'genericTeasersBlock') {
    // GenericTeasersBlock references images in teasers array
    if (collectionSlug === 'images') {
      const {
        teasers,
      } = blockRecord;

      if (Array.isArray(teasers)) {
        return teasers.some((teaser) => {
          if (teaser && typeof teaser === 'object') {
            const teaserRecord = teaser as Record<string, unknown>;

            return matchesDocumentId(teaserRecord.image, changedDocumentId);
          }

          return false;
        });
      }
    }
  }

  return false;
};

// Find pages that have blocks referencing a specific document
const findPagesWithBlocksReferencingDocument = async ({
  changedDocumentId,
  collectionSlug,
  blockTypes,
  payload,
  tenantId,
}: {
  changedDocumentId: string;
  collectionSlug: CollectionSlug;
  blockTypes: string[];
  payload: any;
  tenantId: string;
}): Promise<{ id: string; collectionSlug: CollectionSlug }[]> => {
  const pageResults: { id: string; collectionSlug: CollectionSlug }[] = [];

  if (!blockTypes || blockTypes.length === 0) {
    return pageResults;
  }

  // capture referenced collection slug before it gets shadowed by
  // the map variable
  const referencedCollectionSlug = collectionSlug;

  // Get unique collections where these blocks can be placed
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

  // Process each collection in parallel
  const pageIdPromises = Array.from(collectionsToSearch)
    .map(async (pageCollectionSlug) => {
      const isSingleton = singletonSlugs.some((singleton) => singleton.slug === pageCollectionSlug);

      // check if this collection has drafts enabled
      const collectionConfig = payload.config.collections.find((c: any) => c.slug === pageCollectionSlug);
      const hasDrafts = Boolean(collectionConfig?.versions?.drafts);

      try {
        const whereCondition: any = {
          tenant: {
            equals: tenantId,
          },
        };

        // add published status filter only if collection has drafts enabled
        if (hasDrafts) {

          whereCondition._status = {
            equals: 'published',
          };
        }

        const queryOptions: any = {
          collection: pageCollectionSlug,
          // need depth to read content blocks
          depth: 1,
          locale: 'all',
          where: whereCondition,
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

            // verify published status for pages that have drafts enabled
            if (!isSingleton && hasDrafts && pageRecord._status !== 'published') {
              return null;
            }

            const pageId = String(pageIdRaw);

            // check if page has matching blocks that reference changed document
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
              const blockTypeValue = blockRecord.blockType;

              if (typeof blockTypeValue !== 'string') {
                return false;
              }

              return blockReferencesDocument(
                block,
                blockTypeValue,
                referencedCollectionSlug,
                changedDocumentId,
                blockTypes,
              );
            });

            return hasMatchingBlock
              ? {
                collectionSlug: pageCollectionSlug,
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

// Find detail pages that directly reference a document via relationship fields
const findDetailPagesReferencingDocument = async ({
  changedDocumentId,
  collectionSlug,
  tenantId,
  payload,
}: {
  changedDocumentId: string;
  collectionSlug: CollectionSlug;
  tenantId: string;
  payload: any;
}): Promise<{ id: string; collectionSlug: CollectionSlug }[]> => {
  const referencingPages: { id: string; collectionSlug: CollectionSlug }[] = [];
  const detailPageMappings = REFERENCED_COLLECTION_TO_DETAIL_PAGES[collectionSlug];

  if (!detailPageMappings || detailPageMappings.length === 0) {
    return referencingPages;
  }

  // Process each detail page type that references this collection
  await Promise.all(detailPageMappings.map(async ({
    detailPageSlug, fieldPath,
  }) => {
    try {
      const isSingleton = singletonSlugs.some((singleton) => singleton.slug === detailPageSlug);
      const isGlobal = globalCollectionsSlugs.some((global) => global.slug === detailPageSlug);

      // check if this collection has drafts enabled
      const collectionConfig = payload.config.collections.find((c: any) => c.slug === detailPageSlug);
      const hasDrafts = Boolean(collectionConfig?.versions?.drafts);

      // Build query to find pages that reference the changed document
      // Use dot notation for nested field paths (e.g., 'eventDetails.category')
      const whereCondition: any = {
        [fieldPath]: {
          equals: changedDocumentId,
        },
        tenant: {
          equals: tenantId,
        },
      };

      // Add published status filter for regular pages that have drafts enabled
      if (!isSingleton && !isGlobal && hasDrafts) {
        whereCondition._status = {
          equals: 'published',
        };
      }

      const pages = await payload.find({
        collection: detailPageSlug,
        depth: 0,
        limit: 0,
        locale: 'all',
        pagination: false,
        where: whereCondition,
      });

      // Add found pages to results
      type PageResult = { id: string; collectionSlug: CollectionSlug } | null;

      const validPages = pages.docs
        .map((page: unknown): PageResult => {
          const pageRecord = page as Record<string, unknown>;
          const pageIdRaw = pageRecord.id;

          if (!pageIdRaw) {
            return null;
          }

          // Verify tenant matches
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

          // Verify published status for regular pages that have drafts enabled
          if (!isSingleton && !isGlobal && hasDrafts && pageRecord._status !== 'published') {
            return null;
          }

          const pageId = String(pageIdRaw);

          return {
            collectionSlug: detailPageSlug,
            id: pageId,
          };
        })
        .filter((page: PageResult): page is { id: string; collectionSlug: CollectionSlug } => page !== null);

      referencingPages.push(...validPages);
    } catch (error) {
      console.error(`Error finding detail pages referencing ${collectionSlug} document ${changedDocumentId} in ${detailPageSlug}:`, error);
    }
  }));

  return referencingPages;
};

// logic to invalidate cache for pages referencing a deleted/changed document
const invalidatePagesReferencingDocument = async ({
  changedDocumentId,
  collectionSlug,
  tenantId,
  payload,
  allLocales,
  documentProject,
}: {
  changedDocumentId: string;
  collectionSlug: CollectionSlug;
  tenantId: string;
  payload: any;
  allLocales: TypedLocale[];

  // optional project from doc (for delete hook)
  documentProject?: unknown;
}): Promise<void> => {
  const pagesToInvalidate: { id: string; collectionSlug: CollectionSlug }[] = [];

  // 1. find detail pages that directly reference this document via
  // relationship fields
  const detailPagesReferencing = await findDetailPagesReferencingDocument({
    changedDocumentId,
    collectionSlug,
    payload,
    tenantId,
  });

  pagesToInvalidate.push(...detailPagesReferencing);

  // 2. find pages with blocks that reference this document
  const blockTypes = REFERENCED_COLLECTION_TO_BLOCKS[collectionSlug] || [];

  if (blockTypes.length > 0) {
    const pagesWithBlocks = await findPagesWithBlocksReferencingDocument({
      blockTypes,
      changedDocumentId,
      collectionSlug,
      payload,
      tenantId,
    });

    pagesToInvalidate.push(...pagesWithBlocks);
  }

  // 2a. special handling for documents/zenodoDocuments: find pages with
  // downloadsBlock (customOrAuto: 'auto') where the block's project matches
  // the document's project
  if (collectionSlug === 'documents' || collectionSlug === 'zenodoDocuments') {
    try {
      // use provided project (from delete hook) or fetch it (from change hook)
      let documentProjectValue: unknown = documentProject;

      if (!documentProjectValue) {
        // fetch the document to get its project (for change hook)
        try {
          const document = await payload.findByID({
            collection: collectionSlug,
            depth: 0,
            id: changedDocumentId,
          });

          const documentRecord = document as Record<string, unknown>;

          documentProjectValue = documentRecord.project;
        } catch (error) {
          // document might not exist (e.g., already deleted)
          // skip this step
          console.error(`Error fetching ${collectionSlug} document ${changedDocumentId} for project lookup:`, error);
          documentProjectValue = null;
        }
      }

      if (documentProjectValue) {
        // extract project ID (could be string or populated object)
        const projectId = extractID(documentProjectValue as any);
        const projectIdString = typeof projectId === 'string'
          ? projectId
          : String(projectId);

        // find pages with downloadsBlock where customOrAuto === 'auto' and
        // block's project matches the document's project
        const pageCollectionsWithDownloadsBlock = BLOCK_TO_COLLECTIONS.downloadsBlock || [];

        const pagesWithAutoDownloadsPromises = pageCollectionsWithDownloadsBlock.map(async (pageCollectionSlug) => {
          const isSingleton = singletonSlugs.some((singleton) => singleton.slug === pageCollectionSlug);
          const collectionConfig = payload.config.collections.find((c: any) => c.slug === pageCollectionSlug);
          const hasDrafts = Boolean(collectionConfig?.versions?.drafts);

          const whereCondition: any = {
            tenant: {
              equals: tenantId,
            },
          };

          if (hasDrafts && !isSingleton) {
            whereCondition._status = {
              equals: 'published',
            };
          }

          try {
            const pages = await payload.find({
              collection: pageCollectionSlug,

              // need depth to read content blocks
              depth: 1,
              limit: 0,
              locale: 'all',
              pagination: false,
              where: whereCondition,
            });

            type PageResult = { id: string; collectionSlug: CollectionSlug } | null;

            return pages.docs
              .map((page: unknown): PageResult => {
                const pageRecord = page as Record<string, unknown>;
                const pageId = pageRecord.id;

                if (!pageId) {
                  return null;
                }

                // check if page has downloadsBlock with customOrAuto === 'auto'
                // and project matching the document's project
                const {
                  content,
                } = pageRecord;

                if (!Array.isArray(content)) {
                  return null;
                }

                const hasMatchingBlock = content.some((block: unknown) => {
                  const blockRecord = block as Record<string, unknown>;
                  const {
                    blockType,
                  } = blockRecord;

                  if (blockType !== 'downloadsBlock') {
                    return false;
                  }

                  const {
                    customOrAuto,
                  } = blockRecord;

                  if (customOrAuto !== 'auto') {
                    return false;
                  }

                  const blockProject = blockRecord.project;

                  if (!blockProject) {
                    return false;
                  }

                  // check if block's project matches document's project
                  const blockProjectId = extractID(blockProject as any);
                  const blockProjectIdString = typeof blockProjectId === 'string'
                    ? blockProjectId
                    : String(blockProjectId);

                  return blockProjectIdString === projectIdString;
                });

                return hasMatchingBlock
                  ? {
                    collectionSlug: pageCollectionSlug,
                    id: String(pageId),
                  }
                  : null;
              })
              .filter((page: PageResult): page is { id: string; collectionSlug: CollectionSlug } => page !== null);
          } catch {
            return [];
          }
        });

        const pagesWithAutoDownloadsArrays = await Promise.all(pagesWithAutoDownloadsPromises);
        const pagesWithAutoDownloads = pagesWithAutoDownloadsArrays.flat();

        pagesToInvalidate.push(...pagesWithAutoDownloads);
      }
    } catch (error) {
      console.error(`Error finding pages with downloadsBlock (auto) for ${collectionSlug}:`, error);
    }
  }

  // 2b. special handling for images: find pages with meta.seo.image
  // referencing the changed image
  if (collectionSlug === 'images') {
    try {
      // page collections that have meta.seo.image field
      const pageCollectionsWithMeta: CollectionSlug[] = [
        'detailPage',
        'eventDetailPage',
        'magazineDetailPage',
        'newsDetailPage',
        'publicationDetailPage',
        'projectDetailPage',
        'instituteDetailPage',
        'nationalDictionaryDetailPage',
        'overviewPage',
        'homePage',
      ];

      const pagesWithMetaImagePromises = pageCollectionsWithMeta.map(async (pageCollectionSlug) => {
        const isSingleton = singletonSlugs.some((singleton) => singleton.slug === pageCollectionSlug);
        const collectionConfig = payload.config.collections.find((c: any) => c.slug === pageCollectionSlug);
        const hasDrafts = Boolean(collectionConfig?.versions?.drafts);

        const whereCondition: any = {
          'meta.seo.image': {
            equals: changedDocumentId,
          },
          'tenant': {
            equals: tenantId,
          },
        };

        if (hasDrafts && !isSingleton) {
          whereCondition._status = {
            equals: 'published',
          };
        }

        try {
          const pages = await payload.find({
            collection: pageCollectionSlug,
            depth: 0,
            limit: 0,
            locale: 'all',
            pagination: false,
            where: whereCondition,
          });

          type PageResult = { id: string; collectionSlug: CollectionSlug } | null;

          return pages.docs.map((page: unknown): PageResult => {
            const pageRecord = page as Record<string, unknown>;
            const pageId = pageRecord.id;

            return pageId
              ? {
                collectionSlug: pageCollectionSlug,
                id: String(pageId),
              }
              : null;
          })
            .filter((page: PageResult): page is { id: string; collectionSlug: CollectionSlug } => page !== null);
        } catch {
          return [];
        }
      });

      const pagesWithMetaImageArrays = await Promise.all(pagesWithMetaImagePromises);
      const pagesWithMetaImage = pagesWithMetaImageArrays.flat();

      pagesToInvalidate.push(...pagesWithMetaImage);
    } catch (error) {
      console.error('Error finding pages with meta.seo.image referencing image:', error);
    }
  }

  // 3. special handling for images: find people that reference this image,
  // then find pages with CtaContactBlock that reference those people,
  // and also find teams that reference those people, then find pages with
  // PeopleOverviewBlock that reference those teams
  if (collectionSlug === 'images') {
    try {
      // find people that reference this image
      const peopleReferencingImage = await payload.find({
        collection: 'people',
        depth: 0,
        locale: 'all',
        where: {
          image: {
            equals: changedDocumentId,
          },
          tenant: {
            equals: tenantId,
          },
        },
      });

      if (peopleReferencingImage.docs.length > 0) {
        // for each person, find pages with CtaContactBlock that reference it
        const pagesWithCtaContactPromises = (peopleReferencingImage.docs as unknown[]).map((person: unknown) => {
          const personRecord = person as Record<string, unknown>;
          const personId = String(personRecord.id);

          return findPagesWithBlocksReferencingDocument({
            blockTypes: ['ctaContactBlock'],
            changedDocumentId: personId,
            collectionSlug: 'people',
            payload,
            tenantId,
          });
        });

        const pagesWithCtaContactArrays = await Promise.all(pagesWithCtaContactPromises);
        const pagesWithCtaContact = pagesWithCtaContactArrays.flat();

        pagesToInvalidate.push(...pagesWithCtaContact);

        // for each person, find teams that reference them, then find pages
        // with PeopleOverviewBlock that reference those teams
        const personIds = (peopleReferencingImage.docs as unknown[]).map((person: unknown) => {
          const personRecord = person as Record<string, unknown>;

          return String(personRecord.id);
        });

        const teamsReferencingPeoplePromises = personIds.map((personId) => payload.find({
          collection: 'teams',
          depth: 0,
          locale: 'all',
          where: {
            people: {
              contains: personId,
            },
            tenant: {
              equals: tenantId,
            },
          },
        }));

        const teamsReferencingPeopleArrays = await Promise.all(teamsReferencingPeoplePromises);
        const allTeams = teamsReferencingPeopleArrays.flatMap((result) => result.docs as Team[]);

        // deduplicate teams
        const uniqueTeamsMap = new Map<string, Team>();

        allTeams.forEach((team) => {
          const teamId = String(team.id);

          if (!uniqueTeamsMap.has(teamId)) {
            uniqueTeamsMap.set(teamId, team);
          }
        });

        const uniqueTeams = Array.from(uniqueTeamsMap.values());

        // for each team, find pages with PeopleOverviewBlock that reference it
        const pagesWithPeopleOverviewPromises = uniqueTeams.map((team) => {
          const teamId = String(team.id);

          return findPagesWithBlocksReferencingDocument({
            blockTypes: ['peopleOverviewBlock'],
            changedDocumentId: teamId,
            collectionSlug: 'teams',
            payload,
            tenantId,
          });
        });

        const pagesWithPeopleOverviewArrays = await Promise.all(pagesWithPeopleOverviewPromises);
        const pagesWithPeopleOverview = pagesWithPeopleOverviewArrays.flat();

        pagesToInvalidate.push(...pagesWithPeopleOverview);
      }
    } catch (error) {
      console.error('Error finding people, teams, and pages referencing image:', error);
    }
  }

  // 4. special handling for people: find teams that reference this person,
  // then find pages with PeopleOverviewBlock that reference those teams
  if (collectionSlug === 'people') {
    try {
      // find teams that reference this person
      const teamsReferencingPerson = await payload.find({
        collection: 'teams',
        depth: 0,
        locale: 'all',
        where: {
          people: {
            contains: changedDocumentId,
          },
          tenant: {
            equals: tenantId,
          },
        },
      });

      // for each team, find pages with PeopleOverviewBlock that reference it
      const pagesWithPeopleOverviewPromises = (teamsReferencingPerson.docs as Team[]).map((team) => {
        const teamId = String(team.id);

        return findPagesWithBlocksReferencingDocument({
          blockTypes: ['peopleOverviewBlock'],
          changedDocumentId: teamId,
          collectionSlug: 'teams',
          payload,
          tenantId,
        });
      });

      const pagesWithPeopleOverviewArrays = await Promise.all(pagesWithPeopleOverviewPromises);
      const pagesWithPeopleOverview = pagesWithPeopleOverviewArrays.flat();

      pagesToInvalidate.push(...pagesWithPeopleOverview);
    } catch (error) {
      console.error('Error finding teams and pages referencing person:', error);
    }
  }

  // 5. find pages with programmatic blocks that query referenced collection
  // directly (e.g., projectsOverviewBlock queries projects programmatically)
  const programmaticBlockTypes = REFERENCED_COLLECTION_TO_PROGRAMMATIC_BLOCKS[collectionSlug] || [];

  if (programmaticBlockTypes.length > 0) {
    try {
      const pagesWithProgrammaticBlocks = await findPagesWithProgrammaticBlocks({
        blockTypes: programmaticBlockTypes,
        payload,
        tenantId,
      });

      pagesToInvalidate.push(...pagesWithProgrammaticBlocks);
    } catch (error) {
      console.error(`Error finding pages with programmatic blocks for ${collectionSlug}:`, error);
    }
  }

  // 6. special handling for images: find magazine detail pages with imageBlock
  // referencing the changed image, find pages with magazine overview/teaser
  // blocks that would show those pages
  if (collectionSlug === 'images') {
    try {
      // find magazine detail pages that have an imageBlock referencing image
      const collectionConfig = payload.config.collections.find((c: any) => c.slug === 'magazineDetailPage');
      const hasDrafts = Boolean(collectionConfig?.versions?.drafts);

      const whereCondition: any = {
        tenant: {
          equals: tenantId,
        },
      };

      if (hasDrafts) {
        whereCondition._status = {
          equals: 'published',
        };
      }

      const magazinePages = await payload.find({
        collection: 'magazineDetailPage',
        depth: 1,
        limit: 0,
        locale: 'all',
        pagination: false,
        where: whereCondition,
      });

      // filter to only pages that have imageBlock referencing the changed image
      type PageResult = { id: string; collectionSlug: CollectionSlug } | null;

      const magazinePagesWithImage = magazinePages.docs
        .filter((page: unknown) => {
          const pageRecord = page as Record<string, unknown>;
          const {
            content,
          } = pageRecord;

          if (!Array.isArray(content)) {
            return false;
          }

          // check if any imageBlock references the changed image
          return content.some((block) => {
            if (!block || typeof block !== 'object') {
              return false;
            }
            const blockRecord = block as Record<string, unknown>;

            return blockRecord.blockType === 'imageBlockMagazine' &&
              matchesDocumentId(blockRecord.image, changedDocumentId);
          });
        })
        .map((page: unknown): PageResult => {
          const pageRecord = page as Record<string, unknown>;
          const pageId = pageRecord.id;

          return pageId
            ? {
              collectionSlug: 'magazineDetailPage' as CollectionSlug,
              id: String(pageId),
            }
            : null;
        })
        .filter((page: PageResult): page is { id: string; collectionSlug: CollectionSlug } => page !== null);

      // find pages with magazine overview/teaser blocks that
      // would show these pages
      if (magazinePagesWithImage.length > 0) {
        const detailPageBlockTypes = DETAIL_PAGE_TO_BLOCKS['magazineDetailPage'];

        if (detailPageBlockTypes && detailPageBlockTypes.length > 0) {
          const pagesWithMagazineBlocks = await findPagesWithProgrammaticBlocks({
            blockTypes: detailPageBlockTypes,
            payload,
            tenantId,
          });

          pagesToInvalidate.push(...pagesWithMagazineBlocks);
        }
      }
    } catch (error) {
      console.error('Error finding magazine pages and pages with magazine blocks for image:', error);
    }
  }

  // 7. for detail pages found in step 1, find pages with teaser/overview blocks
  // that reference those detail pages (reuse existing logic)
  const pagesWithTeaserBlocksPromises = detailPagesReferencing
    .map((detailPage) => {
      const detailPageBlockTypes = DETAIL_PAGE_TO_BLOCKS[detailPage.collectionSlug];

      if (!detailPageBlockTypes || detailPageBlockTypes.length === 0) {
        return null;
      }

      return findPagesWithProgrammaticBlocks({
        blockTypes: detailPageBlockTypes,
        payload,
        tenantId,
      })
        .catch((error) => {
          console.error(`Error finding pages with programmatic blocks for ${detailPage.collectionSlug} ${detailPage.id}:`, error);

          return [] as { id: string; collectionSlug: CollectionSlug }[];
        });
    })
    .filter((promise): promise is Promise<{ id: string; collectionSlug: CollectionSlug }[]> => promise !== null);

  if (pagesWithTeaserBlocksPromises.length > 0) {
    const pagesWithTeaserBlocksArrays = await Promise.all(pagesWithTeaserBlocksPromises);
    const pagesWithTeaserBlocks = pagesWithTeaserBlocksArrays.flat();

    // only add pages that actually reference this detail page
    // we need to check if the teaser/overview block would show this detail page
    // for now, we'll invalidate all pages with these blocks when
    // any detail page changes. this is safe but may be more aggressive
    // than needed
    pagesToInvalidate.push(...pagesWithTeaserBlocks);
  }

  // deduplicate pages
  const uniquePagesMap = new Map<string, { id: string; collectionSlug: CollectionSlug }>();

  pagesToInvalidate.forEach((page) => {
    const key = `${page.collectionSlug}:${page.id}`;

    if (!uniquePagesMap.has(key)) {
      uniquePagesMap.set(key, page);
    }
  });

  const finalPagesToInvalidate = Array.from(uniquePagesMap.values());

  // invalidate cache for all found pages
  if (finalPagesToInvalidate.length > 0) {
    await invalidatePagesWithDeduplication(finalPagesToInvalidate, allLocales, payload);
  }
};

export const hookInvalidateCacheOnReferencedCollectionChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  collection,
  context,
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

  // referenced collections (eventCategory, projects, etc.)
  // don't have drafts/versions, so they're always considered "published"
  // for cache invalidation purposes
  const referencedCollectionSlugs: CollectionSlug[] = [
    'networkCategories',
    'projects',
    'people',
    'teams',
    'publicationTopics',
    'publicationTypes',
    'eventCategory',
    'forms',
    'images',
    'videos',
    'documents',
    'zenodoDocuments',
  ];
  const isReferencedCollection = referencedCollectionSlugs.includes(collectionSlug);

  if (!isReferencedCollection) {
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

  // clear invalidation cache at the start of the operation to ensure
  // fresh invalidations (similar to what we do for regular page updates)
  if (operation === 'update') {
    clearInvalidationCache();
  }

  const changedDocumentId = String(doc.id);

  await invalidatePagesReferencingDocument({
    allLocales,
    changedDocumentId,
    collectionSlug,
    payload: req.payload,
    tenantId,
  });

  return doc;
};

export const hookInvalidateCacheOnReferencedCollectionDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
  id,
  collection,
  context,
}) => {
  // skip if already invalidating (prevent loops)
  if (context?.invalidatingCache) {
    return;
  }

  // skip cache invalidation during seed operations
  if (context?.skipCacheInvalidation) {
    return;
  }

  if (!doc || !req?.payload) {
    return;
  }

  const collectionSlug = collection?.slug;

  if (!collectionSlug) {
    return;
  }

  // referenced collections (eventCategory, projects, etc.)
  // don't have drafts/versions, so they're always considered "published"
  // for cache invalidation purposes
  const referencedCollectionSlugs: CollectionSlug[] = [
    'networkCategories',
    'projects',
    'people',
    'teams',
    'publicationTopics',
    'publicationTypes',
    'eventCategory',
    'forms',
    'images',
    'videos',
    'documents',
    'zenodoDocuments',
  ];
  const isReferencedCollection = referencedCollectionSlugs.includes(collectionSlug);

  if (!isReferencedCollection) {
    return;
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
    return;
  }

  const allLocales = getLocaleCodes();
  const deletedDocumentId = String(id || doc.id);

  // extract project from doc before deletion (for documents/zenodoDocuments)
  let documentProject: unknown | undefined;

  if (collectionSlug === 'documents' || collectionSlug === 'zenodoDocuments') {
    const docRecord = doc as Record<string, unknown>;

    documentProject = docRecord.project;
  }

  // clear invalidation cache at the start of the operation
  clearInvalidationCache();

  // invalidate cache for pages referencing the deleted document
  await invalidatePagesReferencingDocument({
    allLocales,
    changedDocumentId: deletedDocumentId,
    collectionSlug,
    documentProject,
    payload: req.payload,
    tenantId,
  });
};
