import 'server-only';
import React from 'react';
import {
  InterfaceFooterContact,
  InterfaceFooterLegal,
  InterfaceFooterSocialLinks,
  InterfaceHeaderMetaNavigation,
  InterfaceHeaderNavigation,
} from '@/payload-types';
import { FooterComponent } from '@/components/global/Footer/Footer.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { type InterfaceConsentOverlayClientPropTypes } from '@/components/global/ConsentOverlay/ConsentOverlay.client';
import { generateLinkUrls } from '@/components/global/Header/generateUrls';
import { getPageUrl } from '@/utilities/getPageUrl';

export type InterfaceFooterPropTypes = {
  contact: InterfaceFooterContact;
  legal: InterfaceFooterLegal;
  metaNav: InterfaceHeaderMetaNavigation;
  navigation: InterfaceHeaderNavigation;
  socialLinks?: InterfaceFooterSocialLinks;
  structuredDataImage: string;
  structuredDataUrl: string;
  fg?: {
    sagwLink: string;
    sagwLinkText: string;
  }
  consentOverlay: Omit<InterfaceConsentOverlayClientPropTypes, 'onClose' | 'onConsentGiven'>;
  impressumPageId: string;
  dataPrivacyPageId: string;
}

export const Footer = async (props: InterfaceFooterPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();
  const linkUrls = await generateLinkUrls({
    locale,
    metanav: props.metaNav,
    navigation: props.navigation,
    options: {
      includeMainNavItems: false,
    },
    payload,
  });

  const impressumUrl = await getPageUrl({
    locale,
    pageId: props.impressumPageId,
    payload,
  });

  const dataPrivacyUrl = await getPageUrl({
    locale,
    pageId: props.dataPrivacyPageId,
    payload,
  });

  return (
    <FooterComponent
      {...props}
      linkUrls={linkUrls}
      dataPrivacyUrl={dataPrivacyUrl}
      impressumUrl={impressumUrl}
    />
  );
};
