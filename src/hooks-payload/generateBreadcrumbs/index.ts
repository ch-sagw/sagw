// Recursively build breadcrumbs by following the parent chain
// Returns breadcrumbs in root-to-leaf order with all locales

import { CollectionBeforeChangeHook } from 'payload';
import { fieldNavigationTitleFieldName } from '@/field-templates/navigationTitle';
import { fieldParentSelectorFieldName } from '@/field-templates/parentSelector';
import {
  BREADCRUMB_NAME_PREFIX, BREADCRUMB_SLUG_PREFIX, fieldBreadcrumbFieldName,
} from '@/field-templates/breadcrumb';
import {
  Config, InterfaceBreadcrumb, InterfaceInternalLinkValue,
} from '@/payload-types';
import { HOME_SLUG } from '@/collections/Pages/Singletons/Home';

type LocalizedString = Partial<Record<Config['locale'], string>>;

const hasNonEmptyValue = (localizedString: LocalizedString | undefined): boolean => {
  if (!localizedString || typeof localizedString !== 'object') {
    return false;
  }

  return Object.values(localizedString)
    .some((value) => value && value.trim().length > 0);
};

// Check if the first breadcrumb item has slug 'home' in any locale
const hasHomeAsFirstBreadcrumb = (breadcrumbs: InterfaceBreadcrumb): boolean => {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return false;
  }

  const [firstBreadcrumb] = breadcrumbs;

  if (!firstBreadcrumb) {
    return false;
  }

  // Check if any locale has slug 'home'
  return (
    firstBreadcrumb[`${BREADCRUMB_SLUG_PREFIX}de`] === HOME_SLUG ||
    firstBreadcrumb[`${BREADCRUMB_SLUG_PREFIX}en`] === HOME_SLUG ||
    firstBreadcrumb[`${BREADCRUMB_SLUG_PREFIX}fr`] === HOME_SLUG ||
    firstBreadcrumb[`${BREADCRUMB_SLUG_PREFIX}it`] === HOME_SLUG
  );
};

export const buildBreadcrumbs = async (
  payload: any,
  parentRef: InterfaceInternalLinkValue | undefined | null | Record<string, never>,
  breadcrumbs: InterfaceBreadcrumb = [],
  excludedDocumentIds?: Set<string>,
): Promise<InterfaceBreadcrumb> => {
  // Handle null, undefined, or invalid parentRef - we've reached the root
  if (!parentRef || typeof parentRef !== 'object') {
    // If we have breadcrumbs, validate they start with 'home'
    if (breadcrumbs && breadcrumbs.length > 0) {
      return hasHomeAsFirstBreadcrumb(breadcrumbs)
        ? breadcrumbs
        : [];
    }

    return breadcrumbs;
  }

  // Handle empty object - this means no parent is set (root)
  if (Object.keys(parentRef).length === 0) {
    // If we have breadcrumbs, validate they start with 'home'
    if (breadcrumbs && breadcrumbs.length > 0) {
      return hasHomeAsFirstBreadcrumb(breadcrumbs)
        ? breadcrumbs
        : [];
    }

    return breadcrumbs;
  }

  // Ensure parentRef has required properties (slug and documentId)
  if (!('slug' in parentRef) || !('documentId' in parentRef) || !parentRef.slug || !parentRef.documentId) {
    return breadcrumbs;
  }

  // Check if this document is excluded (unpublished/deleted)
  if (excludedDocumentIds?.has(String(parentRef.documentId))) {
    return [];
  }

  try {
    const parentDoc = await payload.findByID({
      collection: parentRef.slug,
      depth: 0,
      id: parentRef.documentId,
      locale: 'all',
    });

    const parentSlugRaw = parentDoc['slug'] as LocalizedString | undefined;
    const parentNavigationTitleRaw = parentDoc[fieldNavigationTitleFieldName] as LocalizedString | undefined;

    // If current parent doesn't have navigationTitle, return empty array
    // This breaks the chain - all descendants will have empty breadcrumbs
    if (!hasNonEmptyValue(parentSlugRaw) || !hasNonEmptyValue(parentNavigationTitleRaw) || !parentRef.documentId) {
      return [];
    }

    // Current parent has navigationTitle, add it to breadcrumbs
    const currentBreadcrumb = {
      documentId: parentRef.documentId,
      [`${BREADCRUMB_NAME_PREFIX}de`]: parentNavigationTitleRaw?.de || '',
      [`${BREADCRUMB_NAME_PREFIX}en`]: parentNavigationTitleRaw?.en || '',
      [`${BREADCRUMB_NAME_PREFIX}fr`]: parentNavigationTitleRaw?.fr || '',
      [`${BREADCRUMB_NAME_PREFIX}it`]: parentNavigationTitleRaw?.it || '',
      [`${BREADCRUMB_SLUG_PREFIX}de`]: parentSlugRaw?.de || '',
      [`${BREADCRUMB_SLUG_PREFIX}en`]: parentSlugRaw?.en || '',
      [`${BREADCRUMB_SLUG_PREFIX}fr`]: parentSlugRaw?.fr || '',
      [`${BREADCRUMB_SLUG_PREFIX}it`]: parentSlugRaw?.it || '',
    };

    const breadcrumbsArray = Array.isArray(breadcrumbs)
      ? breadcrumbs
      : [];
    const newBreadcrumbs = [
      currentBreadcrumb,
      ...breadcrumbsArray,
    ];

    // Recursively get the parent's parent
    const parentParentRef = parentDoc[fieldParentSelectorFieldName] as InterfaceInternalLinkValue | undefined;

    // Check if there's a parent to recurse to
    const hasParent = parentParentRef &&
      typeof parentParentRef === 'object' &&
      Object.keys(parentParentRef).length > 0 &&
      'slug' in parentParentRef &&
      'documentId' in parentParentRef &&
      parentParentRef.slug &&
      parentParentRef.documentId;

    if (!hasParent) {
      // We've reached the root, check if first breadcrumb is 'home'
      if (!hasHomeAsFirstBreadcrumb(newBreadcrumbs)) {
        return [];
      }

      return newBreadcrumbs;
    }

    // Recurse to get ancestors - pass excludedDocumentIds
    // so it checks ancestors too
    const ancestorBreadcrumbs = await buildBreadcrumbs(payload, parentParentRef, [], excludedDocumentIds);

    // If ancestors returned empty array, that means we hit a missing
    // navigationTitle up the chain or the chain doesn't start with 'home'
    if (!ancestorBreadcrumbs || ancestorBreadcrumbs.length === 0) {
      return [];
    }

    // Combine ancestor breadcrumbs with current breadcrumbs
    const ancestorArray = Array.isArray(ancestorBreadcrumbs)
      ? ancestorBreadcrumbs
      : [];

    const finalBreadcrumbs = [
      ...ancestorArray,
      ...newBreadcrumbs,
    ];

    // Check if first breadcrumb is 'home'
    if (!hasHomeAsFirstBreadcrumb(finalBreadcrumbs)) {
      return [];
    }

    return finalBreadcrumbs;
  } catch (error) {
    console.error('Error building breadcrumbs:', error);
  }

  // If we couldn't fetch the parent or there was an error, return empty
  // This ensures we don't have partial breadcrumbs
  return [];
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
  const existingBreadcrumbs = data[fieldBreadcrumbFieldName];
  const hasBreadcrumbs = existingBreadcrumbs && Array.isArray(existingBreadcrumbs) && existingBreadcrumbs.length > 0;
  const parentChanged = newParentId !== oldParentId;

  // If parent hasn't changed but we have breadcrumbs,
  // validate they start with 'home'
  if (!parentChanged && hasBreadcrumbs) {
    if (!hasHomeAsFirstBreadcrumb(existingBreadcrumbs)) {
      // Existing breadcrumbs don't start with 'home', clear them
      return {
        ...data,
        [fieldBreadcrumbFieldName]: [],
      };
    }

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

