import { fetchOtherPagesData } from '@/app/(frontend)/fetchers/otherPages';
import { fetchHomePageData } from '@/app/(frontend)/fetchers/home';
import {
  getTenantFromUrl, InterfaceGetTenantFromUrlResult,
} from '@/app/(frontend)/utilities/getTenantFromUrl';
import {
  InterfacePreFetchedHomePageData, InterfacePreFetchedOtherPageData,
} from '../renderers/RenderPage';
import { TypedLocale } from 'payload';

export const getPageData = async ({
  locale,
  slug,
}: {
  locale: TypedLocale;
  slug: string[];
}): Promise<{
  isHome: boolean;
  pageData: InterfacePreFetchedHomePageData | InterfacePreFetchedOtherPageData;
  tenantInfo: InterfaceGetTenantFromUrlResult;
} | undefined> => {
  let isHome = false;

  // check if first segment is a tenant
  const [firstSegment] = slug;
  let tenantInfo = await getTenantFromUrl(firstSegment, locale);

  // if first segment is a tenant (non-SAGW)
  if (!tenantInfo.isSagw && tenantInfo.tenantId) {

    // ----------------
    // NON-SAGW HOME
    // ----------------
    if (slug.length === 1) {
      const homepageData = await fetchHomePageData({
        locale,
        tenantId: tenantInfo.tenantId,
      });

      isHome = true;

      if (!homepageData) {
        return undefined;
      }

      return {
        isHome,
        pageData: homepageData,
        tenantInfo,
      };
    }

    // -----------------------------
    // NON-SAGW OTHER THAN HOME
    // -----------------------------

    // remove tenant segment, rest are page slugs
    const pageSlugs = slug.slice(1);

    // Fetch page data
    const detailPageData = await fetchOtherPagesData({
      locale,
      slugSegments: pageSlugs,
      tenantId: tenantInfo.tenantId,
    });

    if (!detailPageData) {
      return undefined;
    }

    return {
      isHome,
      pageData: detailPageData,
      tenantInfo,
    };
  }

  // -------------------------
  // SAGW OTHER THAN HOME
  // -------------------------

  // all segments are page slugs
  tenantInfo = await getTenantFromUrl(undefined, locale);

  if (!tenantInfo) {
    return undefined;
  }

  // Fetch page data
  const detailPageData = await fetchOtherPagesData({
    locale,
    slugSegments: slug,
    tenantId: tenantInfo.tenantId,
  });

  if (!detailPageData) {
    return undefined;
  }

  return {
    isHome,
    pageData: detailPageData,
    tenantInfo,
  };
};
