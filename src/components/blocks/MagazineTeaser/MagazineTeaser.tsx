import 'server-only';
import React from 'react';
import { InterfaceMagazineTeasersBlock } from '@/payload-types';
import { fetchMagazinePages } from '@/data/fetch';
import { MagazineTeaserComponent } from './MagazineTeaser.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { prerenderPageLinks } from '@/utilities/prerenderPageLinks';
import { getPageUrl } from '@/utilities/getPageUrl';

export type InterfaceMagazineTeaserPropTypes = {
  tenant: string;
} & InterfaceMagazineTeasersBlock;

export const MagazineTeaser = async (props: InterfaceMagazineTeaserPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();
  const {
    tenant,
    ...restProps
  } = props;

  const pages = await fetchMagazinePages({
    limit: 4,
    locale,
    tenant,
  });

  const urlMap = await prerenderPageLinks({
    locale,
    pages,
    payload,
  });

  // Pre-generate URL for optional link if it exists
  let optionalLinkUrl: string | undefined;

  if (restProps.optionalLink?.includeLink && restProps.optionalLink.link?.internalLink?.documentId) {
    optionalLinkUrl = await getPageUrl({
      locale,
      pageId: restProps.optionalLink.link.internalLink.documentId,
      payload,
    });
  }

  return (
    <MagazineTeaserComponent
      {...restProps}
      pages={pages}
      pageUrls={urlMap}
      optionalLinkUrl={optionalLinkUrl}
    />
  );
};
