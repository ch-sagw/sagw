import 'server-only';
import React from 'react';
import './styles.scss';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { Config } from '@/payload-types';
import { ColorMode } from '@/components/base/types/colorMode';
import { TenantProvider } from '@/app/providers/TenantProvider';
import { getTenant } from '@/app/providers/TenantProvider.server';
import {
  Header, InterfaceHeaderPropTypes,
} from '@/components/global/Header/Header';
import {
  Footer, InterfaceFooterPropTypes,
} from '@/components/global/Footer/Footer';
import { Metadata } from 'next';
import { ConsentBanner } from '@/components/global/ConsentBanner/ConsentBanner';

export const metadata: Metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactElement;
  params: Promise<{ lang: string }>
}): Promise<React.JSX.Element> {
  const lang = (await params).lang as Config['locale'];
  const tenant = await getTenant();
  const payload = await getPayload({
    config: configPromise,
  });

  if (!tenant) {
    return <p>No tenant data</p>;
  }

  const pagesData = await payload.find({
    collection: 'homePage',
    depth: 1,
    limit: 1,
    locale: lang,
    overrideAccess: false,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (!pagesData.docs || pagesData.docs.length < 1) {
    return <p>No pages data</p>;
  }

  const headerData = await payload.find({
    collection: 'header',
    depth: 1,
    limit: 1,
    locale: lang,
    overrideAccess: false,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  const footerData = await payload.find({
    collection: 'footer',
    depth: 1,
    limit: 1,
    locale: lang,
    overrideAccess: false,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (!headerData.docs || headerData.docs.length < 1) {
    return <p>No header data </p>;
  }

  if (!footerData.docs || footerData.docs.length < 1) {
    return <p>No footer data </p>;
  }

  const navData = headerData.docs[0].navigation;

  if (!navData || navData.navItems.length < 1) {
    return <p>No nav items in header data</p>;
  }

  const metanavData = headerData.docs[0].metanavigation;

  if (!metanavData?.metaLinks || metanavData.metaLinks.length < 1) {
    return <p>No metanav data in header data</p>;
  }

  const footerContactData = footerData.docs[0].contact;

  if (!footerContactData.title || !footerContactData.address1 || !footerContactData.countryCode || !footerContactData.zipCode || !footerContactData.city) {
    return <p>Footer Contact data incomplete</p>;
  }

  const footerLegalData = footerData.docs[0].legal;

  if (!footerLegalData.dataPrivacy || !footerLegalData.impressum || !footerLegalData.copyright) {
    return <p>Footer Legal data incomplete</p>;
  }

  const consentCollectionData = await payload.find({
    collection: 'consent',
    depth: 1,
    limit: 1,
    locale: lang,
    overrideAccess: false,
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

    // TODO: get from parent
    currentLang: 'de',
    logoLink: '/',

    // TODO: get from global i18n
    menuButton: {
      close: 'Close',
      open: 'Open',
    },
    metanav: metanavData,
    navigation: navData,
  };

  const footerProps: InterfaceFooterPropTypes = {
    contact: footerContactData,
    legal: footerLegalData,
    metaNav: metanavData,
    navigation: navData,

    // TODO: get from parent
    pageLanguage: 'de',

    socialLinks: footerData.docs[0].socialLinks,

    // TODO
    structuredDataImage: 'https://www.sagw.ch/logo.svg',

    // TODO
    structuredDataUrl: 'https://www.sagw.ch',
  };

  return (
    <html className='theme-sagw' lang='en'>
      <body>

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
          overlay={consentData.overlay}

          // TODO: get from parent
          pageLanguage='de'
        />

      </body>
    </html >
  );
}
