import {
  type Config,
  InterfaceHeaderMetaNavigation,
  InterfaceHeaderNavigation,
} from '@/payload-types';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import { getTenantHomeUrl } from '@/utilities/tenant';

interface InterfaceExtractLinkIdsParams {
  navigation: InterfaceHeaderNavigation;
  metanav: InterfaceHeaderMetaNavigation;
  options?: {
    includeMainNavItems?: boolean;
  };
}

// extract all internal link documentIds from navigation (and metanav)
export const extractLinkIds = ({
  navigation,
  metanav,
  options,
}: InterfaceExtractLinkIdsParams): string[] => {
  const linkIds: string[] = [];
  const includeMainNavItems = options?.includeMainNavItems ?? true;

  // nav items
  navigation.navItems.forEach((item) => {
    // main nav item
    if (includeMainNavItems && item.navItemLink?.documentId) {
      linkIds.push(item.navItemLink.documentId);
    }

    // sub nav items
    item.subNavItems?.forEach((subItem) => {
      if (subItem.navItemLink?.documentId) {
        linkIds.push(subItem.navItemLink.documentId);
      }
    });
  });

  // metanav item (should be external. just in case)
  metanav.metaLinks?.forEach((item) => {
    if (item.linkType === 'internal' && item.linkInternal?.internalLink?.documentId) {
      linkIds.push(item.linkInternal.internalLink.documentId);
    }
  });

  return linkIds;
};

interface InterfaceGenerateLinkUrlsParams {
  navigation: InterfaceHeaderNavigation;
  metanav: InterfaceHeaderMetaNavigation;
  locale: TypedLocale;
  payload: Awaited<ReturnType<typeof getPayloadCached>>;
  options?: {
    includeMainNavItems?: boolean;
  };
}

// Generate URL map for all links
export const generateLinkUrls = async ({
  navigation,
  metanav,
  locale,
  payload,
  options,
}: InterfaceGenerateLinkUrlsParams): Promise<Record<string, string>> => {
  const linkIds = extractLinkIds({
    metanav,
    navigation,
    options,
  });
  const uniqueLinkIds = [...new Set(linkIds)];

  const urlMap: Record<string, string> = {};

  await Promise.all(uniqueLinkIds.map(async (documentId) => {
    const url = await getPageUrl({
      locale,
      pageId: documentId,
      payload,
    });

    urlMap[documentId] = url;
  }));

  return urlMap;
};

interface InterfaceGenerateLangNavUrlsParams {
  pageId: string;
  payload: Awaited<ReturnType<typeof getPayloadCached>>;
  tenantSlug?: string;

  // When set, only these locale URLs are computed (e.g. tenant-enabled
  // languages). Defaults to all configured locales.
  locales?: Config['locale'][];
}

// generate URL map for current page in all locales for langnav.
// when no translation exists for a locale, falls back to the
// current tenant's home URL in that locale
export const generateLangNavUrls = async ({
  locales,
  pageId,
  payload,
  tenantSlug,
}: InterfaceGenerateLangNavUrlsParams): Promise<Record<string, string>> => {
  const localeCodes = locales?.length
    ? locales
    : getLocaleCodes();
  const urlMap: Record<string, string> = {};

  await Promise.all(localeCodes.map(async (targetLocale) => {
    const fallback = getTenantHomeUrl({
      locale: targetLocale as TypedLocale,
      tenantSlug,
    });

    if (!pageId) {
      urlMap[targetLocale] = fallback;

      return;
    }

    try {
      const url = await getPageUrl({
        locale: targetLocale as TypedLocale,
        pageId,
        payload,
      });

      urlMap[targetLocale] = url || fallback;
    } catch {
      urlMap[targetLocale] = fallback;
    }
  }));

  return urlMap;
};

