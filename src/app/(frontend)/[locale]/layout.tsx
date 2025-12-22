import 'server-only';
import React from 'react';
import '../styles.scss';
import { TypedLocale } from 'payload';
import { ColorMode } from '@/components/base/types/colorMode';
import { TenantProvider } from '@/app/providers/TenantProvider';
import { getTenant } from '@/app/providers/TenantProvider.server';
import {
  Header, InterfaceHeaderPropTypes,
} from '@/components/global/Header/Header';
import {
  Footer, InterfaceFooterPropTypes,
} from '@/components/global/Footer/Footer';
import { preRenderConsentOverlayProps } from '@/components/global/ConsentOverlay/ConsentOverlay.server';
import { Metadata } from 'next';
import { ConsentBanner } from '@/components/global/ConsentBanner/ConsentBanner';
import { rte3ToHtml } from '@/utilities/rteToHtml.server';
import {
  hasLocale, NextIntlClientProvider,
} from 'next-intl';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { NoJsScript } from '@/components/helpers/noJsScript';
import { getPayloadCached } from '@/utilities/getPayloadCached';

type InterfaceRootLayoutProps = {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export const metadata: Metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
};

export default async function RootLayout({
  children,
  params,
}: InterfaceRootLayoutProps): Promise<React.JSX.Element> {
  const payload = await getPayloadCached();

  const {
    locale: localeString,
  } = await params;

  // Validate and assert locale type
  const locale = localeString as TypedLocale;

  // get tenant id

  const tenant = await getTenant();

  if (!tenant) {
    return <p>No tenant data</p>;
  }

  // get tenant data

  const fullTenant = await payload.findByID({
    collection: 'tenants',
    id: tenant,
  });

  // We need to consider admin disabling/enabling languages in the
  // tenant config in payload

  const tenantLanguages = fullTenant.languages;
  let availableLangauges = routing.locales as TypedLocale[];

  if (tenantLanguages !== undefined) {
    availableLangauges = (routing.locales.filter((routingLocale) => tenantLanguages[routingLocale as keyof typeof tenantLanguages])) as TypedLocale[];
  }

  // If requested local is not configured, return error
  if (!hasLocale(availableLangauges, locale)) {
    notFound();
  }

  // define locale for provider
  setRequestLocale(locale);

  // get pages data
  const pagesData = await payload.find({
    collection: 'homePage',
    depth: 1,
    limit: 1,
    locale,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (!pagesData.docs || pagesData.docs.length < 1) {
    return <p>No pages data</p>;
  }

  // get header data
  const headerData = await payload.find({
    collection: 'header',
    depth: 1,
    limit: 1,
    locale,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (!headerData.docs || headerData.docs.length < 1) {
    return <p>No header data </p>;
  }

  // get footer data
  const footerData = await payload.find({
    collection: 'footer',
    depth: 1,
    limit: 1,
    locale,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (!footerData.docs || footerData.docs.length < 1) {
    return <p>No footer data </p>;
  }

  // get nav data
  const navData = headerData.docs[0].navigation;

  if (!navData || navData.navItems.length < 1) {
    return <p>No nav items in header data</p>;
  }

  // get metanav data
  const metanavData = headerData.docs[0].metanavigation;

  if (!metanavData?.metaLinks || metanavData.metaLinks.length < 1) {
    return <p>No metanav data in header data</p>;
  }

  // get footer contact data
  const footerContactData = footerData.docs[0].contact;

  if (!footerContactData.title || !footerContactData.address1 || !footerContactData.countryCode || !footerContactData.zipCode || !footerContactData.city) {
    return <p>Footer Contact data incomplete</p>;
  }

  // get footer legal data
  const footerLegalData = footerData.docs[0].legal;

  if (!footerLegalData.dataPrivacy || !footerLegalData.impressum || !footerLegalData.copyright) {
    return <p>Footer Legal data incomplete</p>;
  }

  // get footer data-privacy page
  const footerDataPrivacyPage = await payload.find({
    collection: 'dataPrivacyPage',
    depth: 1,
    limit: 1,
    locale,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (footerDataPrivacyPage.docs.length < 1) {
    return <p>Data Privacy page missing</p>;
  }

  // get footer impressum page
  const footerImpressumPage = await payload.find({
    collection: 'impressumPage',
    depth: 1,
    limit: 1,
    locale,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (footerImpressumPage.docs.length < 1) {
    return <p>Data Privacy page missing</p>;
  }

  // get consent data
  const consentCollectionData = await payload.find({
    collection: 'consent',
    depth: 1,
    limit: 1,
    locale,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (!consentCollectionData || consentCollectionData.docs.length !== 1) {
    return <p>No consent Data</p>;
  }

  const [consentData] = consentCollectionData.docs;

  const colorMode: ColorMode = 'dark';

  const headerProps: InterfaceHeaderPropTypes = {
    colorMode,
    logoLink: '/',

    // TODO: get from global i18n
    menuButton: {
      close: 'Close',
      open: 'Open',
    },
    metanav: metanavData,
    navigation: navData,
  };

  // Pre-render ConsentBanner text
  const consentBannerTextHtml = await rte3ToHtml({
    content: consentData.banner.text,
    locale,
    payload,
  });

  // Pre-render ConsentOverlay props
  const consentOverlayProps = await preRenderConsentOverlayProps(consentData.overlay);

  const footerProps: InterfaceFooterPropTypes = {
    consentOverlay: consentOverlayProps,
    contact: footerContactData,
    dataPrivacyPageId: footerDataPrivacyPage.docs[0].id,
    impressumPageId: footerImpressumPage.docs[0].id,
    legal: footerLegalData,
    metaNav: metanavData,
    navigation: navData,
    socialLinks: footerData.docs[0].socialLinks,

    // TODO
    structuredDataImage: 'https://www.sagw.ch/logo.svg',

    // TODO
    structuredDataUrl: 'https://www.sagw.ch',
  };

  return (
    <html
      className='theme-sagw no-js'
      lang={locale}
    >
      <NoJsScript />
      <body>
        <NextIntlClientProvider>

          <Header
            {...headerProps}
          />

          <main>
            <TenantProvider tenant={tenant}>
              {children}
            </TenantProvider>
          </main>

          <Footer
            {...footerProps}
          />

          <ConsentBanner
            {...consentData.banner}
            textHtml={consentBannerTextHtml}
          />
        </NextIntlClientProvider>

      </body>
    </html >
  );
}
