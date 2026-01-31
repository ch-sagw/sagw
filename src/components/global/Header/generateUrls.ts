import {
  InterfaceHeaderMetaNavigation,
  InterfaceHeaderNavigation,
} from '@/payload-types';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import { getRootPathUrls } from '@/hooks-payload/shared/getRootPathUrls';

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
}

// generate URL map for current page in all locales for langnav
export const generateLangNavUrls = async ({
  pageId,
  payload,
}: InterfaceGenerateLangNavUrlsParams): Promise<Record<string, string>> => {
  const localeCodes = getLocaleCodes();
  const rootUrls = getRootPathUrls();
  const urlMap: Record<string, string> = {};

  await Promise.all(localeCodes.map(async (targetLocale) => {
    if (!pageId) {
      urlMap[targetLocale] = rootUrls[targetLocale] || `/${targetLocale}`;

      return;
    }

    try {
      const url = await getPageUrl({
        locale: targetLocale as TypedLocale,
        pageId,
        payload,
      });

      urlMap[targetLocale] = url || rootUrls[targetLocale] || `/${targetLocale}`;
    } catch {
      urlMap[targetLocale] = rootUrls[targetLocale] || `/${targetLocale}`;
    }
  }));

  return urlMap;
};

