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
import { fieldSlugFieldName } from '@/field-templates/slug';
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
  searchAllTenants = false,
): Promise<void> => {
  const availableCollections = linkableSlugs.map((item) => item.slug);

  // Find child pages in all linkable collections
  const childPagesPromises = availableCollections.map(async (collectionSlug) => {
    const dbCollection = payload.db.collections[collectionSlug];

    if (!dbCollection) {
      return [];
    }

    const query: any = {
      [`${fieldParentSelectorFieldName}.documentId`]: parentDocumentId,
    };

    if (!searchAllTenants && tenantId) {
      query.tenant = tenantId;
    }

    const docs = await dbCollection.find(query)
      .lean();

    return docs.map((doc: any) => ({
      ...doc,
      /* eslint-disable @typescript-eslint/naming-convention */
      _collection: collectionSlug,
      /* eslint-enable @typescript-eslint/naming-convention */
    }));
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
      // First check if it's a valid object with documentId
      if (
        childActualParentRef &&
        typeof childActualParentRef === 'object' &&
        'documentId' in childActualParentRef &&
        childActualParentRef.documentId &&
        deletedDocumentIds?.has(childActualParentRef.documentId)
      ) {
        // Child's parent is deleted - clear the parentPage field entirely
        shouldClearParentPage = true;

        // No parent, so breadcrumbs will be empty
        parentRef = undefined;
      } else if (
        childActualParentRef &&
        typeof childActualParentRef === 'object' &&
        'documentId' in childActualParentRef &&
        'slug' in childActualParentRef &&
        childActualParentRef.documentId &&
        childActualParentRef.slug
      ) {
        // Child's parent is not deleted and is valid,
        // use the child's actual parent reference
        parentRef = childActualParentRef as InterfaceInternalLinkValue;
      } else {
        // No parent reference (null, undefined, or empty object {})
        parentRef = undefined;
      }

      const breadcrumbs = await buildBreadcrumbs(payload, parentRef);
      const dbCollection = payload.db.collections[collectionSlug];

      if (!dbCollection) {
        throw new Error(`${collectionSlug} db collection not found`);
      }

      // Build the update object
      const updateData: any = {
        [fieldBreadcrumbFieldName]: breadcrumbs,
      };

      // If parent is deleted, clear the parentPage field by setting it
      // to an empty object
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

      await updateChildBreadcrumbs(payload, req, childId, tenantId, deletedDocumentIds, searchAllTenants);
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

  const oldSlug = previousDoc?.[fieldSlugFieldName];
  const oldNavigationTitle = previousDoc?.[fieldNavigationTitleFieldName];
  const oldParent = previousDoc?.[fieldParentSelectorFieldName];
  const oldBreadcrumb = previousDoc?.[fieldBreadcrumbFieldName];

  const slugChanged = hasLocalizedStringChanged(oldSlug, doc[fieldSlugFieldName]);
  const navigationTitleChanged = hasLocalizedStringChanged(oldNavigationTitle, doc[fieldNavigationTitleFieldName]);
  const parentChanged = getParentId(oldParent) !== getParentId(doc[fieldParentSelectorFieldName]);
  const breadcrumbChanged = JSON.stringify(oldBreadcrumb) !== JSON.stringify(doc[fieldBreadcrumbFieldName]);

  const onlyBreadcrumbChanged = breadcrumbChanged && !slugChanged && !navigationTitleChanged && !parentChanged && !statusChanged;

  // unpublishing logic
  if (isUnpublishing) {
    const tenantId = typeof doc.tenant === 'string'
      ? doc.tenant
      : doc.tenant?.id;

    try {
      cascadeProcessingSet.add(docId);

      const unpublishedDocumentIds = new Set<string>([docId]);

      await updateChildBreadcrumbs(req.payload, req, docId, tenantId, unpublishedDocumentIds, true);
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
    await updateChildBreadcrumbs(req.payload, req, docId, tenantId, undefined);
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

    const deletedDocumentIds = new Set<string>([docId]);

    await updateChildBreadcrumbs(req.payload, req, docId, tenantId, deletedDocumentIds, true);
  } finally {
    cascadeProcessingSet.delete(docId);
  }
};
