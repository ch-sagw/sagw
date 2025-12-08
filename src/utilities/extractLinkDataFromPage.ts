import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';
import {
  Config, InterfaceBreadcrumb,
} from '@/payload-types';
import { DataFromCollectionSlug } from 'payload';

type LocalizedString = Partial<Record<Config['locale'], string>>;

export interface InterfaceLinkExtractedPageData {
  breadcrumb: InterfaceBreadcrumb | null;
  slug: LocalizedString;
  tenant: string | null;
}

export const extractLinkDataFromPage = ({
  pageData,
}: {
  pageData: DataFromCollectionSlug<any>
}): InterfaceLinkExtractedPageData | null => {
  const breadcrumb = pageData[fieldBreadcrumbFieldName] as InterfaceBreadcrumb | undefined;
  const slug = pageData.slug as LocalizedString | undefined;

  if (!slug || Object.keys(slug).length === 0) {
    console.warn('Page has no slug');

    return null;
  }

  // Extract tenant slug
  // If tenant is a string, it's an ID - we can't use it as slug, return null.
  // (... should not happen, since request depth is 1)
  // If tenant is populated as object, use its slug
  let tenantValue: string | null = null;
  const tenantField = pageData.tenant;

  if (tenantField && typeof tenantField === 'object' && 'slug' in tenantField) {
    // Tenant is populated - use slug
    tenantValue = tenantField.slug || null;
  }

  return {
    breadcrumb: breadcrumb || null,
    slug: slug || {},
    tenant: tenantValue,
  };
};
