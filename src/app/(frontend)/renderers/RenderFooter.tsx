import 'server-only';
import React from 'react';
import { TypedLocale } from 'payload';
import {
  Footer, InterfaceFooterPropTypes,
} from '@/components/global/Footer/Footer';
import { preRenderConsentOverlayProps } from '@/components/global/ConsentOverlay/ConsentOverlay.server';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { CMSConfigError } from '../utilities/CMSConfigError';

type InterfaceFooterRendererProps = {
  tenant: string;
}

export const RenderFooter = async ({
  tenant,
}: InterfaceFooterRendererProps): Promise<React.JSX.Element> => {
  const payload = await getPayloadCached();
  const locale = (await getLocale()) as TypedLocale;

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

  if (!footerData.docs || footerData.docs.length !== 1) {
    return <CMSConfigError message='No footer data' />;
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

  if (!headerData.docs || headerData.docs.length !== 1) {
    return <CMSConfigError message='No header data' />;
  }

  // get nav data
  const navData = headerData.docs[0].navigation;

  if (!navData || navData.navItems.length < 1) {
    return <CMSConfigError message='No nav items in header data' />;
  }

  // get metanav data
  const metanavData = headerData.docs[0].metanavigation;

  if (!metanavData?.metaLinks || metanavData.metaLinks.length < 1) {
    return <CMSConfigError message='No metanav data in header data' />;
  }

  // get footer contact data
  const footerContactData = footerData.docs[0].contact;

  if (!footerContactData.title || !footerContactData.address1 || !footerContactData.countryCode || !footerContactData.zipCode || !footerContactData.city) {
    return <CMSConfigError message='Footer Contact data incomplete' />;
  }

  // get footer legal data
  const footerLegalData = footerData.docs[0].legal;

  if (!footerLegalData.dataPrivacy || !footerLegalData.impressum || !footerLegalData.copyright) {
    return <CMSConfigError message='Footer Legal data incomplete' />;
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

  if (!footerDataPrivacyPage || footerDataPrivacyPage.docs.length !== 1) {
    return <CMSConfigError message='Data Privacy page missing' />;
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

  if (!footerImpressumPage || footerImpressumPage.docs.length !== 1) {
    return <CMSConfigError message='Data Privacy page missing' />;
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
    return <CMSConfigError message='No consent Data' />;
  }

  const [consentData] = consentCollectionData.docs;

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
    <Footer
      {...footerProps}
    />
  );
};
