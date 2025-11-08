// Recursively build breadcrumbs by following the parent chain
// Returns breadcrumbs in root-to-leaf order

import { CollectionBeforeChangeHook } from 'payload';
import { fieldSlugFieldName } from '@/field-templates/slug';
import { fieldNavigationTitleFieldName } from '@/field-templates/navigationTitle';
import { fieldParentSelectorFieldName } from '@/field-templates/parentSelector';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';
import {
  Config, InterfaceBreadcrumb, InterfaceInternalLinkValue,
} from '@/payload-types';

type LocalizedString = Partial<Record<Config['locale'], string>>;

const buildBreadcrumbs = async (
  payload: any,
  parentRef: InterfaceInternalLinkValue | undefined,
  breadcrumbs: InterfaceBreadcrumb = [],
): Promise<InterfaceBreadcrumb> => {
  if (!parentRef) {
    return breadcrumbs;
  }

  if (!parentRef.slug || !parentRef.documentId) {
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
    const parentSlug = parentSlugRaw?.de;
    const parentNavigationTitleRaw = parentDoc[fieldNavigationTitleFieldName] as LocalizedString | undefined;
    const parentNavigationTitle = parentNavigationTitleRaw?.de;

    if (parentSlug && parentNavigationTitle && parentRef.documentId) {
      breadcrumbs?.unshift({
        documentId: parentRef.documentId,
        name: parentNavigationTitle,
        slug: parentSlug,
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

  const parentRef = data[fieldParentSelectorFieldName] as InterfaceInternalLinkValue | undefined;
  const breadcrumbs = await buildBreadcrumbs(req.payload, parentRef);

  return {
    ...data,
    [fieldBreadcrumbFieldName]: breadcrumbs,
  };
};

