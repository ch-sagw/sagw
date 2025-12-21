/*
This hook handles changes regarding the following fields of a page:
- parentPage
- navigationTitle
- slug

Additionally, it handles publish/unpublish state and deletion of a page.

It cascades these changes down the navigation tree by changing/regenarating
the navigationTitle and parentPage field of direct and indirect children.
*/

import {
  BasePayload, CollectionAfterChangeHook, CollectionAfterDeleteHook,
  PayloadRequest,
} from 'payload';
import { fieldNavigationTitleFieldName } from '@/field-templates/navigationTitle';
import { fieldParentSelectorFieldName } from '@/field-templates/parentSelector';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';
import { buildBreadcrumbs } from '@/hooks-payload/generateBreadcrumbs';
import { linkableSlugs } from '@/collections/Pages/pages';
import {
  Config, InterfaceInternalLinkValue,
} from '@/payload-types';

type LocalizedString = Partial<Record<Config['locale'], string>>;

const cascadeProcessingSet = new Set<string>();

const hasLocalizedStringChanged = (
  oldValue: string | LocalizedString | undefined,
  newValue: string | LocalizedString | undefined,
): boolean => JSON.stringify(oldValue) !== JSON.stringify(newValue);

const updateChildBreadcrumbs = async (
  payload: BasePayload,
  req: PayloadRequest,
  parentDocumentId: string,
  tenantId: string | undefined,
  deletedDocumentIds?: Set<string>,
  effectiveDeletedIds?: Set<string>,
  isDraftUpdate?: boolean,
): Promise<void> => {
  // effectiveDeletedIds tracks all IDs that should be treated as
  // deleted/unpublished
  // this includes the original deletedDocumentIds plus any
  // children whose parentPage was cleared
  // for draft updates, we use deletedDocumentIds
  // for breadcrumb exclusion but don't clear parentPage
  const effectiveIds = effectiveDeletedIds || new Set<string>(deletedDocumentIds || []);

  const availableCollections = linkableSlugs.map((item) => item.slug);

  // Find child pages in all linkable collections
  const childPagesPromises = availableCollections.map(async (collectionSlug) => {
    const dbCollection = payload.db.collections[collectionSlug];

    if (!dbCollection) {
      return [];
    }

    if (!tenantId) {
      return [];
    }

    const query: any = {
      [`${fieldParentSelectorFieldName}.documentId`]: parentDocumentId,
      tenant: tenantId,
    };

    const docs = await dbCollection.find(query);

    return docs.map((doc: any) => {
      // Convert Mongoose document to plain object, preserving all fields
      const plainDoc = doc.toObject
        ? doc.toObject()
        : {
          ...doc,
        };

      return {
        ...plainDoc,
        /* eslint-disable @typescript-eslint/naming-convention */
        _collection: collectionSlug,
        /* eslint-enable @typescript-eslint/naming-convention */
      };
    });
  });

  const childPagesArrays = await Promise.all(childPagesPromises);
  const childPages = childPagesArrays.flat();

  if (childPages.length === 0) {
    return;
  }

  const updatePromises = childPages.map(async (childPage: any) => {
    const childId = childPage._id?.toString() || childPage.id?.toString();
    const collectionSlug = childPage._collection;

    if (!childId || !collectionSlug) {
      return;
    }

    if (cascadeProcessingSet.has(childId)) {
      return;
    }

    try {
      cascadeProcessingSet.add(childId);

      const childActualParentRef = childPage[fieldParentSelectorFieldName] as InterfaceInternalLinkValue | undefined | null | Record<string, never>;
      let parentRef: InterfaceInternalLinkValue | undefined | null | Record<string, never>;
      let shouldClearParentPage = false;

      // Check if parent exists and is deleted
      const hasDocumentId = childActualParentRef &&
        typeof childActualParentRef === 'object' &&
        'documentId' in childActualParentRef &&
        childActualParentRef.documentId;

      const isParentDeleted = hasDocumentId && effectiveIds.has(String(childActualParentRef.documentId));
      // For draft updates, don't clear parentPage even if parent
      // is in deletedDocumentIds. deletedDocumentIds is used only for
      // breadcrumb exclusion, not for clearing parentPage
      const shouldClearParentPageField = isParentDeleted && !isDraftUpdate;

      if (hasDocumentId && shouldClearParentPageField) {
        // child's parent is deleted/unpublished - clear the parentPage
        shouldClearParentPage = true;

        // add this child to effectiveDeletedIds so its children will be cleared
        effectiveIds.add(childId);

        parentRef = undefined;
      } else if (hasDocumentId && isParentDeleted) {
        // parent is draft/unpublished - clear breadcrumbs but preserve
        // parentPage. pass undefined so breadcrumbs are cleared
        // via buildBreadcrumbs exclusion
        parentRef = childActualParentRef as InterfaceInternalLinkValue;
      } else if (hasDocumentId) {
        // child's parent is not deleted and has documentId. use the child's
        // actual parent reference (slug may not be populated in DB)
        parentRef = childActualParentRef as InterfaceInternalLinkValue;
      } else {
        // No parent reference (null, undefined, or empty object {})
        parentRef = undefined;
      }

      const breadcrumbs = await buildBreadcrumbs(payload, parentRef, [], effectiveIds);
      const dbCollection = payload.db.collections[collectionSlug];

      if (!dbCollection) {
        throw new Error(`${collectionSlug} db collection not found`);
      }

      // Build the update object - ONLY update breadcrumb
      // Do NOT touch parentPage unless we're explicitly clearing it
      const updateData: any = {
        [fieldBreadcrumbFieldName]: breadcrumbs,
      };

      if (shouldClearParentPage) {
        updateData[fieldParentSelectorFieldName] = {};
      }

      await dbCollection.findByIdAndUpdate(
        childId,
        {
          $set: updateData,
        },
        {
          new: false,
        },
      );

      await updateChildBreadcrumbs(payload, req, childId, tenantId, deletedDocumentIds, effectiveIds, isDraftUpdate);
    } finally {
      cascadeProcessingSet.delete(childId);
    }
  });

  await Promise.all(updatePromises);
};

const getParentId = (parent: any): string | undefined => {
  if (!parent) {
    return undefined;
  }
  // Handle empty object {} - treat as no parent
  if (typeof parent === 'object' && Object.keys(parent).length === 0) {
    return undefined;
  }
  if (typeof parent === 'object' && 'documentId' in parent && parent.documentId) {
    return parent.documentId;
  }

  return parent;
};

export const hookCascadeBreadcrumbUpdates: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
  context,
  collection,
}) => {
  if (!doc || !req?.payload || operation !== 'update') {
    return doc;
  }

  const docId = doc.id;

  if (cascadeProcessingSet.has(docId) || context?.cascadeBreadcrumbUpdate) {
    return doc;
  }

  const oldStatus = previousDoc?._status;
  const newStatus = doc._status;
  const statusChanged = oldStatus !== newStatus;
  const wasPublished = oldStatus === 'published';
  const isUnpublished = newStatus === 'draft' || newStatus === null;
  const isUnpublishing = wasPublished && isUnpublished;

  // Fetch the full document from DB to get complete localized objects
  // IMPORTANT: previousDoc already contains the state before the update,
  // so we use it directly
  let fullDoc: any;
  let fullPreviousDoc: any = previousDoc;

  const collectionSlug = collection?.slug;

  try {
    if (collectionSlug) {
      // fetch the new state (after update) with all locales
      fullDoc = await req.payload.findByID({
        collection: collectionSlug,
        depth: 0,
        id: docId,
        locale: 'all',
      });

      // Use previousDoc directly
      fullPreviousDoc = previousDoc;
    } else {
      fullDoc = doc;
      fullPreviousDoc = previousDoc;
    }
  } catch (error) {
    console.error('[hookCascadeBreadcrumbUpdates] Error fetching full document:', error);
    // Fallback to using doc/previousDoc if fetch fails
    fullDoc = doc;
    fullPreviousDoc = previousDoc;
  }

  // Use the full documents if available, otherwise fallback to doc/previousDoc
  const docToUse = fullDoc || doc;
  const previousDocToUse = fullPreviousDoc || previousDoc;

  const oldSlug = previousDocToUse?.['slug'];
  const oldNavigationTitle = previousDocToUse?.[fieldNavigationTitleFieldName];
  const oldParent = previousDocToUse?.[fieldParentSelectorFieldName];
  const oldBreadcrumb = previousDocToUse?.[fieldBreadcrumbFieldName];

  // check if new locales were added
  // (even if values are the same, adding a locale is a change)
  const oldSlugKeys = oldSlug && typeof oldSlug === 'object'
    ? Object.keys(oldSlug)
    : [];
  const newSlugKeys = docToUse['slug'] && typeof docToUse['slug'] === 'object'
    ? Object.keys(docToUse['slug'])
    : [];
  const oldNavTitleKeys = oldNavigationTitle && typeof oldNavigationTitle === 'object'
    ? Object.keys(oldNavigationTitle)
    : [];
  const newNavTitleKeys = docToUse[fieldNavigationTitleFieldName] && typeof docToUse[fieldNavigationTitleFieldName] === 'object'
    ? Object.keys(docToUse[fieldNavigationTitleFieldName])
    : [];
  const newSlugLocales = newSlugKeys.filter((key) => !oldSlugKeys.includes(key));
  const newNavTitleLocales = newNavTitleKeys.filter((key) => !oldNavTitleKeys.includes(key));

  const slugChanged = hasLocalizedStringChanged(oldSlug, docToUse['slug']) || newSlugLocales.length > 0;
  const navigationTitleChanged = hasLocalizedStringChanged(oldNavigationTitle, docToUse[fieldNavigationTitleFieldName]) || newNavTitleLocales.length > 0;
  const parentChanged = getParentId(oldParent) !== getParentId(docToUse[fieldParentSelectorFieldName]);
  const breadcrumbChanged = JSON.stringify(oldBreadcrumb) !== JSON.stringify(docToUse[fieldBreadcrumbFieldName]);

  const onlyBreadcrumbChanged = breadcrumbChanged && !slugChanged && !navigationTitleChanged && !parentChanged && !statusChanged;

  // Check if there are content changes (not just status change)
  // This helps distinguish between explicit unpublish vs auto-save
  // We check if ANY field changed besides status, updatedAt, createdAt, id
  // This includes content blocks, navigationTitle, slug,
  // parentPage, breadcrumb, etc.
  const hasContentChanges = slugChanged || navigationTitleChanged || parentChanged || breadcrumbChanged ||
    (previousDoc && Object.keys(doc)
      .some((key) => {
      // Skip system fields and status
        if (key === '_status' || key === 'updatedAt' || key === 'createdAt' || key === 'id' || key === '_id') {
          return false;
        }

        // Check if field value changed
        return JSON.stringify(previousDoc[key]) !== JSON.stringify(doc[key]);
      }));

  // If isUnpublishing but hasContentChanges, treat as draft update (auto-save)
  // This preserves parentPage while clearing breadcrumbs
  const isAutoSave = isUnpublishing && hasContentChanges;

  // unpublishing logic - when unpublishing (published -> draft),
  // BUT: if there are content changes, this is likely auto-save,
  // not explicit unpublish
  // For auto-save: preserve parentPage (treat as draft update)
  // For explicit unpublish: clear children's parentPage
  if (isUnpublishing && !hasContentChanges) {
    const tenantId = typeof doc.tenant === 'string'
      ? doc.tenant
      : doc.tenant?.id;

    try {
      cascadeProcessingSet.add(docId);

      const unpublishedDocumentIds = new Set<string>([String(docId)]);

      await updateChildBreadcrumbs(req.payload, req, docId, tenantId, unpublishedDocumentIds, undefined, false);
    } finally {
      cascadeProcessingSet.delete(docId);
    }

    return doc;
  }

  // for draft documents OR auto-save (published -> draft with content changes):
  // cascade breadcrumb updates but don't clear parentPage
  // draft documents should be excluded from breadcrumbs
  // (children's breadcrumbs cleared) but parentPage should remain intact
  // Note: isAutoSave means isUnpublishing=true but hasContentChanges=true,
  // so we treat it as draft update
  if (isUnpublished || isAutoSave) {
    const tenantId = typeof doc.tenant === 'string'
      ? doc.tenant
      : doc.tenant?.id;

    try {
      cascadeProcessingSet.add(docId);

      // pass the draft document ID in deletedDocumentIds so breadcrumbs
      // are cleared. Pass isDraftUpdate=true so parentPage is preserved
      const draftDocumentIds = new Set<string>([String(docId)]);

      await updateChildBreadcrumbs(req.payload, req, docId, tenantId, draftDocumentIds, undefined, true);
    } finally {
      cascadeProcessingSet.delete(docId);
    }

    return doc;
  }

  // nothing changed, return
  if (onlyBreadcrumbChanged || (!slugChanged && !navigationTitleChanged && !parentChanged && !statusChanged)) {
    return doc;
  }

  const tenantId = typeof doc.tenant === 'string'
    ? doc.tenant
    : doc.tenant?.id;

  // regular update logic
  try {
    cascadeProcessingSet.add(docId);
    await updateChildBreadcrumbs(req.payload, req, docId, tenantId, undefined, undefined, false);
  } finally {
    cascadeProcessingSet.delete(docId);
  }

  return doc;
};

export const hookCascadeBreadcrumbUpdatesOnDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
  id,
}) => {
  if (!doc || !req?.payload) {
    return;
  }

  const docId = id?.toString() || doc.id?.toString();

  if (!docId || cascadeProcessingSet.has(docId)) {
    return;
  }

  const tenantId = typeof doc.tenant === 'string'
    ? doc.tenant
    : doc.tenant?.id;

  try {
    cascadeProcessingSet.add(docId);

    const deletedDocumentIds = new Set<string>([String(docId)]);

    await updateChildBreadcrumbs(req.payload, req, docId, tenantId, deletedDocumentIds, undefined, false);
  } finally {
    cascadeProcessingSet.delete(docId);
  }
};
