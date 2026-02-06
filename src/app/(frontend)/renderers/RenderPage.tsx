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
import { getPageUrl } from '@/utilities/getPageUrl';
import { findPageByPath } from '@/app/(frontend)/utilities/findPageByPath';
import { I18NGlobal } from '@/payload-types';
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
interface InterfacePageRendererProps {
  isHome: boolean;
  locale: TypedLocale;
  tenantId: string;
  pageSlugs?: string[];
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
}: InterfacePageRendererProps): Promise<React.JSX.Element> => {
  await verifyLangConfig({
    locale,
    tenant: tenantId,
  });

  const payload = await getPayloadCached();

  // Fetch i18n data (needed for both home and detail pages)
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

  // Handle home page
  if (isHome) {
    const pagesData = await payload.find({
      collection: 'homePage',
      depth: 1,
      limit: 1,
      locale,
      where: {
        tenant: {
          equals: tenantId,
        },
      },
    });

    if (!pagesData.docs || pagesData.docs.length < 1) {
      notFound();
    }

    const [pageData] = pagesData.docs;

    // Compute URL for optionalLink if it exists
    let optionalLinkUrl: string | undefined;

    if (pageData.hero?.optionalLink?.includeLink && pageData.hero.optionalLink.link?.internalLink?.documentId) {
      optionalLinkUrl = await getPageUrl({
        locale,
        pageId: pageData.hero.optionalLink.link.internalLink.documentId,
        payload,
      });
    }

    return renderPageContent({
      blocks: pageData.content,
      containerType: 'home',
      currentPageId: pageData.id,
      headerColorMode: 'dark',
      heroComponent: (
        <Hero
          {...pageData.hero}
          type='home'
          optionalLinkUrl={optionalLinkUrl}
        />
      ),
      i18n: i18nData,
      isHome,
      locale,
      sourcePage: {
        collectionSlug: 'homePage',
        id: pageData.id,
      },
      tenantId,
    });
  }

  // Handle other pages
  if (!pageSlugs || pageSlugs.length === 0) {
    return <CMSConfigError message='Something is wrong with the url structure' />;
  }

  const pageResult = await findPageByPath({
    locale,
    slugSegments: pageSlugs,
    tenantId,
  });

  if (!pageResult) {
    notFound();
  }

  const {
    pageData,
    foundCollection,
  } = pageResult;

  // Get content blocks - some pages have content, others have blocks.content
  let contentBlocks = null;

  if ('content' in pageData && pageData.content) {
    contentBlocks = pageData.content;
  } else if ('blocks' in pageData && pageData.blocks && 'content' in pageData.blocks) {
    contentBlocks = pageData.blocks.content;
  }

  const collectionSlug = foundCollection as CollectionSlug;

  // Get ColorMode for header from hero component
  const headerColorMode = pageData.hero?.colorMode || 'white';

  let projectId = null;

  if (collectionSlug === 'projectDetailPage') {
    projectId = pageData.project.id;
  }

  return renderPageContent({
    blocks: contentBlocks,
    containerType: 'detail',
    currentPageId: pageData.id,
    headerColorMode,
    heroComponent: (
      <RenderHero
        foundCollection={collectionSlug}
        pageData={pageData}
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
      id: pageData.id,
    },
    tenantId,
  });
};

