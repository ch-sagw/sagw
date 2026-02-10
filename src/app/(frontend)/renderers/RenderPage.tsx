import 'server-only';
import React from 'react';
import {
  CollectionSlug, TypedLocale,
} from 'payload';
import { RenderBlocks } from '@/app/(frontend)/renderers/RenderBlocks';
import { Hero } from '@/components/global/Hero/Hero';
import { RenderHero } from '@/app/(frontend)/renderers/RenderHero';
import { RenderStatusMessage } from '@/app/(frontend)/renderers/RenderStatusMessage';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  HomePage, I18NGlobal,
} from '@/payload-types';
import { RenderHeader } from './RenderHeader';
import { RenderFooter } from './RenderFooter';
import { RenderConsentBanner } from './RenderConsentBanner';
import { TenantProvider } from '@/app/providers/TenantProvider';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import { CMSConfigError } from '../utilities/CMSConfigError';
import { SkipLinks } from '@/components/global/SkipLinks/SkipLinks';
import { ColorMode } from '@/components/base/types/colorMode';

export interface InterfacePreFetchedHomePageData {
  pageData: HomePage;
  optionalLinkUrl?: string;
}

export interface InterfacePreFetchedOtherPageData {
  pageData: any;
  foundCollection: CollectionSlug;
}

interface InterfacePageRendererProps {
  isHome: boolean;
  locale: TypedLocale;
  tenantId: string;
  pageSlugs?: string[];
  preFetchedData?: InterfacePreFetchedHomePageData | InterfacePreFetchedOtherPageData;
}

interface InterfaceRenderPageContentProps {
  blocks: any;
  sourcePage: { collectionSlug: CollectionSlug; id: string };
  tenantId: string;
  isHome: boolean;
  locale: TypedLocale;
  i18n: I18NGlobal;
  projectId?: string;
  showBlocks?: boolean;
  heroComponent: React.JSX.Element;
  containerType: 'home' | 'detail';
  currentPageId?: string;
  headerColorMode: ColorMode;
}

// Helper to verify lang-config and to render error page
const verifyLangConfig = async ({
  locale,
  tenant,
}: {
  tenant: string;
  locale: TypedLocale;
}): Promise<void> => {
  const payload = await getPayloadCached();
  const fullTenant = await payload.findByID({
    collection: 'tenants',
    id: tenant,
  });

  // We need to consider admin disabling/enabling languages in the
  // tenant config in payload. if a requested language is not enabled on
  // the tenant, we should render 404.

  if (!fullTenant) {
    notFound();
  }

  const tenantLanguages = fullTenant.languages;
  let availableLangauges = routing.locales as TypedLocale[];

  if (tenantLanguages !== undefined) {
    availableLangauges = (routing.locales.filter((routingLocale) => tenantLanguages[routingLocale as keyof typeof tenantLanguages])) as TypedLocale[];
  }

  if (!hasLocale(availableLangauges, locale)) {
    notFound();
  }
};

// render helper
const renderPageContent = ({
  blocks,
  sourcePage,
  tenantId,
  isHome,
  locale,
  i18n,
  showBlocks = true,
  heroComponent,
  containerType,
  headerColorMode,
  projectId,
  currentPageId,
}: InterfaceRenderPageContentProps): React.JSX.Element => (
  <TenantProvider tenant={tenantId}>
    <SkipLinks />
    <RenderHeader
      colorMode={headerColorMode}
      tenant={tenantId}
      currentPageId={currentPageId}
    />
    <div className={containerType === 'home'
      ? 'home'
      : 'detail-page'}>
      {heroComponent}
      <RenderStatusMessage
        tenant={tenantId}
        isHome={isHome}
        locale={locale}
      />
      {showBlocks && blocks && (
        <RenderBlocks
          blocks={blocks}
          tenantId={tenantId}
          i18n={i18n}
          projectId={projectId}
          sourcePage={sourcePage}
        />
      )}
    </div>
    <RenderFooter
      tenant={tenantId}
    />

    <RenderConsentBanner
      tenant={tenantId}
    />
  </TenantProvider>
);

export const RenderPage = async ({
  isHome,
  locale,
  tenantId,
  pageSlugs,
  preFetchedData,
}: InterfacePageRendererProps): Promise<React.JSX.Element> => {
  await verifyLangConfig({
    locale,
    tenant: tenantId,
  });

  const payload = await getPayloadCached();

  // fetch i18n data (needed for both home and detail pages)
  const i18nDataDocs = await payload.find({
    collection: 'i18nGlobals',
    depth: 1,
    limit: 1,
    locale,
    where: {
      tenant: {
        equals: tenantId,
      },
    },
  });

  if (!i18nDataDocs.docs || i18nDataDocs.docs.length < 1) {
    return <CMSConfigError message='No i18n data' />;
  }

  const [i18nData] = i18nDataDocs.docs;
  let homePageData: HomePage | undefined;
  let optionalLinkUrl: string | undefined;

  if (preFetchedData) {
    if (isHome && 'optionalLinkUrl' in preFetchedData) {
      const homeData = preFetchedData as InterfacePreFetchedHomePageData;

      homePageData = homeData.pageData;

      /* eslint-disable prefer-destructuring */
      optionalLinkUrl = homeData.optionalLinkUrl;
      /* eslint-enable prefer-destructuring */
    }
  }

  // Handle home page
  if (isHome) {
    if (!homePageData) {
      return <CMSConfigError message='No data for HomePage found.' />;
    }

    return renderPageContent({
      blocks: homePageData.content,
      containerType: 'home',
      currentPageId: homePageData.id,
      headerColorMode: 'dark',
      heroComponent: (
        <Hero
          {...homePageData.hero}
          type='home'
          optionalLinkUrl={optionalLinkUrl}
        />
      ),
      i18n: i18nData,
      isHome,
      locale,
      sourcePage: {
        collectionSlug: 'homePage',
        id: homePageData.id,
      },
      tenantId,
    });
  }

  // handle other pages
  if (!pageSlugs || pageSlugs.length === 0) {
    return <CMSConfigError message='Something is wrong with the url structure' />;
  }

  let otherPageData: any;
  let foundCollection: CollectionSlug | undefined;

  if (preFetchedData) {
    const detailData = preFetchedData as InterfacePreFetchedOtherPageData;

    otherPageData = detailData.pageData;

    /* eslint-disable prefer-destructuring */
    foundCollection = detailData.foundCollection;
    /* eslint-enable prefer-destructuring */
  }

  if (!foundCollection) {
    return <CMSConfigError message='Page data not found.' />;
  }

  // Get content blocks - some pages have content, others have blocks.content
  let contentBlocks = null;

  if ('content' in otherPageData && otherPageData.content) {
    contentBlocks = otherPageData.content;
  } else if ('blocks' in otherPageData && otherPageData.blocks && 'content' in otherPageData.blocks) {
    contentBlocks = otherPageData.blocks.content;
  }

  const collectionSlug = foundCollection;

  // Get ColorMode for header from hero component
  const headerColorMode = otherPageData.hero?.colorMode || 'white';

  let projectId = null;

  if (collectionSlug === 'projectDetailPage') {
    projectId = otherPageData.project.id;
  }

  return renderPageContent({
    blocks: contentBlocks,
    containerType: 'detail',
    currentPageId: otherPageData.id,
    headerColorMode,
    heroComponent: (
      <RenderHero
        foundCollection={collectionSlug}
        pageData={otherPageData}
        i18nGeneric={i18nData.generic}
        locale={locale}
      />
    ),
    i18n: i18nData,
    isHome,
    locale,
    projectId,
    showBlocks: Boolean(contentBlocks),
    sourcePage: {
      collectionSlug,
      id: otherPageData.id,
    },
    tenantId,
  });
};

