import 'server-only';
import React from 'react';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { Hero } from '@/components/global/Hero/Hero';
import { ErrorPage } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { renderPageContent } from '@/app/(frontend)/renderers/RenderPage';
import { CMSConfigError } from '@/app/(frontend)/utilities/CMSConfigError';
import { getTenantFromUrl } from '@/app/(frontend)/utilities/getTenantFromUrl';
import { getThemeNameForTenant } from '@/app/(frontend)/utilities/getThemeNameForTenant';

type InterfaceRenderNotFoundPageProps = {
  locale: TypedLocale;
  slugSegments: string[];
};

/**
 * Shared not-found UI (header, footer, tenant theme, CMS error copy).
 * Pass `slugSegments` from `[...slug]/page` so tenant matches getPageData when
 * pathname headers are missing on the internal not-found render.
 */
export const RenderNotFoundPage = async ({
  locale,
  slugSegments,
}: InterfaceRenderNotFoundPageProps): Promise<React.JSX.Element> => {
  const firstSegment = slugSegments.length > 0
    ? slugSegments[0]
    : undefined;
  const tenantInfo = await getTenantFromUrl(firstSegment, locale);

  const payload = await getPayloadCached();
  const i18nDataDocs = await payload.find({
    collection: 'i18nGlobals',
    depth: 1,
    limit: 1,
    locale,
    where: {
      tenant: {
        equals: tenantInfo.tenantId,
      },
    },
  });

  if (!i18nDataDocs.docs || i18nDataDocs.docs.length < 1) {
    return <CMSConfigError message='No i18n data' />;
  }

  const [i18nData] = i18nDataDocs.docs;

  const errorPageDocs = await payload.find({
    collection: 'errorPage',
    depth: 0,
    limit: 1,
    locale,
    where: {
      tenant: {
        equals: tenantInfo.tenantId,
      },
    },
  });

  if (!errorPageDocs.docs || errorPageDocs.docs.length < 1) {
    return <CMSConfigError message='No error page data' />;
  }

  const errorPageDoc = errorPageDocs.docs[0] as ErrorPage;
  const titleHtml = rteToHtml(errorPageDoc.error400.title);
  const descriptionHtml = rteToHtml(errorPageDoc.error400.description);
  const homeButtonHtml = rteToHtml(errorPageDoc.homeButtonText);

  const themeName = await getThemeNameForTenant({
    isSagw: tenantInfo.isSagw,
    tenantId: tenantInfo.tenantId,
  });

  const homeHref = tenantInfo.isSagw || !tenantInfo.tenantSlug
    ? `/${locale}`
    : `/${locale}/${tenantInfo.tenantSlug}`;

  return renderPageContent({
    blocks: null,
    containerType: 'detail',
    headerColorMode: 'light',
    heroComponent: (
      <Hero
        descriptionHtml={descriptionHtml}
        homeButtonHtml={homeButtonHtml}
        homeHref={homeHref}
        titleHtml={titleHtml}
        type='error'
      />
    ),
    i18n: i18nData,
    isHome: false,
    locale,
    showBlocks: false,
    skipStatusMessage: true,
    sourcePage: {
      collectionSlug: 'errorPage',
      id: errorPageDoc.id,
    },
    tenantId: tenantInfo.tenantId,
    themeName,
  });
};
