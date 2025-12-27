// hook to update link references when i18nGlobals dataPrivacyCheckboxText
// changes
// When the data-privacy checkbox text is updated, we need to update link
// references for all pages that use forms with showPrivacyCheckbox enabled

import type {
  BasePayload, CollectionAfterChangeHook, CollectionSlug, TypedLocale,
} from 'payload';
import {
  globalCollectionsSlugs, setsSlugs, singletonSlugs,
} from '@/collections/Pages/constants';
import { extractAllLinkIds } from '@/hooks-payload/shared/extractAllLinkIds';
import { extractID } from '@/utilities/extractId';
import { updateLinkReferences } from '@/components/global/Header/updateLinkReferences';

const findPagesWithPrivacyCheckboxForms = async ({
  locale,
  payload,
  tenantId,
}: {
  locale: TypedLocale;
  payload: BasePayload;
  tenantId: string;
}): Promise<{ id: string; collectionSlug: CollectionSlug }[]> => {
  const pagesWithForms: { id: string; collectionSlug: CollectionSlug }[] = [];

  try {
    // Find all forms with showPrivacyCheckbox enabled for this tenant
    const formsWithPrivacyCheckbox = await payload.find({
      collection: 'forms',
      depth: 0,
      limit: 0,
      locale,
      pagination: false,
      where: {
        and: [
          {
            showPrivacyCheckbox: {
              equals: true,
            },
          },
          {
            tenant: {
              equals: tenantId,
            },
          },
        ],
      },
    });

    if (formsWithPrivacyCheckbox.docs.length === 0) {
      return pagesWithForms;
    }

    const formIds = formsWithPrivacyCheckbox.docs.map((form: { id: string }) => form.id);

    const allPageCollections = [
      ...singletonSlugs,
      ...setsSlugs,
    ];

    // search each page collection for formBlocks referencing these forms
    await Promise.all(allPageCollections.map(async (pageConfig) => {
      try {
        const pages = await payload.find({
          collection: pageConfig.slug,
          depth: 0,
          limit: 0,
          locale,
          pagination: false,
          where: {
            tenant: {
              equals: tenantId,
            },
          },
        });

        // Check each page for formBlocks
        pages.docs.forEach((page) => {
          const pageRecord = page as unknown as Record<string, unknown>;
          const pageId = pageRecord.id as string;

          if (!pageId) {
            return;
          }

          // Check if page has content blocks
          // (some pages use 'content', others use 'blocks.content')
          const contentBlocks = pageRecord.content || (pageRecord.blocks && (pageRecord.blocks as Record<string, unknown>).content);

          if (Array.isArray(contentBlocks)) {
            // Check if any block is a formBlock referencing one of our forms
            const hasMatchingFormBlock = contentBlocks.some((block: Record<string, unknown>) => {
              if (block.blockType === 'formBlock' && block.form) {
                const formRef = block.form;
                let formId: string | null = null;

                if (typeof formRef === 'string') {
                  formId = formRef;
                } else if (formRef && typeof formRef === 'object' && 'id' in formRef) {
                  formId = String(formRef.id);
                }

                return formId && formIds.includes(formId);
              }

              return false;
            });

            if (hasMatchingFormBlock) {
              pagesWithForms.push({
                collectionSlug: pageConfig.slug,
                id: pageId,
              });
            }
          }
        });
      } catch (error) {
        console.error(`Error searching ${pageConfig.slug} for formBlocks:`, error);
      }
    }));
  } catch (error) {
    console.error('Error finding pages with privacy checkbox forms:', error);
  }

  return pagesWithForms;
};

export const hookUpdateLinkReferencesOnI18nGlobalsChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
  collection,
  context,
}) => {
  // Prevent infinite loops
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

  if (collectionSlug !== 'i18nGlobals') {
    return doc;
  }

  // Check if dataPrivacyCheckboxText changed
  const currentDataPrivacyText = doc.forms?.dataPrivacyCheckbox?.dataPrivacyCheckboxText;
  const previousDataPrivacyText = previousDoc?.forms?.dataPrivacyCheckbox?.dataPrivacyCheckboxText;

  const dataPrivacyTextChanged = JSON.stringify(currentDataPrivacyText) !== JSON.stringify(previousDataPrivacyText);

  if (!dataPrivacyTextChanged) {
    return doc;
  }

  try {
    // Extract tenant and locale
    let tenantId: string | undefined;

    if ('tenant' in doc && doc.tenant) {
      const extractedId = extractID(doc.tenant);

      if (typeof extractedId === 'string') {
        tenantId = extractedId;
      }
    }

    if (!tenantId) {
      return doc;
    }

    // Get locale from request, fallback to 'de'
    const locale = (req.locale as TypedLocale) || 'de';

    // Find all pages that use forms with showPrivacyCheckbox enabled
    const pagesWithForms = await findPagesWithPrivacyCheckboxForms({
      locale,
      payload: req.payload,
      tenantId,
    });

    // Update link references for each page using the existing utility
    await Promise.all(pagesWithForms.map(async (page) => {
      try {
        // Fetch the current page document
        const pageDoc = await req.payload.findByID({
          collection: page.collectionSlug,
          depth: 0,
          id: page.id,
          locale,
        });

        if (!pageDoc) {
          return;
        }

        // Check if page is published (singletons/globals are always published)
        const isSingleton = singletonSlugs.some((singleton) => singleton.slug === page.collectionSlug);
        const isGlobal = globalCollectionsSlugs.some((global) => global.slug === page.collectionSlug);
        const pageDocRecord = pageDoc as unknown as Record<string, unknown>;
        const isPublished = isSingleton || isGlobal || pageDocRecord._status === 'published';

        if (!isPublished) {
          return;
        }

        // Extract all link IDs from the current page (with updated i18nGlobals)
        const extractionContext = {
          collectionSlug: page.collectionSlug,
          currentPageId: page.id,
          locale,
          payload: req.payload,
          tenant: tenantId,
        };

        const linkIds = await extractAllLinkIds({
          context: extractionContext,
          doc: pageDocRecord,
        });

        // Reuse the existing updateLinkReferences utility
        await updateLinkReferences({
          docId: page.id,
          linkIds,
        });
      } catch (error) {
        console.error(`Error updating link references for page ${page.id}:`, error);
      }
    }));
  } catch (error) {
    console.error('Error updating link references on i18nGlobals change:', error);
  }

  return doc;
};
