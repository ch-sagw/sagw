// Recursively build breadcrumbs by following the parent chain
// Returns breadcrumbs in root-to-leaf order with all locales

import { CollectionBeforeChangeHook } from 'payload';
import { fieldSlugFieldName } from '@/field-templates/slug';
import { fieldNavigationTitleFieldName } from '@/field-templates/navigationTitle';
import { fieldParentSelectorFieldName } from '@/field-templates/parentSelector';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';
import {
  Config, InterfaceBreadcrumb, InterfaceInternalLinkValue,
} from '@/payload-types';

type LocalizedString = Partial<Record<Config['locale'], string>>;

export const buildBreadcrumbs = async (
  payload: any,
  parentRef: InterfaceInternalLinkValue | undefined | null | Record<string, never>,
  breadcrumbs: InterfaceBreadcrumb = [],
): Promise<InterfaceBreadcrumb> => {
  // Handle null, undefined, or invalid parentRef
  if (!parentRef || typeof parentRef !== 'object') {
    return breadcrumbs;
  }

  // Handle empty object {} - this means no parent is set
  if (Object.keys(parentRef).length === 0) {
    return breadcrumbs;
  }

  // Ensure parentRef has required properties (slug and documentId)
  if (!('slug' in parentRef) || !('documentId' in parentRef) || !parentRef.slug || !parentRef.documentId) {
    return breadcrumbs;
  }

  try {
    const parentDoc = await payload.findByID({
      collection: parentRef.slug,
      depth: 0,
      id: parentRef.documentId,
      locale: 'all',
    });

    const parentSlugRaw = parentDoc[fieldSlugFieldName] as LocalizedString | undefined;
    const parentNavigationTitleRaw = parentDoc[fieldNavigationTitleFieldName] as LocalizedString | undefined;

    if (parentSlugRaw && parentNavigationTitleRaw && parentRef.documentId) {
      breadcrumbs?.unshift({
        documentId: parentRef.documentId,
        namede: parentNavigationTitleRaw.de || '',
        nameen: parentNavigationTitleRaw.en || '',
        namefr: parentNavigationTitleRaw.fr || '',
        nameit: parentNavigationTitleRaw.it || '',
        slugde: parentSlugRaw.de || '',
        slugen: parentSlugRaw.en || '',
        slugfr: parentSlugRaw.fr || '',
        slugit: parentSlugRaw.it || '',
      });

      // Recursively get the parent's parent
      const parentParentRef = parentDoc[fieldParentSelectorFieldName] as InterfaceInternalLinkValue | undefined;

      return buildBreadcrumbs(payload, parentParentRef, breadcrumbs);
    }
  } catch (error) {
    console.error('Error building breadcrumbs:', error);
  }

  return breadcrumbs;
};

export const hookGenerateBreadcrumbs: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!data || !req?.payload) {
    return data;
  }

  if (![
    'create',
    'update',
  ].includes(operation)) {
    return data;
  }

  // Get parent IDs for comparison, handling empty objects, null, and undefined
  const getParentDocumentId = (parent: any): string | undefined => {
    if (!parent || typeof parent !== 'object') {
      return undefined;
    }

    if (Object.keys(parent).length === 0) {
      return undefined;
    }

    if ('documentId' in parent && parent.documentId) {
      return String(parent.documentId);
    }

    return undefined;
  };

  const newParentId = getParentDocumentId(data[fieldParentSelectorFieldName]);
  const oldParentId = getParentDocumentId(originalDoc?.[fieldParentSelectorFieldName]);
  const hasBreadcrumbs = data[fieldBreadcrumbFieldName] && Array.isArray(data[fieldBreadcrumbFieldName]) && data[fieldBreadcrumbFieldName].length > 0;
  const parentChanged = newParentId !== oldParentId;

  if (!parentChanged && hasBreadcrumbs) {
    return data;
  }

  if (newParentId || parentChanged) {
    const parentRef = data[fieldParentSelectorFieldName] as InterfaceInternalLinkValue | undefined;
    const breadcrumbs = await buildBreadcrumbs(req.payload, parentRef);

    return {
      ...data,
      [fieldBreadcrumbFieldName]: breadcrumbs,
    };
  }

  // No parent and no change - clear breadcrumbs
  return {
    ...data,
    [fieldBreadcrumbFieldName]: [],
  };
};

