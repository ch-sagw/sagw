import {
  BasePayload, CollectionAfterChangeHook,
  PayloadRequest,
} from 'payload';
import { fieldSlugFieldName } from '@/field-templates/slug';
import { fieldNavigationTitleFieldName } from '@/field-templates/navigationTitle';
import { fieldParentSelectorFieldName } from '@/field-templates/parentSelector';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';
import { buildBreadcrumbs } from '@/hooks-payload/generateBreadcrumbs';
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
): Promise<void> => {
  const whereClause: any = {
    and: [
      {
        [fieldParentSelectorFieldName]: {
          documentId: {
            equals: parentDocumentId,
          },
        },
      },
    ],
  };

  if (tenantId) {
    whereClause.and.push({
      tenant: {
        equals: tenantId,
      },
    });
  }

  const childPages = await payload.find({
    collection: [
      'detailPage',
      'overviewPage',
    ],
    depth: 0,
    limit: 0,
    locale: 'all',
    req,
    where: whereClause,
  });

  if (childPages.docs.length === 0) {
    return;
  }

  const updatePromises = childPages.docs.map(async (childPage: any) => {
    const childId = childPage.id;

    if (cascadeProcessingSet.has(childId)) {
      return;
    }

    try {
      cascadeProcessingSet.add(childId);
      const parentRef = childPage[fieldParentSelectorFieldName] as InterfaceInternalLinkValue | undefined;
      const breadcrumbs = await buildBreadcrumbs(payload, parentRef);

      const dbCollection = payload.db.collections['detailPage'];

      if (!dbCollection) {
        throw new Error('detailPage db collection not found');
      }

      await dbCollection.findByIdAndUpdate(
        childId,
        {
          $set: {
            [fieldBreadcrumbFieldName]: breadcrumbs,
          },
        },
        {
          new: false,
        },
      );

      await updateChildBreadcrumbs(payload, req, childId, tenantId);
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
  if (typeof parent === 'object' && 'documentId' in parent) {
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

  const oldSlug = previousDoc?.[fieldSlugFieldName];
  const oldNavigationTitle = previousDoc?.[fieldNavigationTitleFieldName];
  const oldParent = previousDoc?.[fieldParentSelectorFieldName];
  const oldBreadcrumb = previousDoc?.[fieldBreadcrumbFieldName];

  const slugChanged = hasLocalizedStringChanged(oldSlug, doc[fieldSlugFieldName]);
  const navigationTitleChanged = hasLocalizedStringChanged(oldNavigationTitle, doc[fieldNavigationTitleFieldName]);
  const parentChanged = getParentId(oldParent) !== getParentId(doc[fieldParentSelectorFieldName]);
  const breadcrumbChanged = JSON.stringify(oldBreadcrumb) !== JSON.stringify(doc[fieldBreadcrumbFieldName]);

  const onlyBreadcrumbChanged = breadcrumbChanged && !slugChanged && !navigationTitleChanged && !parentChanged;

  if (onlyBreadcrumbChanged || (!slugChanged && !navigationTitleChanged && !parentChanged)) {
    return doc;
  }

  const tenantId = typeof doc.tenant === 'string'
    ? doc.tenant
    : doc.tenant?.id;

  try {
    cascadeProcessingSet.add(docId);
    await updateChildBreadcrumbs(req.payload, req, docId, tenantId);
  } finally {
    cascadeProcessingSet.delete(docId);
  }

  return doc;
};
