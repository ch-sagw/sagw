// Hook to invalidate cache when i18n globals change

import type {
  CollectionAfterChangeHook, CollectionSlug,
} from 'payload';
import { singletonSlugs } from '@/collections/Pages/constants';
import { extractID } from '@/utilities/extractId';
import { findBlocks } from '@/hooks-payload/shared/extractProgrammaticLinkIds';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import {
  BLOCK_TO_COLLECTIONS,
  clearInvalidationCache,
  findPagesWithProgrammaticBlocks,
  invalidatePagesWithDeduplication,
} from '@/hooks-payload/invalidateCacheOnPageChange';

// Map i18n fields to their usage (blocks or page collections)
const I18N_FIELD_TO_USAGE: Record<string, { blockTypes?: string[]; pageCollections?: CollectionSlug[] }> = {
  'bibliographicReference.copyButtonText': {
    blockTypes: ['bibliographicReferenceBlock'],
  },
  'bibliographicReference.title': {
    blockTypes: ['bibliographicReferenceBlock'],
  },
  'forms.dataPrivacyCheckbox.dataPrivacyCheckboxText': {
    blockTypes: ['formBlock'],
  },
  'forms.dataPrivacyCheckbox.errorMessage': {
    blockTypes: ['formBlock'],
  },
  'generic.downloadTitle': {
    blockTypes: ['downloadsBlock'],
  },
  'generic.exportArticleButtonText': {
    pageCollections: ['magazineDetailPage'],
  },
  'generic.linksTitle': {
    blockTypes: ['linksBlock'],
  },
  'generic.time': {
    pageCollections: ['eventDetailPage'],
    // eventsTeasersBlock and eventsOverviewBlock are programmatic blocks,
    // handled separately via findPagesWithProgrammaticBlocks
  },
  'generic.writeEmailButtonText': {
    blockTypes: ['ctaContactBlock'],
  },
};

// Helper to check if a field path changed
const hasFieldChanged = (fieldPath: string, doc: Record<string, unknown>, previousDoc: Record<string, unknown> | undefined): boolean => {
  if (!previousDoc) {
    // If no previous doc, consider it changed
    return true;
  }

  const pathParts = fieldPath.split('.');
  let currentDoc: unknown = doc;
  let currentPreviousDoc: unknown = previousDoc;

  for (const part of pathParts) {
    if (typeof currentDoc !== 'object' || currentDoc === null || !(part in currentDoc)) {
      return false;
    }
    if (typeof currentPreviousDoc !== 'object' || currentPreviousDoc === null || !(part in currentPreviousDoc)) {
      // Field exists in new doc but not in previous
      return true;
    }
    currentDoc = (currentDoc as Record<string, unknown>)[part];
    currentPreviousDoc = (currentPreviousDoc as Record<string, unknown>)[part];
  }

  // Compare the final values
  return JSON.stringify(currentDoc) !== JSON.stringify(currentPreviousDoc);
};

// Find pages that have specific blocks
const findPagesWithBlocks = async ({
  blockTypes,
  payload,
  tenantId,
}: {
  blockTypes: string[];
  payload: any;
  tenantId: string;
}): Promise<{ id: string; collectionSlug: CollectionSlug }[]> => {
  const pageResults: { id: string; collectionSlug: CollectionSlug }[] = [];

  if (!blockTypes || blockTypes.length === 0) {
    return pageResults;
  }

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

        // Add published status filter only if collection has drafts enabled
        if (hasDrafts && !isSingleton) {
          whereCondition._status = {
            equals: 'published',
          };
        }

        const queryOptions: any = {
          collection: pageCollectionSlug,
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

// find pages that have formBlock where form has showPrivacyCheckbox: true
const findPagesWithFormBlocksWithPrivacyCheckbox = async ({
  payload,
  tenantId,
}: {
  payload: any;
  tenantId: string;
}): Promise<{ id: string; collectionSlug: CollectionSlug }[]> => {
  const pageResults: { id: string; collectionSlug: CollectionSlug }[] = [];

  // Get collections where formBlock can be placed
  const collections = BLOCK_TO_COLLECTIONS.formBlock;

  if (!collections || collections.length === 0) {
    return pageResults;
  }

  // Process each collection in parallel
  const pageIdPromises = Array.from(new Set(collections))
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

        // Add published status filter only if collection has drafts enabled
        if (hasDrafts && !isSingleton) {
          whereCondition._status = {
            equals: 'published',
          };
        }

        const queryOptions: any = {
          collection: pageCollectionSlug,

          // need depth to get form relationship populated
          depth: 1,
          locale: 'all',
          where: whereCondition,
        };

        const pages = await payload.find(queryOptions);

        const collectionPageResults = await Promise.all(pages.docs.map(async (page: unknown) => {
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

          // check if page has formBlock with showPrivacyCheckbox: true
          const contentBlocks = pageRecord.content;

          if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) {
            return null;
          }

          const allBlocks = findBlocks(contentBlocks);

          // check if any formBlock references a form
          // with showPrivacyCheckbox: true
          const formBlockChecks = await Promise.all(allBlocks.map(async (block) => {
            if (!block || typeof block !== 'object') {
              return false;
            }

            const blockRecord = block as Record<string, unknown>;
            const {
              blockType, form,
            } = blockRecord;

            if (blockType !== 'formBlock' || !form) {
              return false;
            }

            // Extract form ID (could be string or populated object)
            let formId: string | undefined;

            if (typeof form === 'string') {
              formId = form;
            } else if (form && typeof form === 'object' && 'id' in form) {
              formId = String(form.id);
            }

            if (!formId) {
              return false;
            }

            try {
              // Fetch form document to check showPrivacyCheckbox
              // Forms are not localized, so we can fetch without locale
              const formDoc = await payload.findByID({
                collection: 'forms',
                depth: 0,
                id: formId,
              });

              if (!formDoc) {
                return false;
              }

              const formDocRecord = formDoc as Record<string, unknown>;
              const {
                showPrivacyCheckbox,
              } = formDocRecord;

              // Check if showPrivacyCheckbox is true (boolean checkbox field)
              return showPrivacyCheckbox === true;
            } catch {
              return false;
            }
          }));

          const hasFormBlockWithPrivacyCheckbox = formBlockChecks.some((check) => check === true);

          return hasFormBlockWithPrivacyCheckbox
            ? {
              collectionSlug: pageCollectionSlug,
              id: pageId,
            }
            : null;
        }));

        return collectionPageResults.filter((result): result is { id: string; collectionSlug: CollectionSlug } => result !== null);
      } catch {
        return [];
      }
    });

  const allPageResults = await Promise.all(pageIdPromises);

  return allPageResults.flat();
};

// Hook to invalidate cache when i18n globals change
export const hookInvalidateCacheOnI18nGlobalsChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  // skip cache invalidation during seed operations
  if (req.context?.skipCacheInvalidation) {
    return doc;
  }

  if (!doc || !req?.payload || operation !== 'update') {
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

  // clear invalidation cache at the start of the operation
  if (operation === 'update') {
    clearInvalidationCache();
  }

  const docRecord = doc as Record<string, unknown>;
  const previousDocRecord = previousDoc as Record<string, unknown> | undefined;

  // Find which fields changed
  const changedFields: string[] = [];

  Object.keys(I18N_FIELD_TO_USAGE)
    .forEach((fieldPath) => {
      if (hasFieldChanged(fieldPath, docRecord, previousDocRecord)) {
        changedFields.push(fieldPath);
      }
    });

  if (changedFields.length === 0) {
    return doc;
  }

  // process each changed field in parallel
  const pageInvalidationPromises = changedFields
    .filter((fieldPath) => I18N_FIELD_TO_USAGE[fieldPath])
    .map(async (fieldPath) => {
      const usage = I18N_FIELD_TO_USAGE[fieldPath];
      const fieldPagesToInvalidate: { id: string; collectionSlug: CollectionSlug }[] = [];

      // special handling for data privacy checkbox fields:
      // only invalidate pages with formBlock where the form
      // has showPrivacyCheckbox: true
      const isDataPrivacyCheckboxField = fieldPath === 'forms.dataPrivacyCheckbox.dataPrivacyCheckboxText' ||
        fieldPath === 'forms.dataPrivacyCheckbox.errorMessage';

      // handle block-based fields (skip generic handler for
      // data privacy checkbox fields)
      if (usage.blockTypes && usage.blockTypes.length > 0 && !isDataPrivacyCheckboxField) {
        const pagesWithBlocks = await findPagesWithBlocks({
          blockTypes: usage.blockTypes,
          payload: req.payload,
          tenantId,
        });

        fieldPagesToInvalidate.push(...pagesWithBlocks);
      }

      // handle page collection-based fields
      if (usage.pageCollections && usage.pageCollections.length > 0) {
        const pageCollectionPromises = usage.pageCollections.map(async (pageCollectionSlug) => {
          const isSingleton = singletonSlugs.some((singleton) => singleton.slug === pageCollectionSlug);
          const collectionConfig = req.payload.config.collections.find((c: any) => c.slug === pageCollectionSlug);
          const hasDrafts = Boolean(collectionConfig?.versions?.drafts);

          try {
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

            const pages = await req.payload.find({
              collection: pageCollectionSlug,
              depth: 0,
              limit: 0,
              locale: 'all',
              pagination: false,
              where: whereCondition,
            });

            const validPages = pages.docs
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

                return {
                  collectionSlug: pageCollectionSlug,
                  id: String(pageIdRaw),
                };
              })
              .filter((page): page is { id: string; collectionSlug: CollectionSlug } => page !== null);

            return validPages;
          } catch (error) {
            console.error(`Error finding pages in ${pageCollectionSlug} for i18n field ${fieldPath}:`, error);

            return [];
          }
        });

        const pageCollectionResults = await Promise.all(pageCollectionPromises);

        fieldPagesToInvalidate.push(...pageCollectionResults.flat());
      }

      // special handling for generic.time:
      // also invalidate pages with eventsTeasersBlock/eventsOverviewBlock
      if (fieldPath === 'generic.time') {
        const pagesWithEventBlocks = await findPagesWithProgrammaticBlocks({
          blockTypes: [
            'eventsTeasersBlock',
            'eventsOverviewBlock',
          ],
          payload: req.payload,
          tenantId,
        });

        // add pages with programmatic blocks to invalidation list
        fieldPagesToInvalidate.push(...pagesWithEventBlocks);
      }

      // special handling for data privacy checkbox fields:
      // only invalidate pages with formBlock where the form has
      // showPrivacyCheckbox: true
      if (isDataPrivacyCheckboxField) {
        const pagesWithPrivacyCheckboxForms = await findPagesWithFormBlocksWithPrivacyCheckbox({
          payload: req.payload,
          tenantId,
        });

        fieldPagesToInvalidate.push(...pagesWithPrivacyCheckboxForms);
      }

      return fieldPagesToInvalidate;
    });

  const allFieldPages = await Promise.all(pageInvalidationPromises);
  const pagesToInvalidate = allFieldPages.flat();

  // Invalidate all found pages
  if (pagesToInvalidate.length > 0) {
    await invalidatePagesWithDeduplication(pagesToInvalidate, allLocales, req.payload);
  }

  return doc;
};
