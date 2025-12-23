import 'server-only';
import React from 'react';
import { TypedLocale } from 'payload';
import { ConsentBanner } from '@/components/global/ConsentBanner/ConsentBanner';
import { rte3ToHtml } from '@/utilities/rteToHtml.server';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { CMSConfigError } from '../utilities/CMSConfigError';

type InterfaceRootLayoutProps = {
  tenant: string;
}

export const RenderConsentBanner = async ({
  tenant,
}: InterfaceRootLayoutProps): Promise<React.JSX.Element> => {
  const payload = await getPayloadCached();
  const locale = (await getLocale()) as TypedLocale;

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
    return <CMSConfigError message='No consent data' />;
  }

  const [consentData] = consentCollectionData.docs;

  // Pre-render ConsentBanner text
  const consentBannerTextHtml = await rte3ToHtml({
    content: consentData.banner.text,
    locale,
    payload,
  });

  return (
    <ConsentBanner
      {...consentData.banner}
      textHtml={consentBannerTextHtml}
    />
  );
};
