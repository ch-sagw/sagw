// Recursively build breadcrumbs by following the parent chain.
// Returns breadcrumbs in root-to-leaf order with all locales.

import type {
  BasePayload, CollectionSlug,
} from 'payload';
import { fieldNavigationTitleFieldName } from '@/field-templates/navigationTitle';
import { fieldParentSelectorFieldName } from '@/field-templates/parentSelector';
import {
  Config, InterfaceInternalLinkValue,
} from '@/payload-types';
import { homeSlug } from '@/collections/constants';

type LocalizedString = Partial<Record<Config['locale'], string | null>>;

export interface InterfaceBreadcrumbItem {
  documentId: string;
  name: LocalizedString;
  slug: LocalizedString;
  id?: string | null;
}

export type InterfaceBreadcrumb = InterfaceBreadcrumbItem[] | null;

const hasNonEmptyValue = ({
  localizedString,
}: {
  localizedString: LocalizedString | undefined;
}): boolean => {
  if (!localizedString || typeof localizedString !== 'object') {
    return false;
  }

  return Object.values(localizedString)
    .some((value) => value && value.trim().length > 0);
};

// Check if the first breadcrumb item has slug 'home' in any locale
const hasHomeAsFirstBreadcrumb = ({
  breadcrumbs,
}: {
  breadcrumbs: InterfaceBreadcrumb;
}): boolean => {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return false;
  }

  const [firstBreadcrumb] = breadcrumbs;

  if (!firstBreadcrumb) {
    return false;
  }

  return (
    firstBreadcrumb.slug.de === homeSlug ||
    firstBreadcrumb.slug.en === homeSlug ||
    firstBreadcrumb.slug.fr === homeSlug ||
    firstBreadcrumb.slug.it === homeSlug
  );
};

interface InterfaceBuildBreadcrumbsParams {
  breadcrumbs?: InterfaceBreadcrumb;
  excludedDocumentIds?: Set<string>;
  parentRef: InterfaceInternalLinkValue | undefined | null | Record<string, never>;
  payload: BasePayload;
}

export const buildBreadcrumbs = async ({
  breadcrumbs = [],
  excludedDocumentIds,
  parentRef,
  payload,
}: InterfaceBuildBreadcrumbsParams): Promise<InterfaceBreadcrumb> => {
  if (!parentRef || typeof parentRef !== 'object') {
    if (breadcrumbs && breadcrumbs.length > 0) {
      return hasHomeAsFirstBreadcrumb({
        breadcrumbs,
      })
        ? breadcrumbs
        : [];
    }

    return breadcrumbs;
  }

  if (Object.keys(parentRef).length === 0) {
    if (breadcrumbs && breadcrumbs.length > 0) {
      return hasHomeAsFirstBreadcrumb({
        breadcrumbs,
      })
        ? breadcrumbs
        : [];
    }

    return breadcrumbs;
  }

  if (!('slug' in parentRef) || !('documentId' in parentRef) || !parentRef.slug || !parentRef.documentId) {
    return breadcrumbs;
  }

  if (excludedDocumentIds?.has(String(parentRef.documentId))) {
    return [];
  }

  try {
    const parentDoc = await payload.findByID({
      collection: parentRef.slug as CollectionSlug,
      depth: 0,
      id: parentRef.documentId,
      locale: 'all',
    }) as unknown as Record<string, unknown>;

    const parentSlugRaw = parentDoc.slug as LocalizedString | undefined;
    const parentNavigationTitleRaw = parentDoc[fieldNavigationTitleFieldName] as LocalizedString | undefined;
    const parentStatus = parentDoc._status as string | undefined;

    // If current parent doesn't have navigationTitle, slug, or is an
    // unpublished draft, return empty array. This breaks the chain - all
    // descendants will have empty breadcrumbs.
    if (
      !hasNonEmptyValue({
        localizedString: parentSlugRaw,
      }) ||
      !hasNonEmptyValue({
        localizedString: parentNavigationTitleRaw,
      }) ||
      !parentRef.documentId ||
      parentStatus === 'draft'
    ) {
      return [];
    }

    const currentBreadcrumb: InterfaceBreadcrumbItem = {
      documentId: parentRef.documentId,
      name: {
        de: parentNavigationTitleRaw?.de || '',
        en: parentNavigationTitleRaw?.en || '',
        fr: parentNavigationTitleRaw?.fr || '',
        it: parentNavigationTitleRaw?.it || '',
      },
      slug: {
        de: parentSlugRaw?.de || '',
        en: parentSlugRaw?.en || '',
        fr: parentSlugRaw?.fr || '',
        it: parentSlugRaw?.it || '',
      },
    };

    const breadcrumbsArray = Array.isArray(breadcrumbs)
      ? breadcrumbs
      : [];
    const newBreadcrumbs = [
      currentBreadcrumb,
      ...breadcrumbsArray,
    ];

    const parentParentRef = parentDoc[fieldParentSelectorFieldName] as
      | InterfaceInternalLinkValue
      | undefined;

    const hasParent = parentParentRef &&
      typeof parentParentRef === 'object' &&
      Object.keys(parentParentRef).length > 0 &&
      'slug' in parentParentRef &&
      'documentId' in parentParentRef &&
      parentParentRef.slug &&
      parentParentRef.documentId;

    if (!hasParent) {
      if (!hasHomeAsFirstBreadcrumb({
        breadcrumbs: newBreadcrumbs,
      })) {
        return [];
      }

      return newBreadcrumbs;
    }

    const ancestorBreadcrumbs = await buildBreadcrumbs({
      excludedDocumentIds,
      parentRef: parentParentRef,
      payload,
    });

    if (!ancestorBreadcrumbs || ancestorBreadcrumbs.length === 0) {
      return [];
    }

    const ancestorArray = Array.isArray(ancestorBreadcrumbs)
      ? ancestorBreadcrumbs
      : [];

    const finalBreadcrumbs = [
      ...ancestorArray,
      ...newBreadcrumbs,
    ];

    if (!hasHomeAsFirstBreadcrumb({
      breadcrumbs: finalBreadcrumbs,
    })) {
      return [];
    }

    return finalBreadcrumbs;
  } catch (error) {
    console.error('Error building breadcrumbs:', error);
  }

  return [];
};

interface InterfaceBuildBreadcrumbsForDocParams {
  doc: Record<string, unknown> | null | undefined;
  excludedDocumentIds?: Set<string>;
  payload: BasePayload;
}

// Convenience helper: build breadcrumbs for a given page document by
// reading its parentPage reference.
export const buildBreadcrumbsForDoc = ({
  doc,
  excludedDocumentIds,
  payload,
}: InterfaceBuildBreadcrumbsForDocParams): Promise<InterfaceBreadcrumb> => {
  if (!doc) {
    return Promise.resolve([]);
  }

  const parentRef = doc[fieldParentSelectorFieldName] as
    | InterfaceInternalLinkValue
    | undefined
    | null
    | Record<string, never>;

  return buildBreadcrumbs({
    excludedDocumentIds,
    parentRef,
    payload,
  });
};
